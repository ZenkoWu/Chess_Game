import React, { useEffect, useState } from 'react';
import { arrDefaultFigurePosition, figureTypes, lettersAxis,
 maxBoardHeight, maxBoardWidth, numbersAxis } from '../../Constants/Constans';
import sword from '.././../imgs/sword-svgrepo-com.svg'
import './ChessBoard.css'

export default function ChessBoard() {

  const [figures, setFigures] = useState(
    Array.from({ length: 32 }, (_, i) => ({
      id: i + 1,
      color: i < 16 ? 'black' : 'white',
      type: (
        'rook ' +
        'knight ' +
        'bishop ' +
        'queen ' +
        'king ' +
        'bishop ' +
        'knight ' +
        'rook ' +
        'pawn '.repeat(8)
      ).split(' ')[i % (maxBoardWidth * 2)],
    }))
  );

  const [cells, setCells] = useState(
    Array.from({ length: maxBoardWidth * maxBoardHeight }, (_, i) => ({
      id: lettersAxis[i % maxBoardWidth] + numbersAxis[Math.floor(i / maxBoardHeight) % maxBoardHeight],
      figure: null,
      x: i % maxBoardWidth,
      y: maxBoardHeight - 1 - (Math.floor(i / maxBoardHeight) % maxBoardHeight),
    }))
  );

  let [matchNumber, setMatchNumber] = useState(1);

  const [playerSide, setPlayerSide] = useState('white');

  const [move, setMove] = useState({});

  const [history, setHistory] = useState([]);

  const historyPush = (move) => setHistory((prev) => [...prev, { ...move, figureColor: playerSide }]);

  const [availableToMove, setAvailableToMove] = useState([]);

  useEffect(() => {

    setDefaultFigurePosition(arrDefaultFigurePosition);
    setMatchNumber(Math.floor(Math.random() * 10000000));

  }, []);


  useEffect(() => {
    if (move.secondTap) {

      setFigureInCell(move.firstTap.figure, move.secondTap.x, move.secondTap.y);
      setCells((prev) =>
        prev.map((el) => {
          if (el.id === move.firstTap.id) {
            return { ...el, figure: null };
          } else {
            return el;
          }
        })
      );

      setAvailableToMove([]);

      historyPush(move);
      setMove({});
      // setPlayerSide(prev => prev === 'white' ? 'black' : 'white')

    } else if (move.firstTap) {
        // count where we can go
        setAvailableToMove([...whereFigureCouldGo(getFigureById(move.firstTap.figure), move.firstTap)]);
    }
  }, [move]);

 

  const getDefultCellColor = (x, y) => {
    return (x % 2 === 0 && y % 2 === 0) || (x % 2 !== 0 && y % 2 !== 0)
      ? 'bg-lightColored'
      : 'bg-brown';
  };

  function setFigureInCell(figId, x, y) {
    setCells((prev) =>
      prev.map((el) => ({
        ...el,
        figure: el.x === x && el.y === y ? figId : el.figure,
      }))
    );
  }

  function setDefaultFigurePosition(arr) {
    let arrayOfFoundElementsId = [];
    let foundFigureId;

    arr.forEach((el) => {
      for (let i = el.start; i < maxBoardWidth; i += el.xOffsetBetweenFigures) {
        foundFigureId = figures.find(
          (f) =>
            f.type === el.type &&
            f.color === el.color &&
            !arrayOfFoundElementsId.includes(f.id)
        ).id;
        arrayOfFoundElementsId.push(foundFigureId);
        setFigureInCell(foundFigureId, i, el.y);
      }
    });
  }


  const getFigureById = (id) => figures.find((el) => el.id === id);

  const renderFigure = (id, shadow) => {
    const figure = getFigureById(id);

    if (figure) {
      return (
        figureTypes.find((it) => it.value === figure.type).icon + ' text-' + figure.color +
        (figure.color === 'white' && shadow ? ' figureShadow' : '')
      );
    }

  };

  const getCell = (x, y) => cells.find(cell => cell.y === y && cell.x === x)

  const getCellId = (x, y) => cells.find(cell => cell.y === y && cell.x === x)?.id

  const getFigureIdFromCell = (x, y) => cells.find(cell => cell.y === y && cell.x === x)?.figure
  
  const getFigureByXY = (x, y) => {
    const figId = cells.find(c => c.x === x && c.y === y)?.figure
    const fig = figures.find(f => f.id === figId)
    return fig
  }

 
  const whereFigureCouldGo = (figure, cell) => {
    let dots = [] 
    
    let figureDots = figureTypes.find(f => f.value === figure.type)?.getDotsToMove(cell, figure.color)

    if (figure?.type === 'pawn') {

      let [x, y] = figureDots;

      if ((cell.y == 6 || cell.y == 1) && !getCell(x, y + (figure.color === 'black' ? -1 : 1))?.figure && !getCell(x, y)?.figure) {
        dots.push(getCellId(x, y +(figure.color === 'black' ? -1 : 1))) //добавляем точку для хода на 2 клетки из начального положения
      } 
      if (getFigureByXY(x + 1, y)?.color === (figure.color === 'black' ? 'white' : 'black') ) {
        dots.push(getCellId(x + 1, y)) // добавляем точку чтобы убить фигуры по диагонали вправо
      }
      if (getFigureByXY(x - 1, y)?.color === (figure.color === 'black' ? 'white' : 'black')) {
        dots.push(getCellId(x - 1, y)) // добавляем точку чтобы убить фигуры по диагонали влево 
      }
      if (getCell(x, y)?.figure) {
        return dots; // возвращаем массив если встречаем фигуру впереди
      } 
          
      dots.push(getCellId(x, y)) // добавляем точку для хода вперед на одну клетку 

        
    } else {
      const pushCellsIdWhereFigureCanGo = (x, y, array) => {
        if(x < 0 || x >= maxBoardWidth || y < 0 || y >= maxBoardHeight) 
          return true;

        const figure = getFigureById(getFigureIdFromCell(x, y))

        if (figure) {
          if (figure.color !== playerSide) {
            array.push(getCellId(x, y));
          }
          return true;
        }
        array.push(getCellId(x, y));
      }

        figureDots?.forEach(el => {
          if(Array.isArray(el)) {
            for (let p of el) {
              if ( pushCellsIdWhereFigureCanGo(p.x, p.y, dots)) {
                break;
              }
            }
          } else {
            pushCellsIdWhereFigureCanGo(el.x, el.y, dots)
          }
        })
  
    }
    return dots;
  };

  const isCellFirstTap = (cell) => cell.id === move.firstTap?.id;

  const canActivateCell = (cell) => {
    // функция, подсвечивающая какие фигуры можно нажать для хода
    const figure = getFigureById(cell.figure);
    return figure?.color === playerSide && !isCellFirstTap(cell) ? 'cellOnFocus' : null;
  };

  const setFigureMoves = (cell) => {
    const figure = getFigureById(cell.figure);

    if (figure?.color === playerSide) {
      setMove((prev) => ({ ...prev, firstTap: cell }));
    } 
    else if (availableToMove.includes(cell.id)) {
      setMove((prev) => ({ ...prev, secondTap: cell }));

    }
  };

  return (
    <div className='row m-0 mw-100 p-2 px-5'>
      <div className=' col-lg-3 col-sm-12 border p-2'>
          <div className='bg-brown opacity-75 p-3 text-light'>
            <div>{'Матч'}</div>
            <div>{matchNumber}</div>
          </div>
      </div>

      <div className='col-lg-6 col-sm-12 border p-2'>
        <div className='boardBorderColor'>

          <div className='row m-0 mw-100 px-4'>
            {lettersAxis.map((item, i) => (
              <div key={i} className='col border fw-bold'>
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
                {cells.map((cell, i) => (
                  <div
                    key={cell.id}
                    className={
                      getDefultCellColor(cell.x, cell.y) +
                      ' opacity-75 d-flex justify-content-center align-items-center  ' +
                      canActivateCell(cell) +
                      ' ' +
                      (isCellFirstTap(cell) ? 'activeCell' : '') +
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
                        className={`${renderFigure(cell.figure, 'shadow')} fs-1 position-absolute`}
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

      {/* historyBoard */}
      <div className='col-lg-3 col-sm-12 border p-2'>
        <div className={'bg-black text-white border ' + (playerSide === 'black' ? ' opacity-75' : ' opacity-50')}>
          <div className='row m-0 mw-100 py-1 px-2'>
            <div className='col text-start ps-1'>{'Player'}</div>
            <div className='col p-0 text-end'>
              {playerSide === 'black' ? '<' : null}
            </div>
          </div>
          <div className='d-flex'>
            <div className={'p-2 w-50 fs-4 ' + (playerSide === 'black' ? 'playerTurn' : '')}>
              --:--
            </div>
            <div className=' text-start ps-2 w-50'>
              {
                history.map(el => (
                  el.secondTap?.figure && el.figureColor === 'black'
                  ?
                  <i className={(renderFigure(el.secondTap?.figure)) + ' pe-1 '}/>
                  : 
                  null
                ))
              }
            </div>
          </div>
        </div>

          <div className='py-1'>
            <div className='bg-brown py-1 px-3 text-center' style={{overflow: 'auto', height: '300px' }}>
              {history.map((el, i) => (
                <div className='border-bottom-brown text-white row py-1 '>
                  <div className='px-2 col-2'>{i + 1}</div>
                  <div className={`text-${el.figureColor} col-5`}>
                    <span className={renderFigure(el.firstTap?.figure) + ' px-1'}/>
                    {el.firstTap?.id}
                  </div>
                  <div className={`text-${el.figureColor} text-end pe-5 col-5`}>
                    {el.secondTap?.figure ? 
                      <i className={renderFigure(el.secondTap?.figure) + ' px-1'}/>
                    : null
                    }
                    {el.secondTap?.id}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='pb-1'>
            <div className='bg-brown'>
              <div className='fs-2 text-white p-3'>
                <i class='fa-solid fa-house pe-4 cursor'/>
                <i class='fa-solid fa-flag fs-3 cursor'/>
              </div>
            </div>
          </div>

        <div className={'bg-white ' + (playerSide !== 'white' ? ' opacity-50' : '')}>
          <div className='row m-0 mw-100 py-1 px-2'>
            <div className='col text-start ps-1'>{'Player'}</div>
            <div className='col p-0 text-end'>
              {playerSide === 'white' ? '<' : null}
            </div>
          </div>
          <div className='d-flex'>
            <div className={'p-2 w-50 fs-4 ' + (playerSide === 'white' ? 'playerTurn' : '')}>
              --:--
            </div>
            <div className=' text-start ps-2 w-50'>
              {
                history.map(el => (
                  el.secondTap?.figure && el.figureColor === 'white'
                  ?
                  <i className={(renderFigure(el.secondTap?.figure)) + ' pe-1 '}/>
                  : 
                  null
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


