import style from "./CircleDrawer.module.css";
import { useRef, useState, useReducer, Fragment } from "react";
import Circle from "./Circle";
import CircleSlider from "./CircleSlider";
import _ from "lodash";

const CircleDrawer = (props) => {
  const DEFAULT_RADIUS = 20;

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [sliderTop, setSliderTop] = useState(0);
  const [sliderLeft, setSliderLeft] = useState(0);
  const [sliderShow, setSliderShow] = useState(false);
  const [selectedCircleId, setSelectedCircleId] = useState(-1);
  const canvas = useRef();

  const undoStackPush = (item) => setUndoStack((prev) => [...prev, item]);
  const undoStackPop = () => {
    let lastState = undoStack.pop() || {};
    setUndoStack(undoStack);
    return lastState;
  };
  const redoStackPush = (item) => setRedoStack((prev) => [...prev, item]);
  const redoStackPop = () => {
    let lastState = redoStack.pop() || {};
    setRedoStack(redoStack);
    return lastState;
  };

  const [circles, dispatchCircles] = useReducer((state, action) => {
    if (action.type === "ADD_CIRCLE") {
      setRedoStack([]);
      let id = _.uniqueId("circles_");
      return { ...state, [id]: action.values };
    } else if (action.type === "UPDATE_CIRCLE") {
      setRedoStack([]);
      return { ...state, [action.id]: { ...state[action.id], ...action.values } };
    } else if (action.type === "SET_CIRCLES") {
      return { ...action.values };
    }
  }, {});

  const canvasClickHandler = (e) => {
    if (sliderShow) return;
    let rect = canvas.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let id = _.uniqueId("circle_");
    let circle = { id: id, radius: DEFAULT_RADIUS, x: x, y: y };
    undoStackPush(_.cloneDeep(circles));
    setRedoStack([]);
    dispatchCircles({ type: "ADD_CIRCLE", values: circle });
  };

  const undoHandler = () => {
    if (!undoStack.length) return;
    redoStackPush(circles);
    dispatchCircles({ type: "SET_CIRCLES", values: undoStackPop() });
  };

  const redoHandler = () => {
    if (!redoStack.length) return;
    undoStackPush(circles);
    dispatchCircles({ type: "SET_CIRCLES", values: redoStackPop() });
  };

  const sliderOpenHandler = (circleId, event) => {
    setSliderTop(event.pageY);
    setSliderLeft(event.pageX);
    setSliderShow(true);
    setSelectedCircleId(circleId);
    undoStackPush(_.cloneDeep(circles));
    event.stopPropagation();
  };

  const sliderCloseHandler = (circleId) => {
    let circle = circles[circleId];
    let prevCircle = undoStack.slice(-1)[0][circleId] || null;
    if (prevCircle.radius !== circle.radius) {
      undoStackPop();
    }
    setSliderShow(false);
  };

  const sliderChangeHandler = (circleId, event) => {
    let radius = Number(event.target.value);
    dispatchCircles({ type: "UPDATE_CIRCLE", id: circleId, values: { radius } });
  };

  return (
    <Fragment>
      <div className={style["circle-drawer"]}>
        <header>
          <button onClick={undoHandler}>Undo</button>
          <button onClick={redoHandler}>Redo</button>
        </header>
        <section>
          <div ref={canvas} className={style["canvas"]} onClick={canvasClickHandler}>
            {Object.entries(circles).map(([id, c]) => (
              <Circle key={id} {...c} onClick={sliderOpenHandler.bind(null, id)} />
            ))}
          </div>
        </section>
      </div>
      {sliderShow ? (
        <CircleSlider
          top={sliderTop}
          left={sliderLeft}
          onChange={sliderChangeHandler.bind(null, selectedCircleId)}
          onClose={sliderCloseHandler.bind(null, selectedCircleId)}
        />
      ) : null}
    </Fragment>
  );
};

export default CircleDrawer;
