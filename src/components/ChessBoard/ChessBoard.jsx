import { lettersAxis, numbersAxis } from '../../constants/constans';
import { Cell } from './Cell/Cell';
import './ChessBoard.css'

export default function ChessBoard({
  cells, isCellFirstTap, canActivateCell, 
  availableToMove, renderFigure, setFigureMoves }) {

  const getDefaultCellColor = (x, y) => {
    return (x % 2 === 0 && y % 2 === 0) || (x % 2 !== 0 && y % 2 !== 0)
      ? 'bg-lightColored'
      : 'bg-brown';
  };

  return (
    <div className='boardBorderColor'>

      <div className='row m-0 mw-100 px-4'>
          {lettersAxis.map((item, i) => (
            <div key={i} className='col fw-bold '>
              {item}
            </div>
          ))}
        </div> 

      <div className='row m-0 mw-100'>
        <div className={`col p-0 `}>
          {numbersAxis.map((item, i) => (
            <div key={i} className=' fw-bold' style={{padding:'20px 0'}}>
              {item}
            </div>
          ))}
        </div>
        
        <div className='col-11 p-0 '>  
          <div className='row m-0 mw-100 '> 
            {cells.map(cell => (
              <Cell
                key = {cell.id}
                getDefaultCellColor = {getDefaultCellColor}
                canActivateCell = {canActivateCell}
                cell = {cell}
                availableToMove = {availableToMove}
                setFigureMoves = {setFigureMoves}
                renderFigure = {renderFigure}
                isCellFirstTap = {isCellFirstTap}
              />
            ))}
          </div>
        </div>

        <div className={`col p-0  `}>
          {numbersAxis.map((item, i) => (
            <div key={i} className=' fw-bold ' style={{padding:'20px 0'}}>
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className='row m-0 mw-100 px-4 '>
          {lettersAxis.map((item, i) => (
            <div key={i} className='col fw-bold'>
              {item}
            </div>
          ))}
        </div>
    </div>
  );
}

