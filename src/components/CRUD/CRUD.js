import { useState } from "react";
import Window from "../Window/Window";
import Form from "./Form";
import List from "./List";
import classes from "./CRUD.module.css";

const CRUD = (props) => {
  const [selectedKey, setSelectedKey] = useState(0);

  const [nameField, setNameField] = useState("");
  const [surnameField, setSurnameField] = useState("");

  const [people, setPeople] = useState({
    0: { key: "0", name: "Taylor", surname: "Mitchell" },
    1: { key: "1", name: "Emily", surname: "Unger" },
  });

  const selectHandler = (event) => {
    const key = event.target.value;
    setSelectedKey(key);
    const selection = people[key];
    setNameField(selection.name);
    setSurnameField(selection.surname);
  };

  const createHandler = () => {
    const key = Math.random().toString();
    const person = { key: key, name: nameField, surname: surnameField };
    setPeople((prevState) => {
      const newState = { ...prevState };
      newState[key] = person;
      return newState;
    });
  };

  const updateHandler = () => {
    setPeople((prevPeople) => {
      let newRecord = { ...prevPeople[selectedKey] };
      newRecord["name"] = nameField;
      newRecord["surname"] = surnameField;
      let newPeople = { ...prevPeople };
      newPeople[selectedKey] = newRecord;
      return newPeople;
    });
  };

  const deleteHandler = () => {
    setPeople((prevPeople) => {
      let newPeople = { ...prevPeople };
      delete newPeople[selectedKey];
      return newPeople;
    });
    setNameField("");
    setSurnameField("");
  };

  const invalidState = nameField === "" || surnameField === "";

  return (
    <Window title="CRUD">
      <section className={classes["main"]}>
        <div className={classes["left"]}>
          <List people={people} onChange={selectHandler} selection={selectedKey} />
        </div>
        <div className={classes["right"]}>
          <Form
            nameField={nameField}
            surnameField={surnameField}
            onChangeNameField={(e) => setNameField(e.target.value)}
            onChangeSurnameField={(e) => setSurnameField(e.target.value)}
          />
        </div>
      </section>
      <section className={classes["buttons"]}>
        <button disabled={invalidState} onClick={createHandler}>
          Create
        </button>
        <button disabled={invalidState} onClick={updateHandler}>
          Update
        </button>
        <button onClick={deleteHandler}>Delete</button>
      </section>
    </Window>
  );
};

export default CRUD;
