import './App.css';
import Counter from './components/Counter/Counter';
import FlightBooker from './components/FlightBooker/FlightBooker';
import TemperatureConverter from './components/TemperatureConverter/TemperatureConverter';
import Timer from './components/Timer/Timer';
import CRUD from './components/CRUD/CRUD';

function App() {
  return (
    <div className="App">
      <header className="App-header">7GUIs</header>
      <p>This is an implementation of 7GUIs using React</p>
      <ol>
        <li>
          <h2>Counter</h2>
          <Counter />
        </li>
        <li>
          <h2>Temperature Converter</h2>
          <TemperatureConverter />
        </li>
        <li>
          <h2>Flight Booker</h2>
          <FlightBooker />
        </li>
        <li>
          <h2>Timer</h2>
          <Timer />
        </li>
        <li>
          <h2>CRUD</h2>
          <CRUD />
        </li>
        
      </ol>
    </div>
    
  );
}

export default App;
