import "./App.css";
import Window from "./components/Window/Window";
import Counter from "./components/Counter/Counter";
import FlightBooker from "./components/FlightBooker/FlightBooker";
import TemperatureConverter from "./components/TemperatureConverter/TemperatureConverter";
import Timer from "./components/Timer/Timer";
import CRUD from "./components/CRUD/CRUD";
import CircleDrawer from "./components/CircleDrawer/CircleDrawer";
import Cells from "./components/Cells/Cells.js";

function App() {
  const tasks = [
    {
      id: "counter",
      name: "Counter",
      component: <Counter />,
      challenge: "Challenge: Understanding the basic ideas of a language/toolkit.",
      description: [
        "The task is to build a frame which displays a counter and has buttons to increment and decrement it. The 'hello world' equivalent of interactive GUI programming.",
      ],
    },
    {
      id: "temperature-converter",
      name: "Temperature Converter",
      component: <TemperatureConverter />,
      challenge: "Challenges: bidirectional data flow, user-provided text input.",
      description: [
        "The task is to build a frame containing a Celsius and Fahrenheit field. Entering a value into one will automatically convert it and update the other field. Conversion only happens if the inputs are valid.",
      ],
    },
    {
      id: "flight-booker",
      name: "Flight Booker",
      component: <FlightBooker />,
      challenge: "Challenge: Constraints.",
      description: [
        "The task is to build a frame for booking a flight. Flights can be one-way or two-way. The state of the date fields and book button automatically updates based on the flight selection and whether the date is valid.",
      ],
    },
    {
      id: "timer",
      name: "Timer",
      component: <Timer />,
      challenge: "Challenges: concurrency, competing user/signal interactions, responsiveness.",
      description: [
        "The task is to build a frame containing a progress bar, timer duration slider, and reset button. The slider sets the duration of the timer. The reset button resets the elapsed tiem to zero. As you move the duration slider, the progress bar update in real-time.",
      ],
    },
    {
      id: "crud",
      name: "CRUD",
      component: <CRUD />,
      challenge:
        "Challenges: separating the domain and presentation logic, managing mutation, building a non-trivial layout.",
      description: [
        "The task is to build a frame containing a list of people, a filter field, an input form, and buttons to create, update, and delete entries. The list filters automatically based on the filter field. The buttons are only be enabled when the frame is in a state they can be used in.",
      ],
    },
    {
      id: "circle-drawer",
      name: "Circle Drawer",
      component: <CircleDrawer />,
      challenge: "Challenges: undo/redo, custom drawing, dialog control*.",
      description: [
        "The task is to build a frame containing canvas for drawing circles. Clicking on the canvas adds a circle. Clicking on a circle allows you to change it's diameter. There are buttons to undo and redo the last action."   
      ],
    },
    {
      id: "cells",
      name: "Cells",
      component: <Cells />,
      challenge:
        "Challenges: change propagation, widget customization, implementing a more authentic/involved GUI application.",
      description: [
        "The task is to build a frame containing a spreadsheet. Click inside a cell to edit its content. Leave the cell to evaluate it. Here are some example contents: '5.5', 'Some text', '=A1', '=sum(B2:C4)', '=div(C1, 5)'. Click and drag on the edge of a row or column to resize it. You can use the arrow keys to move between cells.",
      ],
    },
  ];

  return (
    <div className="App">
      <header className="App-header">7GUIs in React</header>
      <p>
        My implementation of <a href="https://eugenkiss.github.io/7guis/">7GUIs</a> with React. (
        <a href="https://github.com/taylormitchell/7guis">source</a>).
      </p>
      <div id="tasks">
        {tasks.map((t) => {
          return (
              <div className="task">
                <h2>{t.name}</h2>
                <p>{t.challenge}</p>
                {t.description.map((d) => (
                  <p>{d}</p>
                ))}
                <div className="task-window">
                  <Window title={t.name} key={t.id}>
                    {t.component}
                  </Window>
                </div>
              </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
