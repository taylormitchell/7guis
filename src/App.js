import "./App.css";
// import { useState } from "react";
import Window from "./components/Window/Window";
import Counter from "./components/Counter/Counter";
import FlightBooker from "./components/FlightBooker/FlightBooker";
import TemperatureConverter from "./components/TemperatureConverter/TemperatureConverter";
import Timer from "./components/Timer/Timer";
import CRUD from "./components/CRUD/CRUD";
import CircleDrawer from "./components/CircleDrawer/CircleDrawer";
import Cells from "./components/Cells/Cells.js"
import _ from "lodash";

function App() {
  const apps = [
    { id: "counter", name: "Counter", component: <Counter />, description: "Challenge: Understanding the basic ideas of a language/toolkit." },
    {
      id: "temperature-converter",
      name: "Temperature Converter",
      component: <TemperatureConverter />,
      description: "Challenges: bidirectional data flow, user-provided text input."
    },
    { id: "flight-booker", name: "Flight Booker", component: <FlightBooker />, description: "Challenge: Constraints." },
    { id: "timer", name: "Timer", component: <Timer />, description: "Challenges: concurrency, competing user/signal interactions, responsiveness." },
    { id: "crud", name: "CRUD", component: <CRUD />, description: "Challenges: separating the domain and presentation logic, managing mutation, building a non-trivial layout." },
    { id: "circle-drawer", name: "Circle Drawer", component: <CircleDrawer />, description: "Challenges: undo/redo, custom drawing, dialog control*." },
    { id: "cells", name: "Cells", component: <Cells />, description: "Challenges: change propagation, widget customization, implementing a more authentic/involved GUI application." },
  ];

  const windows = apps.map((app, i) => {
    return { id: _.uniqueId("window_"), app: app, top: 400, left: 100, order: i };
  });

  return (
    <div className="App">
      <header className="App-header">7GUIs</header>
      <p>This is an implementation of 7GUIs using React</p>
      <div id="windows">
        {windows.map((w, i) => {
          return (
            <div>
            <h2>{w.app.name}</h2>
            <div><span>{w.app.description}</span></div>
            <Window
              title={w.app.name}
              key={w.id}
              top={w.top}
              left={w.left}
            >
              {w.app.component}
            </Window>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
