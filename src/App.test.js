import { render, screen } from '@testing-library/react';
import App from './App';
import { Cell, Evaluator } from './components/Cells/sheet';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

test("test", () => {
  let evaluator = new Evaluator();
            // A .                                  B
  let cells = [
    [new Cell(0, "1", [], ["A4", "A3"]), new Cell("", "=B2", ["B2"], ["B3"]), new Cell()],   // 1
    [new Cell(2, "2", [], ["A4"]), new Cell("", "=B3", ["B3"], ["B1"]), new Cell()],       // 2
    [new Cell(0, "=A1", ["A1"], ["A4"]), new Cell("", "=B1", ["B1"], ["B2"]), new Cell()],       // 2
    [new Cell(2, "=sum(A1:A3)", ["A1","A2","A3"]), new Cell("", "=B4", ["B4"], ["B4"]), new Cell()]       // 2
  ]
  let newCells = evaluator.evaluate(cells, "A1")
  console.log(newCells)
  expect(true).toBe(true);
})
