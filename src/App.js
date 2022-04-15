import "./App.css";
import Window from "./components/Window/Window";
import Counter from "./components/Counter/Counter";
import FlightBooker from "./components/FlightBooker/FlightBooker";
import TemperatureConverter from "./components/TemperatureConverter/TemperatureConverter";
import Timer from "./components/Timer/Timer";
import CRUD from "./components/CRUD/CRUD";
import CircleDrawer from "./components/CircleDrawer/CircleDrawer";
import Cells from "./components/Cells/Cells.js";
import _ from "lodash";

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
      description: [
        "The task is to build a frame containing two textfields TC and TF representing the temperature in Celsius and Fahrenheit, respectively. Initially, both TC and TF are empty. When the user enters a numerical value into TC the corresponding value in TF is automatically updated and vice versa. When the user enters a non-numerical string into TC the value in TF is not updated and vice versa. The formula for converting a temperature C in Celsius into a temperature F in Fahrenheit is C = (F - 32) * (5/9) and the dual direction is F = C * (9/5) + 32.",
        "Temperature Converter increases the complexity of Counter by having bidirectional data flow between the Celsius and Fahrenheit inputs and the need to check the user input for validity. A good solution will make the bidirectional dependency very clear with minimal boilerplate code.",
      ],
    },
    {
      id: "flight-booker",
      name: "Flight Booker",
      component: <FlightBooker />,
      challenge: "Challenge: Constraints.",
      description: [
        "The task is to build a frame containing a combobox C with the two options “one-way flight” and “return flight”, two textfields T1 and T2 representing the start and return date, respectively, and a button B for submitting the selected flight. T2 is enabled iff C’s value is “return flight”. When C has the value “return flight” and T2’s date is strictly before T1’s then B is disabled. When a non-disabled textfield T has an ill-formatted date then T is colored red and B is disabled. When clicking B a message is displayed informing the user of his selection (e.g. “You have booked a one-way flight on 04.04.2014.”). Initially, C has the value “one-way flight” and T1 as well as T2 have the same (arbitrary) date (it is implied that T2 is disabled).",
        "The focus of Flight Booker lies on modelling constraints between widgets on the one hand and modelling constraints within a widget on the other hand. Such constraints are very common in everyday interactions with GUI applications. A good solution for Flight Booker will make the constraints clear, succinct and explicit in the source code and not hidden behind a lot of scaffolding.",
      ],
    },
    {
      id: "timer",
      name: "Timer",
      component: <Timer />,
      challenge: "Challenges: concurrency, competing user/signal interactions, responsiveness.",
      description: [
        "The task is to build a frame containing a gauge G for the elapsed time e, a label which shows the elapsed time as a numerical value, a slider S by which the duration d of the timer can be adjusted while the timer is running and a reset button R. Adjusting S must immediately reflect on d and not only when S is released. It follows that while moving S the filled amount of G will (usually) change immediately. When e ≥ d is true then the timer stops (and G will be full). If, thereafter, d is increased such that d > e will be true then the timer restarts to tick until e ≥ d is true again. Clicking R will reset e to zero.",
        "Timer deals with concurrency in the sense that a timer process that updates the elapsed time runs concurrently to the user’s interactions with the GUI application. This also means that the solution to competing user and signal interactions is tested. The fact that slider adjustments must be reflected immediately moreover tests the responsiveness of the solution. A good solution will make it clear that the signal is a timer tick and, as always, has not much scaffolding.",
      ],
    },
    {
      id: "crud",
      name: "CRUD",
      component: <CRUD />,
      challenge:
        "Challenges: separating the domain and presentation logic, managing mutation, building a non-trivial layout.",
      description: [
        "The task is to build a frame containing the following elements: a textfield Tprefix, a pair of textfields Tname and Tsurname, a listbox L, buttons BC, BU and BD and the three labels as seen in the screenshot. L presents a view of the data in the database that consists of a list of names. At most one entry can be selected in L at a time. By entering a string into Tprefix the user can filter the names whose surname start with the entered prefix—this should happen immediately without having to submit the prefix with enter. Clicking BC will append the resulting name from concatenating the strings in Tname and Tsurname to L. BU and BD are enabled iff an entry in L is selected. In contrast to BC, BU will not append the resulting name but instead replace the selected entry with the new name. BD will remove the selected entry. The layout is to be done like suggested in the screenshot. In particular, L must occupy all the remaining space.",
        "CRUD (Create, Read, Update and Delete) represents a typical graphical business application. The primary challenge is the separation of domain and presentation logic in the source code that is more or less forced on the implementer due to the ability to filter the view by a prefix. Traditionally, some form of MVC pattern is used to achieve the separation of domain and presentation logic. Also, the approach to managing the mutation of the list of names is tested. A good solution will have a good separation between the domain and presentation logic without much overhead (e.g. in the form of toolkit specific concepts or language/paradigm concepts), a mutation management that is fast but not error-prone and a natural representation of the layout (layout builders are allowed, of course, but would increase the overhead).",
      ],
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
      description: [
        "The task is to build a frame containing an undo and redo button as well as a canvas area underneath. Left-clicking inside an empty area inside the canvas will create an unfilled circle with a fixed diameter whose center is the left-clicked point. The circle nearest to the mouse pointer such that the distance from its center to the pointer is less than its radius, if it exists, is filled with the color gray. The gray circle is the selected circle C. Right-clicking C will make a popup menu appear with one entry “Adjust diameter..”. Clicking on this entry will open another frame with a slider inside that adjusts the diameter of C. Changes are applied immediately. Closing this frame will mark the last diameter as significant for the undo/redo history. Clicking undo will undo the last significant change (i.e. circle creation or diameter adjustment). Clicking redo will reapply the last undoed change unless new changes were made by the user in the meantime.",
      ],
    },
  ];

  const windows = apps.map((app, i) => {
    return { id: _.uniqueId("window_"), app: app, top: 400, left: 100, order: i };
  });

  return (
    <div className="App">
      <header className="App-header">7GUIs in React</header>
      <p>
        My implementation of <a href="https://eugenkiss.github.io/7guis/">7GUIs</a> with React.
        (<a href="https://github.com/taylormitchell/7guis">source</a>).
      </p>
      <div id="windows">
        {windows.map((w, i) => {
          return (
            <Window title={w.app.name} key={w.id} top={w.top} left={w.left}>
              {w.app.component}
            </Window>
          );
        })}
      </div>
    </div>
  );
}

export default App;
