import { lettersAxis, numbersAxis } from '../../constants/constans';
import sword from '.././../imgs/sword-svgrepo-com.svg'
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
      <div className='row m-0 mw-100'>
        <div className='row m-0 mw-100 px-4'>
          {lettersAxis.map((item, i) => (
            <div key={i} className='col fw-bold'>
              {item}
            </div>
          ))}
        </div>
        <div className={`col p-0 `}>
          {numbersAxis.map((item, i) => (
            <div key={i} className=' fw-bold' style={{padding:'20px 0'}}>
              {item}
            </div>
          ))}
        </div>
        
        <div className='col-11 p-0 '>  
          <div className='row m-0 mw-100 '> 
            {cells.map((cell, i) => (
              <div
                key={cell.id}
                className={
                  getDefaultCellColor(cell.x, cell.y) +
                  '  opacity-75 d-flex justify-content-center align-items-center  ' +
                  canActivateCell(cell) +
                  ' ' +
                  (isCellFirstTap(cell) ? 'activeCell ' : '') +
                  (availableToMove.includes(cell.id) && cell.figure
                  ? ' bg-green cursor'
                  :
                    availableToMove.includes(cell.id) 
                    ? ' fa-solid fa-circle green-circle fs-4 cursor'
                    
                    : '')
                }
                style={{ width: 'calc(500px /8)', height: 'calc(520px /8)'}}
                onClick={() => setFigureMoves(cell)}
              >
                {
                  availableToMove.includes(cell.id) && cell.figure
                  ? 
                  <img src={sword} alt='' width='50px' style={{}}/>
                  : ''
                }
                {cell.figure ? (
                  <div
                    className={`${renderFigure(cell.figure, 'shadow')} fs-1 position-absolute  `}
                  >
                  </div>
                ) : null}
              </div>
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
        <div className='row m-0 mw-100 px-4 '>
        {lettersAxis.map((item, i) => (
          <div key={i} className='col fw-bold'>
            {item}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

