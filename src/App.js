import "./App.css";
// import { useState } from "react";
import Window from "./components/Window/Window";
import Counter from "./components/Counter/Counter";
import FlightBooker from "./components/FlightBooker/FlightBooker";
import TemperatureConverter from "./components/TemperatureConverter/TemperatureConverter";
import Timer from "./components/Timer/Timer";
import CRUD from "./components/CRUD/CRUD";
import CircleDrawer from "./components/CircleDrawer/CircleDrawer";
import Cells from "./components/Cells/Cells.js";
import _ from "lodash";
import { Fragment } from "react";

function App() {
  const apps = [
    {
      id: "counter",
      name: "Counter",
      component: <Counter />,
      challenge: "Challenge: Understanding the basic ideas of a language/toolkit.",
      description: [
        "The task is to build a frame containing a label or read-only textfield T and a button B. Initially, the value in T is “0” and each click of B increases the value in T by one.",
        "Counter serves as a gentle introduction to the basics of the language, paradigm and toolkit for one of the simplest GUI applications imaginable. Thus, Counter reveals the required scaffolding and how the very basic features work together to build a GUI application. A good solution will have almost no scaffolding.",
      ],
    },
    {
      id: "temperature-converter",
      name: "Temperature Converter",
      component: <TemperatureConverter />,
      challenge: "Challenges: bidirectional data flow, user-provided text input.",
      description: []
    },
    {
      id: "flight-booker",
      name: "Flight Booker",
      component: <FlightBooker />,
      challenge: "Challenge: Constraints.",
      description: [],
    },
    {
      id: "timer",
      name: "Timer",
      component: <Timer />,
      challenge: "Challenges: concurrency, competing user/signal interactions, responsiveness.",
      description: [],
    },
    {
      id: "crud",
      name: "CRUD",
      component: <CRUD />,
      challenge:
        "Challenges: separating the domain and presentation logic, managing mutation, building a non-trivial layout.",
      description: [],
    },
    {
      id: "circle-drawer",
      name: "Circle Drawer",
      component: <CircleDrawer />,
      challenge: "Challenges: undo/redo, custom drawing, dialog control*.",
      description: [],
    },
    {
      id: "cells",
      name: "Cells",
      component: <Cells />,
      challenge:
        "Challenges: change propagation, widget customization, implementing a more authentic/involved GUI application.",
      description: [],
    },
  ];

  const windows = apps.map((app, i) => {
    return { id: _.uniqueId("window_"), app: app, top: 400, left: 100, order: i };
  });

  return (
    <div className="App">
      {/* <h1>Hello world</h1>
        <section>
            <p>The task is to build a frame containing a label or read-only textfield T and a button B. Initially, the value in T is “0” and each click of B increases the value in T by one.</p>
            <p>Counter serves as a gentle introduction to the basics of the language, paradigm and toolkit for one of the simplest GUI applications imaginable. Thus, Counter reveals the required scaffolding and how the very basic features work together to build a GUI application. A good solution will have almost no scaffolding.</p>
        </section> */}
      <header className="App-header">7GUIs in React</header>
      <p>
        My implementation of <a href="https://eugenkiss.github.io/7guis/">7GUIs</a> with React.
      </p>
        {windows.map((w, i) => {
          return (
            <Fragment>
              <h2>{w.app.name}</h2>
              <p>{w.app.challenge}</p>
              <div className="window-area">
              <Window title={w.app.name} key={w.id} top={w.top} left={w.left}>
                {w.app.component}
              </Window>
              </div>
              {w.app.description.map((desc) => (
                <p>{desc}</p>
              ))}
            </Fragment>
          );
        })}
    </div>
  );
}

export default App;
