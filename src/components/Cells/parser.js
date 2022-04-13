class Expr {}

class Func extends Expr {
  constructor(name, args) {
    super();
    this.name = name;
    this.args = args;
  }
}

class CellRef extends Expr {
  constructor(id) {
    super();
    this.id = id;
  }
}

class CellRefRange extends Expr {
  constructor(id1, id2) {
    super();
    this.id1 = id1;
    this.id2 = id2;
  }
}

class Literal extends Expr {
  constructor(value) {
    super();
    this.value = value;
  }
}

class ParseError extends Error {
  constructor(message) {
    super(message);
    this.name = "ParseError";
  }
}

class Parser {
  constructor(string) {
    this.string = string;
    this.current = 0;
  }
  parse = () => {
    if (this.match("=")) {
      return this.parseExpression();
    } else {
      return this.parseLiteral();
    }
  };
  parseExpression = () => {
    let expr;
    expr = this.parseFunc();
    if (expr) return expr;
    expr = this.parseCells();
    if (expr) return expr;
    expr = this.parseNumber();
    if (expr) return expr;
    expr = this.parseString();
    if (expr) return expr;
    return new ParseError("Expected function, cell, or literal");
  };
  parseLiteral = () => {
    let start = this.current;
    let literal = this.parseNumber();
    if (literal && this.isAtEnd()) {
      return literal;
    } else {
      this.current = this.string.length;
      return new Literal(this.string.slice(start));
    }
  };
  parseFunc = () => {
    let start = this.current;
    let name = "";
    while (!this.isAtEnd() && this.peak() !== "(") {
      name += this.advance();
    }
    if (!this.match("(")) {
      this.current = start;
      return null;
    }
    let args = [];
    while (!this.isAtEnd() && this.peak() !== ")") {
      let arg = this.parseExpression();
      if (arg instanceof ParseError) {
        return new ParseError("Expected function, cells, or literal after '('");
      }
      args.push(arg);
      this.match(/^\s*,\s*/);
    }
    if (!this.match(")")) {
      return new ParseError("Expected ')'");
    }
    return new Func(name, args);
  };
  parseString = () => {
    let start = this.current;
    let string = "";
    // TODO: handle escaped quotes
    // Get quote character
    let quoteChar;
    if (this.peak() === '"') {
      quoteChar = '"';
    } else if (this.peak() === "'") {
      quoteChar = "'";
    } else {
      this.current = start;
      return null;
    }
    // Get string
    this.advance();
    while (this.peak() !== quoteChar && !this.isAtEnd()) {
      string += this.advance();
    }
    if (this.peak() !== quoteChar) {
      return new ParseError(`Expected '${quoteChar}'`);
    }
    this.advance();
    return new Literal(string);
  };
  parseNumber = () => {
    let m = this.string.slice(this.current).match(/^[1-9]?[0-9]+/);
    if (!m) return null;
    this.advance(m[0].length);
    return new Literal(Number(m[0]));
  };
  parseCells = () => {
    let start = this.current;
    let cell1 = this.parseCell();
    if (!cell1) {
      this.current = start;
      return null;
    }
    if (this.match(":")) {
      let cell2 = this.parseCell();
      if (!cell2) {
        return new ParseError("Expected cell after ':'");
      }
      return new CellRefRange(cell1.id, cell2.id);
    }
    return cell1;
  };
  parseCell = () => {
    let start = this.current;
    let id = "";
    if (!this.peak().match(/[A-Z]/)) {
      this.current = start;
      return null;
    }
    id += this.advance();
    if (!this.peak().match(/[1-9]/)) {
      this.current = start;
      return null;
    }
    id += this.advance();
    while (this.peak().match(/[0-9]/)) {
      id += this.advance();
    }
    return new CellRef(id);
  };
  peak = (i = 1) => {
    if (i < 0) throw new Error("Negative index passed to Parser.peak");
    return this.string.slice(this.current, this.current + i);
  };
  advance = (i = 1) => {
    if (!this.isAtEnd()) this.current += i;
    if (i === 0) return this.string[this.current - 1];
    return this.string.slice(this.current - i, this.current);
  };
  isAtEnd = () => {
    return this.current >= this.string.length;
  };
  match = (...pats) => {
    for (let pat of pats) {
      if (pat instanceof RegExp) {
        // Ensure pattern starts with ^
        let patStr = pat.toString().slice(1, -1);
        if (patStr[0] !== "^") {
          patStr = "^" + patStr;
          pat = new RegExp(patStr);
        }
        let m = this.string.slice(this.current).match(pat);
        if (m) {
          this.advance(m[0].length);
          return true;
        }
      } else if (typeof pat === "string") {
        if (this.peak(pat.length) === pat) {
          this.advance(pat.length);
          return true;
        }
      }
    }
    return false;
  };
}

export { Parser, CellRef, CellRefRange, Func, Literal, ParseError };
