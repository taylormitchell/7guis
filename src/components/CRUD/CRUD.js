import { useState } from "react";
import Form from "./Form";
import List from "./List";
import style from "./CRUD.module.css";

const CRUD = (props) => {
  const [selectedKey, setSelectedKey] = useState("");

  const [nameField, setNameField] = useState("");
  const [surnameField, setSurnameField] = useState("");

  const [people, setPeople] = useState([]);

  const selectHandler = (event) => {
    const key = event.target.value;
    setSelectedKey(key);
    const selection = people.find(p => p.key === key);
    setNameField(selection.name);
    setSurnameField(selection.surname);
  };

  const createHandler = () => {
    const key = Math.random().toString();
    const person = { key: key, name: nameField, surname: surnameField };
    setPeople(s => [...s, person]);
  };

  const updateHandler = () => {
    setPeople(people => {
      let i = people.findIndex(p => p.key === selectedKey)
      let updatedPerson = {...people[i], name: nameField, surname: surnameField};
      return [...people.slice(0, i), updatedPerson, ...people.slice(i + 1)];
    });
  };

  const deleteHandler = () => {
    setPeople(people => {
      let i = people.findIndex(p => p.key === selectedKey)
      return [...people.slice(0, i), ...people.slice(i + 1)];
    });
    setNameField("");
    setSurnameField("");
    setSelectedKey(people[0].key);
  };

  const invalidState = nameField === "" || surnameField === "";
  const isSelection = selectedKey !== "";

  return (
    <div className={style["crud"]}>
      <section className={style["main"]}>
          <List people={people} onChange={selectHandler} selection={selectedKey} />
          <Form
            nameField={nameField}
            surnameField={surnameField}
            onChangeNameField={(e) => setNameField(e.target.value)}
            onChangeSurnameField={(e) => setSurnameField(e.target.value)}
          />
      </section>
      <section className={style["buttons"]}>
        <button disabled={invalidState} onClick={createHandler}>
          Create
        </button>
        <button disabled={invalidState || !isSelection} onClick={updateHandler}>
          Update
        </button>
        <button disabled={!isSelection} onClick={deleteHandler}>Delete</button>
      </section>
    </div>
  );
};

export default CRUD;
