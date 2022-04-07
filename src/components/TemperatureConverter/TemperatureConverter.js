import React, { useState } from "react";
import styles from "./TemperatureConverter.module.css";

const TemperatureConverter = (props) => {
  const [tempCInput, setTempCInput] = useState("");
  const [tempFInput, setTempFInput] = useState("");

  const CtoF = (c) => (c * 9) / 5 + 32;
  const FtoC = (f) => ((f - 32) * 5) / 9;

  const createChangeHandler = (inputSetter, outputSetter, inputToOutput) => {
    return (e) => {
      let temp = e.target.value === "" ? NaN : Number(e.target.value);
      if (!isNaN(temp)) {
        inputSetter(temp);
        outputSetter(inputToOutput(temp));
      } else {
        inputSetter(e.target.value);
      }
    };
  };
  const cChangeHandler = createChangeHandler(setTempCInput, setTempFInput, CtoF);
  const fChangeHandler = createChangeHandler(setTempFInput, setTempCInput, FtoC);

  return (
    <div className={styles["temperature-converter"]}>
      <input type="text" value={tempCInput} onChange={cChangeHandler}></input>
      <span>Celsius = </span>
      <input type="text" value={tempFInput} onChange={fChangeHandler}></input>
      <span>Fahrenheit</span>
    </div>
  );
};

export default TemperatureConverter;
