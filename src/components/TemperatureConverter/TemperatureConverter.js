import React, { useState } from "react";
import styles from "./TemperatureConverter.module.css";

const TemperatureConverter = (props) => {
  const [tempCInput, setTempCInput] = useState("");
  const [tempFInput, setTempFInput] = useState("");

  const CtoF = (c) => Math.round(((c * 9) / 5 + 32)*10)/10;
  const FtoC = (f) => Math.round((((f - 32) * 5) / 9)*10)/10;

  const createChangeHandler = (inputSetter, outputSetter, inputToOutput) => {
    return (e) => {
      inputSetter(e.target.value);
      let temp = e.target.value === "" ? NaN : Number(e.target.value);
      if (!isNaN(temp)) {
        outputSetter(inputToOutput(temp));
      }
    };
  };
  const cChangeHandler = createChangeHandler(setTempCInput, setTempFInput, CtoF);
  const fChangeHandler = createChangeHandler(setTempFInput, setTempCInput, FtoC);

  return (
    <div className={styles["temperature-converter"]}>
      <input type="text" value={tempCInput} onChange={cChangeHandler}></input>
      <span>°C</span>
      <span className={styles["equal-size"]}>=</span>
      <input type="text" value={tempFInput} onChange={fChangeHandler}></input>
      <span>°F</span>
    </div>
  );
};

export default TemperatureConverter;
