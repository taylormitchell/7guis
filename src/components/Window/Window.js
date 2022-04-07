import React from "react";
import style from "./Window.module.css";
import WindowHeader from "./WindowHeader";

const Window = (props) => {
  return (
    <div
      className={style.window}
    >
      <WindowHeader 
        title={props.title} 
        />
      {props.children}
    </div>
  );
};

export default Window;
