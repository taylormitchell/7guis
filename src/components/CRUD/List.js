import { Fragment, useState } from "react";
import style from './List.module.css'

const List = (props) => {
  const [filter, setFilter] = useState("");
  const filterHandler = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div className={style["list-view"]}>
      <form>
        <label htmlFor="filter">Filter prefix:</label>
        <input id="filter" type="text" onChange={filterHandler}></input>
      </form>
      <select multiple onChange={props.onChange} selection={props.selection}>
        {Object.entries(props.people)
          .filter(([k, p]) => p.surname.startsWith(filter))
          .map(([k, p]) => (
            <option value={p.key} key={p.key}>{`${p.surname}, ${p.name}`}</option>
          ))}
      </select>
    </div>
  );
};

export default List;
