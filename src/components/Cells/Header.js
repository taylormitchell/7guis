import { useState, useEffect } from "react";
import style from "./Cells.module.css";

const Header = (props) => {
  // Handle column resizing
  const [resizing, setResizing] = useState(false);
  const { resizeHandler } = props;
  const endResizingHandler = () => setResizing(false);
  useEffect(() => {
    if (resizing) {
      document.addEventListener("mousemove", resizeHandler);
      document.addEventListener("mouseup", endResizingHandler);
    }
    return () => {
      document.removeEventListener("mousemove", resizeHandler);
      document.removeEventListener("mouseup", endResizingHandler);
    };
  }, [resizing, resizeHandler]);

  const flexDirection = props.type === "column" ? "row" : "column";

  return (
    <div
      id={props.id}
      className={
        style["header"] +
        (props.type === "column" ? " " + style["column"] : " " + style["row"]) +
        (props.containsSelection ? " " + style["selected"] : "")
      }
      style={{
        gridRow: props.gridRow,
        gridColumn: props.gridColumn,
        width: `${props.width}px`,
        height: `${props.height}px`,
        flexDirection,
      }}
    >
      <div className={style["start-area"]}></div>
      <div className={style["center-area"]} style={{flexDirection}}>
        <span>{props.title}</span>
      </div>
      <div className={style["end-area"]} style={{flexDirection}}>
        <div className={style["resize-area"]} onMouseDown={() => setResizing(true)}></div>
      </div>
    </div>
  );
};

export default Header;
