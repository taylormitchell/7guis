import _ from "lodash";
import { Parser, CellRef, CellRefRange, Func, Literal, ParseError } from "./parser";

const ERROR = "#ERROR";

export const colNumToSheetId = (n) => {
  let ordA = "A".charCodeAt(0);
  let ordZ = "Z".charCodeAt(0);
  let len = ordZ - ordA + 1;
  let s = "";
  while (n >= 0) {
    s = String.fromCharCode((n % len) + ordA) + s;
    n = Math.floor(n / len) - 1;
  }
  return s;
};
export const rowNumToSheetId = (n) => {
  return (n + 1).toString();
};
export const coordToSheetId = (r, c) => {
  return colNumToSheetId(c) + rowNumToSheetId(r);
};
export const colSheetIdToNum = (id) => {
  // Get column number
  let ordA = "A".charCodeAt(0);
  let ordZ = "Z".charCodeAt(0);
  let len = ordZ - ordA + 1;
  let chars = id.split("").reverse();
  let n = chars[0].charCodeAt(0) - ordA;
  for (let i = 1; i < chars.length; i++) {
    let dist = chars[i].charCodeAt(0) - ordA + 1;
    n += dist * len ** i;
  }
  return n;
};
export const rowSheetIdToNum = (id) => {
  return parseInt(id) - 1;
};
export const sheetIdToCoord = (id) => {
  let colId = id.match(/[A-Z]+/)[0];
  let rowId = id.match(/[0-9]+/)[0];
  return [rowSheetIdToNum(rowId), colSheetIdToNum(colId)];
};

class EvalError extends Error {
  constructor(message) {
    super(message);
    this.name = "RuntimeError";
  }
}

class Cell {
  constructor(
    value = "",
    exprStr = "",
    subscriptions = [],
    subscribers = [],
    message = null,
    hasError = false
  ) {
    this.id = _.uniqueId("cell_");
    this.value = value;
    this.exprStr = exprStr;
    this.subscriptions = subscriptions;
    this.subscribers = subscribers;
    this.message = message;
    this.hasError = hasError;
  }
}

export class Grid {
  constructor(nRows, nCols) {
    let rows = [];
    for (let r = 0; r < nRows; r++) {
      let row = [];
      for (let c = 0; c < nCols; c++) {
        let cell = new Cell();
        row.push(cell);
      }
      rows.push(row);
    }
    return rows;
  }
}

export const get = (cells, id) => {
  // Spreadsheet-style id format
  if (id.match(/[A-Z]+[0-9]+/)) {
    const [r, c] = sheetIdToCoord(id);
    return cells[r][c];
    // Internal id format
  } else if (id.startsWith("cell_")) {
    for (let row of cells) {
      for (let cell of row) {
        if (cell.id === id) {
          return cell;
        }
      }
    }
  }
};

export const set = (cells, id, props) => {
  let cell = get(cells, id);
  let [r, c] = getCoord(cells, id);
  return [
    ...cells.slice(0, r),
    [...cells[r].slice(0, c), {...cell, ...props}, ...cells[r].slice(c + 1)],
    ...cells.slice(r + 1),
  ];
};

export const setExpression = (cells, id, expressionStr) => {
  let newCells = set(cells, id, { exprStr: expressionStr });

  // Remove old subscriptions
  let sheetId = getSheetId(newCells, id);
  get(newCells, id).subscriptions.forEach(subscriptionSheetId => {
    let subscriptionCell = get(newCells, subscriptionSheetId);
    newCells = set(newCells, subscriptionSheetId, {
      subscribers: subscriptionCell.subscribers.filter(subscriberSheetId => subscriberSheetId !== sheetId),
    });
  });
  
  // Add new subscriptions
  let parser = new Parser(expressionStr);
  let expr = parser.parse();
  newCells = set(newCells, id, {subscriptions: getExprDependencies(expr)});

  // Update subscriber lists
  get(newCells, id).subscriptions.forEach(subscriptionSheetId => {
    let subscribedCell = get(newCells, subscriptionSheetId);
    if(!subscribedCell.subscribers.includes(sheetId)) {
      newCells = set(newCells, subscriptionSheetId, {
        subscribers: subscribedCell.subscribers.concat(sheetId),
      });
    }
  });
  // }

  return evaluate(newCells, id);
};

export const evaluate = (cells, id) => {
  let newCells = cells;

  let sheetId = getSheetId(newCells, id);

  // Evaluate cell
  let exprStr = get(newCells, id).exprStr
  let parser = new Parser(exprStr);
  let expr = parser.parse();
  if (expr instanceof ParseError) {
    newCells = set(newCells, id, {
      value: exprStr,
      message: expr.message,
      hasError: true,
    });
  } else if(get(newCells, id).subscriptions.includes(sheetId)) {
    newCells = set(newCells, id, {
      value: exprStr,
      message: "Circular dependency",
      hasError: true,
    });
    return newCells
  } else {
    try {
      let res = evaluateExpr(newCells, expr);
      if(res === null) {
        throw new Error("Internal error: Unknown expression type");
      } else if(res instanceof Array) {
        throw new Error("Cell value cannot be an array");
      }      
      newCells = set(newCells, id, {
        value: res,
        message: null,
        hasError: false,
      });
    } catch (e) {
      newCells = set(newCells, id, {
        value: exprStr,
        message: e.message,
        hasError: true,
      });
    }
  }

  // Evaluate subscribers
  get(newCells, id).subscribers.forEach((subscriberSheetId) => {
    newCells = evaluate(newCells, subscriberSheetId);
  });

  return newCells;
};

const getExprDependencies = (expr) => {
  if (expr instanceof CellRef) {
    return [expr.id];
  } else if (expr instanceof CellRefRange) {
    return cellRefRangeToList(expr.id1, expr.id2);
  } else if (expr instanceof Func) {
    return expr.args
      .map((arg) => getExprDependencies(arg))
      .reduce((a, b) => a.concat(b), []);
  }
  return [];
};

const evaluateExpr = (cells, expr) => {
  if (expr instanceof Literal) {
    return expr.value;
  } else if (expr instanceof CellRef) {
    let cell = get(cells, expr.id);
    if(cell.hasError) {
      let sheetId = getSheetId(cells, expr.id);
      throw new EvalError(`Referenced cell ${sheetId} has an error: ${cell.message}`);
    }
    return cell.value;
  } else if (expr instanceof CellRefRange) {
    return cellRefRangeToList(expr.id1, expr.id2).map(id => get(cells, id).value)
  } else if (expr instanceof Func) {
    return evaluateFunc(cells, expr.name, expr.args);
  } else if (expr instanceof ParseError) {
    throw new Error(expr.message);
  }
};

const evaluateFunc = (cells, name, argExprs) => {
  let args = [];
  argExprs.forEach((expr) => {
    if (expr instanceof CellRefRange) {
      args = args.concat(evaluateExpr(cells, expr));
    } else {
      args.push(evaluateExpr(cells, expr));
    }
  });
  if (name === "add") {
    if (args.length !== 2) {
      throw new Error("Expected 2 arguments");
    }
    return args.reduce((a, b) => a + b);
  } else if (name === "sub") {
    if (args.length !== 2) {
      throw new Error("Expected 2 arguments");
    }
    return args.reduce((a, b) => a - b);
  } else if (name === "mul") {
    if (args.length !== 2) {
      throw new Error("Expected 2 arguments");
    }
    return args.reduce((a, b) => a * b);
  } else if (name === "div") {
    if (args.length !== 2) {
      throw new Error("Expected 2 arguments");
    }
    return args.reduce((a, b) => a / b);
  } else if (name === "sum") {
    return args.reduce((a, b) => a + b);
  } else if (name === "avg") {
    return args.reduce((a, b) => a + b) / args.length;
  } else if (name === "min") {
    return Math.min(...args);
  } else if (name === "max") {
    return Math.max(...args);
  } else if (name === "count") {
    return args.length;
  }
};

export const cellRefRangeToList = (id1, id2) => {
  const [r1, c1] = sheetIdToCoord(id1);
  const [r2, c2] = sheetIdToCoord(id2);
  if (c1 === c2) {
    return _.range(r1, r2 + 1).map((r) => coordToSheetId(r, c1));
  }
  if (r1 === r2) {
    return _.range(c1, c2 + 1).map((c) => coordToSheetId(r1, c));
  }
  return new Error("Cells must be in the same row or column");
}

export const shape = (cells) => {
  return [cells.length, cells[0].length];
};

export const getCoord = (cells, id) => {
  let cell = get(cells, id);
  for (let r = 0; r < cells.length; r++) {
    let row = cells[r];
    for (let c = 0; c < row.length; c++) {
      if (row[c].id === cell.id) {
        return [r, c];
      }
    }
  }
};

const getSheetId = (cells, id) => {
  const [r, c] = getCoord(cells, id);
  return coordToSheetId(r, c);
}

export const getAbove = (cells, id) => {
  let [row, col] = getCoord(cells, id);
  row = row > 0 ? row - 1 : 0;
  return cells[row][col];
};
export const getBelow = (cells, id) => {
  let [row, col] = getCoord(cells, id);
  row = row < cells.length - 1 ? row + 1 : row;
  return cells[row][col];
};
export const getRight = (cells, id) => {
  let [row, col] = getCoord(cells, id);
  col = col < cells[0].length - 1 ? col + 1 : col;
  return cells[row][col];
};
export const getLeft = (cells, id) => {
  let [row, col] = getCoord(cells, id);
  col = col > 0 ? col - 1 : 0;
  return cells[row][col];
};

export const appendColumn = (cells) => {
  return cells.map((row) => [...row, new Cell()]);
};

export const appendRow = (cells) => {
  return [...cells, cells[0].map(() => new Cell())];
};

export const getColumnOrder = (cells, id) => {
  return getCoord(cells, id)[1];
};

export const getRowOrder = (cells, id) => {
  return getCoord(cells, id)[0];
};
