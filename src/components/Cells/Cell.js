import { useState } from "react";
import style from "./Cells.module.css";

const Cell = (props) => {
  const [inputField, setInputField] = useState(props.exprStr);

  return (
    <div
      id={props.id}
      className={style["cell"] + (props.hasError ? " " + style["error"] : "")}
      style={{
        gridRow: props.row + 2,
        gridColumn: props.column + 2,
        width: `${props.width}px`,
        height: `${props.height}px`,
      }}
      title={props.message}
      onClick={!props.isSelected ? props.onClick : null}
    >
      {props.isSelected ? (
        <input
          type="text"
          value={inputField}
          onChange={(e) => setInputField(e.target.value)}
          onBlur={props.onBlur}
          onKeyPress={props.onKeyPress}
          onKeyDown={props.onKeyDown}
        ></input>
      ) : (
        <div>{props.value}</div>
      )}
    </div>
  );
};

export default Cell;
