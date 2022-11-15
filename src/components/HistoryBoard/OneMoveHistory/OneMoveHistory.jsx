
export const OneMoveHistory  = ({firstTap, secondTap, figureColor, renderFigure, moveNumber}) => {
    
  return (
  <div className='border-bottom-brown text-white row py-1 '>
    <div className='px-2 col-2'>{moveNumber}</div>
    <div className={`text-${figureColor} col-5`}>
      <span className={renderFigure(firstTap.figure) + ' px-1'}/>
      {firstTap.id}
    </div>
    <div className={`text-${figureColor} text-end pe-5 col-5`}>
      {secondTap?.figure ? 
        <i className={renderFigure(secondTap.figure) + ' px-1'}/>
      : null
      }
      {secondTap.id}
    </div>
  </div>
  )
}