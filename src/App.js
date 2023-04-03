import { connect, useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { ChessGame } from "./components/ChessGame/ChessGame";
import { changeThemeAc } from "./redux/ActionCreators";

function App() {

    const theme = useSelector(state => state.themeColor)
    const dispatch = useDispatch()

    const changeTheme = () => dispatch(changeThemeAc())
    return (
        <BrowserRouter>
            <div className="App">
                <div className={'content ' + (theme === 'dark' ? 'darkTheme' : 'lightTheme')}>
                    <ChessGame changeTheme={changeTheme} theme={theme}/>
                </div>
            </div>
        </BrowserRouter>
    );
}


export default App;
