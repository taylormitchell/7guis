import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import style from "./Timer.module.css";

function now() {
  return new Date().getTime();
}

const Timer = (props) => {
  const [startTime, setStartTime] = useState(now());
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(10000);
  const [completed, setCompleted] = useState(false);

  // Tick timer until remaining time runs out
  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => setElapsed(now() - startTime), 100);
    return () => clearInterval(interval);
  }, [startTime, completed]);

  const resetHandler = (event) => {
    setStartTime(now());
    setElapsed(0);
    setCompleted(false);
  };

  const slideHandler = (event) => {
    let duration = parseInt(event.target.value);
    setDuration(duration);
  };

  if (!completed && elapsed >= duration) {
    setCompleted(true);
  }
  if (completed && elapsed < duration) {
    setCompleted(false);
  }
  const elapsedSeconds = Math.round(Math.max(elapsed, 0) / 100) / 10;
  const elapsedPercent = Math.min(Math.round((elapsed / duration) * 100), 100);

  return (
    <div className={style["timer"]}>
      <div>
        <span>Elapsed Time:</span>
        <ProgressBar percent={elapsedPercent} />
      </div>
      <div>
        <span>{elapsedSeconds}</span>
      </div>
      <div>
        <div>
          <label htmlFor="myRange">Duration: </label>
          <input
            type="range"
            min={0}
            max={20000}
            value={duration}
            id="myRange"
            onChange={slideHandler}
          />
        </div>
      </div>
      <button onClick={resetHandler}>Reset</button>
    </div>
  );
};

export default Timer;
