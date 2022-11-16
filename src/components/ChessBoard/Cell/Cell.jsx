import sword from '../../../imgs/sword-svgrepo-com.svg'

export const Cell = ({getDefaultCellColor, canActivateCell, cell, isCellFirstTap, availableToMove, setFigureMoves,
  renderFigure}) => {

  return (
    <div
      key={cell.id}
      className={
      getDefaultCellColor(cell.x, cell.y) +
      '   opacity-75 d-flex justify-content-center align-items-center  ' +
      canActivateCell(cell) +
      ' ' +
      (isCellFirstTap(cell) ? 'activeCell ' : '') +
      (availableToMove.includes(cell.id) && cell.figure ? 
        ' bg-green cursor' 
        :
        availableToMove.includes(cell.id) ? 
        ' fa-solid fa-circle green-circle fs-4 cursor' 
        : 
        '')
      }
      style={{ width: '11vh', height: '11vh'}}
      onClick={() => setFigureMoves(cell)}
      >
      {
      availableToMove.includes(cell.id) && cell.figure
      ? 
      <img src={sword} width='50px' />
      : ''
      }
      {cell.figure ? (
      <div className={`${renderFigure(cell?.figure, 'shadow')} fs-1 position-absolute `}/>
      ) : null}
    </div>
  )
}