import { BrowserRouter } from "react-router-dom";
import "./App.css";
import ChessBoard from "./components/ChessBoard/ChessBoard";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="content">
          <ChessBoard />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
