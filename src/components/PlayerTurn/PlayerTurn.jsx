import { colors } from "../../constants/figureTypes"
import Timer from "../Timer/Timer"

export const PlayerTurn = (
    {
        isPlayerTurn, 
        history, 
        getFigureClasses, 
        side, 
        isCheckmate, 
        resetTimer, 
        isDraw
    }) => {

    const placeholder = '--:--'
    const killedFigures = history.filter(el => el.secondTap?.figure && el.figureColor === side)
     
    const style = {
        black: {bgColor: colors.BLACK, color: colors.WHITE},
        white: {bgColor: colors.WHITE, color: colors.BLACK},
    }
    return (
        <div className={
            `bg-${style[side].bgColor} text-${style[side].color} ` + 
            (!isDraw && !isCheckmate && !isPlayerTurn && 'opacity-50')
        }>

            <div className='row m-0 mw-100 py-1 px-2'>
                <div className='col-lg-10 text-start ps-1'>{side + ' side'}</div>
                <div className='col-lg-2 p-0 fw-bold'>
                    <Timer 
                        isCountdown={isPlayerTurn} 
                        isCheckmate={isCheckmate} 
                        resetTimer={resetTimer}
                        isDraw={isDraw}
                    />
                </div>
            </div> 

            <div className='d-flex'>

                <div className={'p-2 w-50 fs-4 ' + (!isDraw && !isCheckmate && isPlayerTurn && 'playerTurn')}>
                    {placeholder}
                </div>

                <div className='text-start ps-2 w-50'>
                    { 
                        killedFigures.map((el, i) => 
                            <i key={i} className={(getFigureClasses(el?.secondTap.figure)) + ' pe-1'}/>
                        )
                    }
                </div>

            </div>

        </div>
    )
}