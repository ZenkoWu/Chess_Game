import { BrowserRouter } from "react-router-dom";
import "./App.css";
import ChessBoard from "./components/ChessBoard/ChessBoard";
import { ChessGame } from "./components/ChessGame/ChessGame";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="content">
          {/* <ChessBoard /> */}
          <ChessGame />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
