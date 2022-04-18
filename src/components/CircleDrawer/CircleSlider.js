import { useEffect } from "react";
import style from "./CircleSlider.module.css";

const CircleSlider = (props) => {

  const { close } = props;
  // Close slider when anywhere but the slider is clicked
  useEffect(() => {
    const clickAwayHandler = (e) => {
      let modal = document.querySelector("." + style["circle-slider"]);
      if (modal && modal.contains(e.target)) {
        return;
      }
      close();
      e.stopPropagation();
    }
    document.addEventListener("click", clickAwayHandler);
    return () => document.removeEventListener("click", clickAwayHandler);
  }, [close]);

  return (
    <div
      className={style["circle-slider"]}
      style={{ top: `${props.top}px`, left: `${props.left}px` }}
    >
      <label htmlFor="diamSlider">Adjust Diameter</label>
      <input
        type="range"
        min={1}
        max={30}
        value={props.diameter}
        id="diamSlider"
        onChange={props.onChange}
      />
    </div>
  );
};

export default CircleSlider;
