import React from "react";
import WindowButton from "./WindowButton";
import style from "./Window.module.css";

const WindowHeader = (props) => {
  return (
    <div
      className={style["window-header"]}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
    >
      <div>
        <span>{props.title}</span>
      </div>
    </div>
  );
};

export default WindowHeader;
