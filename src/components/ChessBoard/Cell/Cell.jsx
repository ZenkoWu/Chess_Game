import sword from '../../../imgs/sword-svgrepo-com.svg'

export const Cell=(
    {
        getDefaultCellColor, 
        canActivateCell, 
        cell, 
        isCellFirstTap, 
        availableToMove, 
        setFigureMoves,
        getFigureClasses
    }) => {

    const {id, x, y, figure} = cell
    const isIncludesCellIdToMove = availableToMove.includes(id) 

    return (
        <div
            key={id}
            className={
                getDefaultCellColor(x, y) +
                ' opacity-75 d-flex justify-content-center align-items-center ' +
                canActivateCell(figure, id) +
                (isCellFirstTap(id) ? ' activeCell ' : '') +
                (
                    isIncludesCellIdToMove && figure ? 
                    ' bg-green cursor' 
                    :
                    isIncludesCellIdToMove ? 
                    ' fa-solid fa-circle green-circle fs-4 cursor' 
                    : 
                    ''
                )
            }
            style={{width: '4.1rem', height: '4.1rem'}}
            onClick={() => setFigureMoves(cell)}
        >
            { isIncludesCellIdToMove && figure && <img src={sword} width='50px' /> }
            <div className={`${getFigureClasses(cell?.figure, 'shadow')} fs-1 position-absolute `}/>
        </div>
    )
}