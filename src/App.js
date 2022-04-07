import "./App.css";
import Window from "./components/Window/Window";
import Counter from "./components/Counter/Counter";
import FlightBooker from "./components/FlightBooker/FlightBooker";
import TemperatureConverter from "./components/TemperatureConverter/TemperatureConverter";
import Timer from "./components/Timer/Timer";
import CRUD from "./components/CRUD/CRUD";
import CircleDrawer from "./components/CircleDrawer/CircleDrawer";
import _ from "lodash";


function App() {
  const apps = [
    { id: "counter", name: "Counter", component: <Counter /> },
    { id: "temperature-converter", name: "Temperature Converter", component: <TemperatureConverter />},
    { id: "flight-booker", name: "Flight Booker", component: <FlightBooker /> },
    { id: "timer", name: "Timer", component: <Timer /> },
    { id: "crud", name: "CRUD", component: <CRUD /> },
    { id: "circle-drawer", name: "Circle Drawer", component: <CircleDrawer /> },
  ];

  const windows = apps.map((app, i) => {
      return { id: _.uniqueId("window_"), app: app, top: 400, left: 100, order: i };
  })
  
  return (
    <div className="App">
      <header className="App-header">7GUIs</header>
      <p>This is an implementation of 7GUIs using React</p>
      <div id="windows">
        <ul>
        {windows.map((w, i) => {
          return (
            <li>
              <h2>{w.app.name}</h2>
            <Window
              title={w.app.name}
              key={w.id}
              top={w.top}
              left={w.left}
            >
              {w.app.component}
            </Window>
            </li>
          );
        })}

        </ul>
        
      </div>
    </div>
  );
}

export default App;
