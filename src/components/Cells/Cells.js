import { useEffect, useState } from "react";
import _ from "lodash";
import * as sheet from "./sheet";
import Cell from "./Cell";
import Header from "./Header";
import style from "./Cells.module.css";

class RowStyle {
  constructor(height) {
    this.id = _.uniqueId("row_");
    this.height = height;
  }
}

class ColumnStyle {
  constructor(width) {
    this.id = _.uniqueId("header_");
    this.width = width;
  }
}

const Cells = (props) => {
  const initRowCount = 3;
  const initColCount = 3;
  const initRowHeight = 30;
  const initColWidth = 80;
  const [cells, setCells] = useState(new sheet.Grid(initRowCount, initColCount));
  const [columnsStyle, setColumnsStyle] = useState(() => {
    return _.range(initColCount).map(() => new ColumnStyle(initColWidth));
  });
  const [rowsStyle, setRowsStyle] = useState(() => {
    return _.range(initRowCount).map(() => new RowStyle(initRowHeight));
  });
  const columnOfRowHeadersStyle = new ColumnStyle(50);
  const rowOfColumnHeadersStyle = new RowStyle(initRowHeight);

  const [selectedCell, setSelectedCell] = useState(null);

  // Focus on input of selected cell
  useEffect(() => {
    let el = document.querySelector(`#${selectedCell} input`);
    if (el) el.focus();
  }, [selectedCell]);

  // Evaluate cells after leaving input field
  const onBlur = (id, event) => {
    let expr = event.target.value;
    setCells((cells) => sheet.setExpression(cells, id, expr));
    setSelectedCell(null);
  };

  // Navigation and evaluation
  const moveToCell = (idFrom, idTo) => {
    if (idFrom === idTo) return;
    let el = document.querySelector(`#${idFrom} input`);
    if (el) el.blur();
    setSelectedCell(idTo);
  };
  const onKeyPress = (id, event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      moveToCell(id, sheet.getBelow(cells, id).id);
    }
  };
  const onKeyDown = (id, event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveToCell(id, sheet.getAbove(cells, id).id);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      moveToCell(id, sheet.getBelow(cells, id).id);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveToCell(id, sheet.getLeft(cells, id).id);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      moveToCell(id, sheet.getRight(cells, id).id);
    }
  };

  // Adding cells
  const appendColumnHandler = () => {
    setCells((cells) => sheet.appendColumn(cells));
    setColumnsStyle((state) => [...state, new ColumnStyle(initColWidth)]);
  };
  const appendRowHandler = () => {
    setCells((cells) => sheet.appendRow(cells));
    setRowsStyle((state) => [...state, new RowStyle(initRowHeight)]);
  };

  // Resizing cells
  const resizeColumnHandler = (order, event) => {
    setColumnsStyle((styles) => {
      let style = styles[order];
      let rect = document.getElementById(style.id).getBoundingClientRect();
      let width = event.clientX - rect.left;
      return [...styles.slice(0, order), { ...style, width: width }, ...styles.slice(order + 1)];
    });
  };
  const resizeRowHandler = (order, event) => {
    setRowsStyle((styles) => {
      let style = styles[order];
      let rect = document.getElementById(style.id).getBoundingClientRect();
      let height = event.clientY - rect.top;
      return [...styles.slice(0, order), { ...style, height: height }, ...styles.slice(order + 1)];
    });
  };

  return (
    <div className={style["table-container"]}>
      <div className={style["table"]}>
        <div className={style["header"]}></div>
        {/* Column Headers */}
        {columnsStyle.map((c, i) => (
          <Header
            type="column"
            key={c.id}
            id={c.id}
            title={sheet.colNumToSheetId(i)}
            gridRow={1}
            gridColumn={i + 2}
            height={rowOfColumnHeadersStyle.height}
            width={c.width}
            order={i}
            resizeHandler={(e) => resizeColumnHandler(i, e)}
            containsSelection={
              selectedCell ? sheet.getColumnOrder(cells, selectedCell) === i : false
            }
          />
        ))}
        {/* Row Headers */}
        {rowsStyle.map((r, i) => (
          <Header
            type="row"
            key={r.id}
            id={r.id}
            title={sheet.rowNumToSheetId(i)}
            gridRow={i + 2}
            gridColumn={1}
            height={r.height}
            width={columnOfRowHeadersStyle.width}
            order={i}
            resizeHandler={(e) => resizeRowHandler(i, e)}
            containsSelection={selectedCell ? sheet.getRowOrder(cells, selectedCell) === i : false}
          />
        ))}
        {/* Cells */}
        {cells.map((row, r) =>
          row.map((cell, c) => {
            return (
              <Cell
                key={cell.id}
                {...cell}
                row={r}
                column={c}
                isSelected={selectedCell === cell.id}
                onBlur={onBlur.bind(null, cell.id)}
                onKeyPress={onKeyPress.bind(null, cell.id)}
                onKeyDown={onKeyDown.bind(null, cell.id)}
                onClick={() => setSelectedCell(cell.id)}
                width={columnsStyle[c].width}
                height={rowsStyle[r].height}
              />
            );
          })
        )}
        <button
          onClick={appendColumnHandler}
          style={{ gridRow: `1 / ${cells.length + 2}`, gridColumn: cells[0].length + 2 }}
        >
          +
        </button>
        <button
          onClick={appendRowHandler}
          style={{ gridRow: cells.length + 2, gridColumn: `1 / ${cells[0].length + 2}` }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Cells;
