import { useState, Fragment } from "react";
import style from "./Cells.module.css";

const Cell = (props) => {
  const [inputField, setInputField] = useState(props.exprStr);
  const [hovering, setHovering] = useState(false);

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
      onClick={!props.isSelected ? props.onClick : null}
      onMouseEnter={() => setHovering(true) }
      onMouseLeave={() => setHovering(false) }
    >
      {props.isSelected ? (
        <input
          className={style["cell-input"]}
          type="text"
          value={inputField}
          onChange={(e) => setInputField(e.target.value)}
          onBlur={props.onBlur}
          onKeyPress={props.onKeyPress}
          onKeyDown={props.onKeyDown}
          
        ></input>
      ) : (
        <div className={style["cell-output"]}>{props.value}</div>
      )}
        {(props.hasError && hovering) && (
        <div
          className={style["error-hint"]}
          style={{ position: "absolute", top: 0, left: props.width, zIndex: 99 }}
        >
          <h1>ERROR</h1>
          <p>{props.message}</p>
        </div>)}
    </div>
  );
};

export default Cell;
