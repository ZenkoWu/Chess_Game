import { colors } from "../../constants/figureTypes"

export let CheckmateModal = ({playerSide}) => {
    return (
        <div className="modalWindow rounded-3 w-75 ">
            <div className=" py-4">
                <div className=" mw-100 m-0 border text-center text-dark fw-bold p-4">
                    <div>
                        {`Шах и мат! Выиграли ${playerSide === colors.BLACK ? ' черные' : ' белые'}`}</div>
                    </div>
                    <span onClick={()=> {}}> {'Начать игру заново'}</span>
                
            </div>
        </div>
    )
}