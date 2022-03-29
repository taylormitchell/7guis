import Window from "../Window/Window";
import DateField from "./DateField";
import style from "./FlightBooker.module.css";
import { useState } from "react";

function strToDate(dateString) {
  if (!dateString.match(/\d\d\.\d\d.\d\d\d\d/)) {
    return new Date("");
  }
  const [day, month, year] = dateString.split(".").map((s) => Number(s));
  const date = new Date(year, month - 1, day);
  // TODO: real date validation cause Date will take anything...
  return date;
}

function isValidDate(date) {
  return (date instanceof Date) && date.toString() !== 'Invalid Date' 
}

const TITLE = "Flight Booker";
const FLIGHT_SELECTIONS = {
  ONE_WAY: "One way",
  RETURN: "Return flight",
};
const INITIAL_DATE = "29.03.2022";

const FlightBooker = (props) => {
  const [flightSelection, setFlightSelection] = useState(FLIGHT_SELECTIONS.ONE_WAY);
  const [departField, setDepartField] = useState(INITIAL_DATE);
  const [returnField, setReturnField] = useState(INITIAL_DATE);

  const departDate = strToDate(departField)
  const returnDate = strToDate(returnField)

  const departIsValid = isValidDate(departDate);
  const returnIsValid = isValidDate(returnDate);
  const validFormState = departIsValid && returnIsValid && (departDate <= returnDate)

  const clickHandler = (event) => {
    let message;
    if (flightSelection === FLIGHT_SELECTIONS.ONE_WAY) {
      message = `You have booked a one-way flight on ${departField}.`;
    } else {
      message = `You have booked a return flight departing ${departField} and returning ${returnField}.`;
    }
    alert(message);
  };

  return (
    <Window title={TITLE}>
      <div className={style["flight-booker"]}>
        <select
          className={style["selector"]}
          value={flightSelection}
          onChange={(e) => setFlightSelection(e.target.value)}
        >
          <option>{FLIGHT_SELECTIONS.ONE_WAY}</option>
          <option>{FLIGHT_SELECTIONS.RETURN}</option>
        </select>
        <DateField
          valid={departIsValid}
          value={departField}
          onChange={(e) => setDepartField(e.target.value)}
          disabled={false}
        />
        <DateField
          valid={returnIsValid}
          value={returnField}
          onChange={(e) => setReturnField(e.target.value)}
          disabled={!departIsValid || flightSelection === FLIGHT_SELECTIONS.ONE_WAY}
        />
        <button
          className={style["button"]}
          disabled={!validFormState}
          onClick={clickHandler}
        >
          Book
        </button>
      </div>
    </Window>
  );
};

export default FlightBooker;
