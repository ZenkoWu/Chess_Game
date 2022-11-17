import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { ChessGame } from "./components/ChessGame/ChessGame";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <div className="content">
                    <ChessGame />
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
