import styles from "./FlightBooker.module.css";


const DateField = (props) => {
  let className = styles["date-field"];
  if (!props.valid) {
    className += " " + styles["invalid"];
  }

  return (
    <div>
      <input
        className={className}
        type="text"
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
      ></input>
    </div>
  );
};

export default DateField;
