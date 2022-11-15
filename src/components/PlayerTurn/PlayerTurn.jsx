

export const PlayerTurn = ({playerSide, history, renderFigure, color, textColor}) => {
    return (
        <div className={`bg-${color} text-${textColor}  ` + (playerSide !== color ? ' opacity-50' : '')}>
          <div className='row m-0 mw-100 py-1 px-2'>
            <div className='col text-start ps-1'>{'Player'}</div>
            <div className='col p-0 text-end'>
              {playerSide === color ? '<' : null}
            </div>
          </div>
          <div className='d-flex'>
            <div className={'p-2 w-50 fs-4 ' + (playerSide === color ? 'playerTurn' : '')}>
              --:--
            </div>
            <div className=' text-start ps-2 w-50'>
              {
                history.map(el => (
                  el.secondTap?.figure && el.figureColor === color
                  ?
                  <i className={(renderFigure(el.secondTap?.figure)) + ' pe-1 '}/>
                  : 
                  null
                ))
              }
            </div>
          </div>
        </div>
    )
}