import { useState } from "react";
import style from './CRUD.module.css'

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
      <select size={5} onChange={props.onChange} selection={props.selection}>
        {props.people
          .filter(p => p.surname.startsWith(filter))
          .map(p => (
              <option value={p.key} key={p.key}>{`${p.surname}, ${p.name}`}</option>
        ))}
      </select>
    </div>
  );
};

export default List;
