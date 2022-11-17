import React, { useEffect, useState } from 'react';
import { 
    arrDefaultFigurePosition, 
    lettersAxis,
    maxBoardHeight, 
    maxBoardWidth, 
    numbersAxis 
} from '../../constants/constans';
import ChessBoard from '../ChessBoard/ChessBoard';
import './ChessGame.css'
import { HistoryBoard } from '../HistoryBoard/HistoryBoard';
import { PlayerTurn } from '../PlayerTurn/PlayerTurn';
import { figureTypes } from '../../constants/figureTypes';
import { moveActions } from '../../constants/moveActions';

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

    useEffect(() => {

        setDefaultFigurePosition(arrDefaultFigurePosition);
        setMatchNumber(Math.floor(Math.random() * 10000000));

    }, []);


    useEffect(() => {
        if (move.secondTap) {

        setFigureInCell(move.firstTap.figure, move.secondTap.x, move.secondTap.y);

        setCells(prev => 
            prev.map(el => (el.id === move.firstTap.id) ? { ...el, figure: null } :  el)
        );

        setAvailableToMove([]);
        historyPush(move);
        setMove({});
        // TODO debug 
        setPlayerSide(prev => prev === 'white' ? 'black' : 'white')

        } else if (move.firstTap) {
            // count where we can go
            setAvailableToMove([...whereFigureCouldGo(getFigureById(move.firstTap.figure), move.firstTap)]);
        }
    }, [move]);

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

    const isCellFirstTap = (cellId) => cellId === move.firstTap?.id;
    
    const canActivateCell = (figureId, cellId) => {
        const figure = getFigureById(figureId);
        return figure?.color === playerSide && !isCellFirstTap(cellId) ? 'cellOnFocus' : null;
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

    const getFigureClasses = (id, shadow) => {
        const figure = getFigureById(id);

        if (figure) {
            return (
                figureTypes.find((it) => it.value === figure.type).icon + ' text-' + figure.color +
                (figure.color === 'white' && shadow ? ' figureShadow' : '')
            );
        }

        return null;
    };

    const getCell = (x, y) => cells.find(cell => cell.y === y && cell.x === x)
    const getCellId = (x, y) => cells.find(cell => cell.y === y && cell.x === x)?.id
    const getFigureIdFromCell = (x, y) => cells.find(cell => cell.y === y && cell.x === x)?.figure
    
    const getFigureByXY = (x, y) => {
        const figId = cells.find(c => c.x === x && c.y === y)?.figure
        return figures.find(f => f.id === figId)
    }

    const whereFigureCouldGo = (figure, cell) => {
        let dots = [] 
        
        let figureDots = figureTypes.find(f => f.value === figure.type)?.getDotsToMove(cell, figure.color)

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
            if(figureDots.action === moveActions.COULD_BE_INTERRUPTED) {
                for (let p of el) {
                    if ( pushCellsIdWhereFigureCanGo(p.x, p.y, dots)) 
                        break;
                }

            } else if (figureDots.action === moveActions.MOVE_FOR_KNIGHT) 
                pushCellsIdWhereFigureCanGo(el.x, el.y, dots)


            else {
                const isCellContainsFigure = (x, y) => getCell(x, y)?.figure

                if (el.action === moveActions.PAWN_MOVE && !isCellContainsFigure(el.x, el.y)) 
                pushCellsIdWhereFigureCanGo(el.x, el.y, dots)

                const isPawnInitialPosition = (cell.y === 6 || cell.y === 1)
                
                if (el.action === moveActions.PAWN_MOVE_TWO_CELLS 
                    && isPawnInitialPosition 
                    && !isCellContainsFigure(el.x, el.y + (figure.color === 'black' ? 1 : -1))
                    ) 

                    pushCellsIdWhereFigureCanGo(el.x, el.y, dots)

                // todo 
                const isActionPawnKillLeft = el.action === moveActions.PAWN_KILL_LEFT 
                const isEnemyFigureColor = getFigureByXY(el.x, el.y)?.color === (figure.color === 'black' ? 'white' : 'black')
                
                if (isActionPawnKillLeft && isEnemyFigureColor)      
                    pushCellsIdWhereFigureCanGo(el.x, el.y, dots)        

                if (el.action === moveActions.PAWN_KILL_RIGHT && isEnemyFigureColor) 
                    pushCellsIdWhereFigureCanGo(el.x, el.y, dots)
            }
        })

        return dots;
    };
    
    const setFigureMoves = (cell) => {
        const figure = getFigureById(cell.figure);

        if (figure?.color === playerSide) 
            setMove( prev => ({ ...prev, firstTap: cell }));
        
        else if (availableToMove.includes(cell.id)) 
            setMove( prev => ({ ...prev, secondTap: cell }));
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
                    cells={cells} 
                    isCellFirstTap={isCellFirstTap} 
                    canActivateCell={canActivateCell} 
                    availableToMove={availableToMove}
                    setFigureMoves={setFigureMoves}
                    getFigureClasses={getFigureClasses}
                />
            </div>

            <div className='col-lg-3 col-sm-12 p-2'>

                <PlayerTurn 
                    history={history} 
                    getFigureClasses={getFigureClasses} 
                    isPlayerTurn={playerSide === 'black'}  
                    side='black' 
                />
            
                <HistoryBoard history={history} getFigureClasses={getFigureClasses}/>

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
                    getFigureClasses={getFigureClasses} 
                    isPlayerTurn={playerSide === 'white'} 
                    side='white' 
                />

            </div>
        </div>
    );
}