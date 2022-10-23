import { BrowserRouter } from "react-router-dom";
import "./App.css";
import ChessBoard from "./components/ChessBoard/ChessBoard";
import Test from "./components/Test";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="content">
          <ChessBoard />
          {/* <Test /> */}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
