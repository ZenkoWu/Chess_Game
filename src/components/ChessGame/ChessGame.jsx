import React, { useEffect, useState } from 'react';
import { arrDefaultFigurePosition, lettersAxis,
 maxBoardHeight, maxBoardWidth, numbersAxis } from '../../constants/constans';
import ChessBoard from '../ChessBoard/ChessBoard';
import './ChessGame.css'
import { HistoryBoard } from '../HistoryBoard/HistoryBoard';
import { PlayerTurn } from '../PlayerTurn/PlayerTurn';
import { figureTypes } from '../../constants/figureTypes';

export function ChessGame() {

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

  const [matchNumber, setMatchNumber] = useState(1);

  const [playerSide, setPlayerSide] = useState('white');

  const [move, setMove] = useState({});

  const [history, setHistory] = useState([]);

  const historyPush = (move) => setHistory((prev) => [...prev, { ...move, figureColor: playerSide }]);

  const [availableToMove, setAvailableToMove] = useState([]);

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

 

  const isCellFirstTap = (cell) => cell.id === move.firstTap?.id;
  
  const canActivateCell = (cell) => {
    const figure = getFigureById(cell.figure);
    return figure?.color === playerSide && !isCellFirstTap(cell) ? 'cellOnFocus' : null;
  };
  

  function setFigureInCell(figId, x, y) {
    setCells((prev) =>
      prev.map((el) => ({
        ...el,
        figure: el.x === x && el.y === y ? figId : el.figure,
      }))
    );
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

    // if (figure?.type === 'pawn') {

    //   let [x, y] = figureDots;

    //   if ((cell.y == 6 || cell.y == 1) && !getCell(x, y + (figure.color === 'black' ? -1 : 1))?.figure && !getCell(x, y)?.figure) {
    //     dots.push(getCellId(x, y +(figure.color === 'black' ? -1 : 1))) //добавляем точку для хода на 2 клетки из начального положения
    //   } 
    //   if (getFigureByXY(x + 1, y)?.color === (figure.color === 'black' ? 'white' : 'black') ) {
    //     dots.push(getCellId(x + 1, y)) // добавляем точку чтобы убить фигуры по диагонали вправо
    //   }
    //   if (getFigureByXY(x - 1, y)?.color === (figure.color === 'black' ? 'white' : 'black')) {
    //     dots.push(getCellId(x - 1, y)) // добавляем точку чтобы убить фигуры по диагонали влево 
    //   }
    //   if (getCell(x, y)?.figure) {
    //     return dots; // возвращаем массив если встречаем фигуру впереди
    //   } 
          
    //   dots.push(getCellId(x, y)) // добавляем точку для хода вперед на одну клетку 

        
    // } 
    // else {
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
      
        figureDots?.data.forEach(el => {
          if(figureDots.action == 'c') {
            for (let p of el) {
              if ( pushCellsIdWhereFigureCanGo(p.x, p.y, dots)) {
                break;
              }
            }
          } else if (figureDots.action == 'k') {
              pushCellsIdWhereFigureCanGo(el.x, el.y, dots)
          } if (el.action == 'go' && !getCell(el.x, el.y)?.figure) {
              pushCellsIdWhereFigureCanGo(el.x, el.y, dots)
          } if (el.action == 'go2' && (cell.y == 6 || cell.y == 1) && !getCell(el.x, el.y)?.figure) {
              pushCellsIdWhereFigureCanGo(el.x, el.y, dots)
          } if (el.action == 'killR' 
          && getFigureByXY(el.x + 1, el.y)?.color === (figure.color === 'black' ? 'white' : 'black')) {
            pushCellsIdWhereFigureCanGo(el.x, el.y, dots)
          } if (el.action == 'killL' 
          && getFigureByXY(el.x - 1, el.y)?.color === (figure.color === 'black' ? 'white' : 'black'))
        {
           pushCellsIdWhereFigureCanGo(el.x, el.y, dots)

        }
        })

      // }
       
  
    // }
    return dots;
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
    <div className='row m-0 mw-100 p-2 px-4'>

      <div className=' col-lg-3 col-sm-12 p-2'>
          <div className='bg-brown opacity-75 p-3 text-light'>
            <div>{'Матч'}</div>
            <div>{matchNumber}</div>
          </div>
      </div>

      <div className='col-lg-6 col-sm-12 p-2'>
        <ChessBoard 
            cells ={cells} 
            isCellFirstTap = {isCellFirstTap} 
            canActivateCell={canActivateCell} 
            availableToMove={availableToMove}
            setFigureMoves={setFigureMoves}
            renderFigure={renderFigure}
        />
      </div>

      <div className='col-lg-3 col-sm-12 p-2'>
        <PlayerTurn 
            history={history} 
            renderFigure={renderFigure} 
            playerSide={playerSide} 
            color='black' 
            textColor='white'
        />
        <HistoryBoard history={history} renderFigure={renderFigure}/>

          <div className='pb-1'>
            <div className='bg-brown'>
              <div className='fs-2 text-white p-3'>
                <i className='fa-solid fa-house pe-4 cursor'/>
                <i className='fa-solid fa-flag fs-3 cursor'/>
              </div>
            </div>
          </div>

        <PlayerTurn 
            history={history}  
            renderFigure={renderFigure} 
            playerSide={playerSide} 
            color='white' 
            textColor='black'
        /> 
      </div>
    </div>
  );
}