import style from "./CircleDrawer.module.css";
import { useRef, useState, useReducer, Fragment } from "react";
import Circle from "./Circle";
import CircleSlider from "./CircleSlider";
import _ from "lodash";

const CircleDrawer = (props) => {
  const DEFAULT_RADIUS = 20;

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [slider, setSlider] = useState({top: 0, left: 0, visible: false});
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
    if (slider.visible) return;
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

  const sliderOpen = (circleId, event) => {
    setSlider({top: event.pageY, left: event.pageX, visible: true});
    setSelectedCircleId(circleId);
    undoStackPush(_.cloneDeep(circles));
    event.stopPropagation();
  };

  const sliderClose = (circleId) => {
    let circle = circles[circleId];
    let prevCircle = undoStack.slice(-1)[0][circleId] || null;
    if (prevCircle.radius === circle.radius) {
      undoStackPop();
    }
    setSlider(s => ({...s, visible: false}));
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
              <Circle key={id} {...c} onClick={sliderOpen.bind(null, id)} />
            ))}
          </div>
        </section>
      </div>
      {slider.visible ? (
        <CircleSlider
          top={slider.top}
          left={slider.left}
          close={sliderClose.bind(null, selectedCircleId)}
          onChange={sliderChangeHandler.bind(null, selectedCircleId)}
        />
      ) : null}
    </Fragment>
  );
};

export default CircleDrawer;
