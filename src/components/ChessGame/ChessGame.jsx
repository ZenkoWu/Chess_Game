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
import { colors, figureTypes, pieces } from '../../constants/figureTypes';
import { moveActions } from '../../constants/moveActions';

export function ChessGame() {

    const [figures, setFigures] = useState(
        Array.from({ length: 32 }, (_, i) => ({
        id: i + 1,
        color: i < 16 ? colors.BLACK : colors.WHITE,
        type: (
            (pieces.ROOK + ' ').repeat(2) +
            (pieces.KNIGHT + ' ').repeat(2) +
            (pieces.BISHOP + ' ').repeat(2) +
            (pieces.QUEEN + ' ') +
            (pieces.KING + ' ') +
            (pieces.PAWN + ' ').repeat(8)
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
    const [playerSide, setPlayerSide] = useState(colors.WHITE);
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
            setAvailableToMove([]);
            historyPush(move);
            setMove({});

            // TODO debug 
            // setPlayerSide(prev => prev === colors.WHITE ? colors.BLACK : colors.WHITE)

        } else if (move.firstTap) {
            // count where we can go
            setAvailableToMove(whereFigureCouldGo(getFigureById(move.firstTap.figure), move.firstTap));
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
            )?.id;
            arrayOfFoundElementsId.push(foundFigureId);
            setFigureInCell(foundFigureId, i, el.y);
        }
        });
    }

    const isCellFirstTap = (cellId) => cellId === move.firstTap?.id;
    
    const canActivateCell = (figureId, cellId) => 
        getFigureById(figureId)?.color === playerSide && !isCellFirstTap(cellId) ? 'cellOnFocus' : null;
    
    
    function setFigureInCell(figId, x, y) {
        setCells((prev) =>
            prev.map((el) => ({
                ...el,
                figure: el.x === x && el.y === y ? figId : (el.figure !== figId ? el.figure : null)
            }))
        );
    }

    const getFigureById = (id) => figures.find((el) => el.id === id);

    const getFigureClasses = (id, shadow) => {
        const figure = getFigureById(id);

        if (figure) {
            return (
                figureTypes.find((it) => it.value === figure.type)?.icon + ' text-' + figure.color +
                (figure.color === colors.WHITE && shadow ? ' figureShadow' : '')
            );
        }

        return null;
    };

    const getCell = (x, y) => cells.find(cell => cell.y === y && cell.x === x)
    const getCellId = (x, y) => getCell(x, y)?.id
    const getFigureIdFromCell = (x, y) => getCell(x, y)?.figure
    
    const getFigureByXY = (x, y) => {
        const figId = getFigureIdFromCell(x, y)
        return figures.find(f => f.id === figId)
    }

    const whereFigureCouldGo = (figure, cell) => {
        let dots = [] 
        
        let figureDots = figureTypes.find(f => f.value === figure.type)?.getDotsToMove(cell, figure.color)

        const pushCellsIdWhereFigureCanGo = (x, y, array) => {
            const figure = getFigureById(getFigureIdFromCell(x, y))

            if (figure) {
                if (figure.color !== playerSide) {
                    array.push(getCellId(x, y));
                }
                return true;
            }
            array.push(getCellId(x, y));
            return false;
        }
        
        figureDots?.data.forEach(el => {
            if(figureDots.action === moveActions.COULD_BE_INTERRUPTED) {
                for (let p of el) {
                    if ( pushCellsIdWhereFigureCanGo(p.x, p.y, dots)) 
                        break;
                }

            } else if (figureDots.action === moveActions.MOVE_FOR_KNIGHT) 
                pushCellsIdWhereFigureCanGo(el.x, el.y, dots)
                
            else if (figureDots.action === moveActions.MULTI_ACTION) {
                const {x, y} = el.data
                const isCellContainsFigure = (x, y) => getCell(x, y)?.figure

                if (el.action === moveActions.PAWN_MOVE && !isCellContainsFigure(x, y)) 
                    pushCellsIdWhereFigureCanGo(x, y, dots)

                const isPawnInitialPosition = (cell.y === 6 || cell.y === 1)
                if (el.action === moveActions.PAWN_MOVE_TWO_CELLS && 
                    isPawnInitialPosition && 
                    !isCellContainsFigure(x, y + (figure.color === colors.BLACK ? 1 : -1))
                ) 
                    pushCellsIdWhereFigureCanGo(x, y, dots)

                // todo 
                const isActionPawnKillLeft = el.action === moveActions.PAWN_KILL_LEFT 
                const isEnemyFigureColor = getFigureByXY(x, y)?.color === (figure.color === colors.BLACK ? colors.WHITE : colors.BLACK)
                
                if (isActionPawnKillLeft && isEnemyFigureColor)      
                    pushCellsIdWhereFigureCanGo(x, y, dots)        

                if (el.action === moveActions.PAWN_KILL_RIGHT && isEnemyFigureColor) 
                    pushCellsIdWhereFigureCanGo(x, y, dots)
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
                    isPlayerTurn={playerSide === colors.BLACK}  
                    side={colors.BLACK} 
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
                    isPlayerTurn={playerSide === colors.WHITE} 
                    side={colors.WHITE}
                />

            </div>
        </div>
    );
}