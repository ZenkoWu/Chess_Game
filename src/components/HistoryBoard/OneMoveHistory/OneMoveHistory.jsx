
export const OneMoveHistory=(
    {
        firstTap, 
        secondTap, 
        figureColor, 
        getFigureClasses, 
        moveNumber
    }) => {
    
    return (
        <div className='border-bottom-brown text-white row py-1 '>

            <div className='col-2 px-2'>{moveNumber}</div>

            <div className={`col-5 text-${figureColor} `}>
                <span className={getFigureClasses(firstTap?.figure) + ' px-1'}/>
                {firstTap.id}
            </div>

            <div className={`col-5 text-${figureColor} text-end pe-5`}>
                { secondTap?.figure && <i className={getFigureClasses(secondTap?.figure) + ' px-1'}/> }
                {secondTap.id}
            </div>

        </div>
    )
  }