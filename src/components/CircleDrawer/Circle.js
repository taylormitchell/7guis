import style from "./CircleDrawer.module.css";

const Circle = (props) => {
  let top = props.y - props.radius;
  let left = props.x - props.radius;
  let diameter = 2 * props.radius;

  return (
    <div
      className={style["circle"]}
      onClick={props.onClick}
      style={{
        top: `${top}px`,
        left: `${left}px`,
        width: `${diameter}px`,
        height: `${diameter}px`,
        borderRadius: `${props.radius}px`,
      }}
    />
  );
};

export default Circle;
