import style from './Form.module.css'

const Form = (props) => {
  return (
    <form className={style["entry"]}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={props.nameField}
          onChange={props.onChangeNameField}
        ></input>
      </div>
      <div>
        <label htmlFor="surname">Surname:</label>
        <input
          id="surname"
          type="text"
          value={props.surnameField}
          onChange={props.onChangeSurnameField}
        ></input>
      </div>
    </form>
  );
};

export default Form;
