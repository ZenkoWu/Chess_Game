import { colors } from "../../constants/figureTypes"

export const PlayerTurn = ({isPlayerTurn, history, getFigureClasses, side}) => {
    const placeholder = '--:--'
    const killedFigures = history.filter(el => el.secondTap?.figure && el.figureColor === side)
     
    const style = {
        black: {bgColor: colors.BLACK, color: colors.WHITE},
        white: {bgColor: colors.WHITE, color: colors.BLACK},
    }
    return (
        <div className={`bg-${style[side].bgColor} text-${style[side].color} ` + (!isPlayerTurn && 'opacity-50')}>

            <div className='row m-0 mw-100 py-1 px-2'>
                <div className='col-lg-11 text-start ps-1'>{'Player'}</div>
                <div className='col-lg-1 p-0 text-end'>
                    {isPlayerTurn && '<'}
                </div>
            </div> 

            <div className='d-flex'>

                <div className={'p-2 w-50 fs-4 ' + (isPlayerTurn && 'playerTurn')}>
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