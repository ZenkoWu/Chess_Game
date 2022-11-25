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
import { Modal } from '../Modal/Modal';

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

    const [modalWindow, setModalWindow] = useState({isOpened: false})

    const [check, setCheck] = useState(false)

    useEffect(() => {

        const whiteKingId = figures.find( fig => fig.type === pieces.KING && fig.color === colors.WHITE)?.id
        const cellWithWhiteKing = cells.find(c => c.figure === whiteKingId)

        const blackKingId = figures.find( fig => fig.type === pieces.KING && fig.color === colors.BLACK)?.id
        const cellWithBlackKing = cells.find(c => c.figure === blackKingId)

        let arrOfEnemyFigureMoves = cells.map(c => {
            let isEnemyFigureColor = getFigureById(c.figure)?.color !== playerSide
            return whereFigureCouldGo( isEnemyFigureColor && getFigureById(c.figure), c)
        }).filter(arr => arr.length > 0)

        arrOfEnemyFigureMoves = [].concat(...arrOfEnemyFigureMoves);   
        
        if (arrOfEnemyFigureMoves.includes(cellWithBlackKing?.id) ) {
            console.log('шах')
            setCheck({cellId: cellWithBlackKing.id})
        } 
        else if (arrOfEnemyFigureMoves.includes(cellWithWhiteKing?.id)) {
            console.log('шах')
            setCheck({cellId: cellWithWhiteKing.id})
        }
        
            
    }, [playerSide])

    useEffect(() => {
        if (move.secondTap) {
           
            setFigureInCell(move.firstTap.figure, move.secondTap.x, move.secondTap.y);
            setAvailableToMove([]);
            historyPush(move);
        
            setRookPositionWhenCastling(move)

            const isPawn = getFigureById(move.firstTap.figure).type === pieces.PAWN
            const isBoardEnd = move.secondTap.y === 7 || move.secondTap.y === 0
            if ( isPawn && isBoardEnd) {
                setModalWindow({isOpened: true, figId: move.firstTap.figure})
            }

            setMove({});  
            // TODO debug 
            setPlayerSide(prev => prev === colors.WHITE ? colors.BLACK : colors.WHITE)
            setCheck(false)
            
        } else if (move.firstTap) {

            let figure = getFigureById(move.firstTap.figure)
            
            let dotsForFigureMove = whereFigureCouldGo(figure, move.firstTap)
            let dotsForEnemyMoves = [] 
            
            cells.forEach(c => {
                if (getFigureById(c.figure)?.color !== playerSide) {
                    whereFigureCouldGo(getFigureById(c.figure), c).forEach(el => dotsForEnemyMoves.push(el))
                }
            })

            if (figure.type === pieces.KING) { // король независимо от ситуации не ходит под удар
                dotsForFigureMove = dotsForFigureMove.filter(el => !dotsForEnemyMoves.includes(el))
                setAvailableToMove(dotsForFigureMove);
                if(dotsForFigureMove.length < 1)
                    console.log('checkmate')
            } 
            else if(!check) { 
                setAvailableToMove(dotsForFigureMove);
            } 
            else if(check) { // если шах и фигура != король
                // фигура может ходить только если может защитить короля или убить фигуру
                let attackingPiece = history.at(-1)
                let dotsWhereAttackingPieceCanGo = whereFigureCouldGo(getFigureById(attackingPiece.firstTap.figure), attackingPiece.secondTap)
                
                let getCellById = (id) => cells.find(el => el.id === id)

                const blackKingId = figures.find( fig => fig.type === pieces.KING && fig.color === colors.BLACK)?.id
                const cellWithBlackKing = cells.find(c => c.figure === blackKingId)
                const whiteKingId = figures.find( fig => fig.type === pieces.KING && fig.color === colors.WHITE)?.id
                const cellWithWhiteKing = cells.find(c => c.figure === whiteKingId)

                let cellsBetweenKingAndAttaking = dotsWhereAttackingPieceCanGo.filter(el => {
                    let xOfAttackingFigure = attackingPiece.secondTap.x
                    let yOfAttackingFigure = attackingPiece.secondTap.y
                    let xOfKing = playerSide === 'black' ? cellWithBlackKing.x : cellWithWhiteKing.x
                    let yOfKing = playerSide === 'black' ? cellWithBlackKing.y : cellWithWhiteKing.y

                    let cell = getCellById(el)
                    return (
                        cell.x <= xOfAttackingFigure && cell.x >= xOfKing && cell.y >= yOfAttackingFigure && cell.y <= yOfKing ||
                        cell.x >= xOfAttackingFigure && cell.x <= xOfKing && cell.y <= yOfAttackingFigure && cell.y >= yOfKing ||
                        cell.x <= xOfAttackingFigure && cell.x >= xOfKing && cell.y <= yOfAttackingFigure && cell.y >= yOfKing ||
                        cell.x >= xOfAttackingFigure && cell.x <= xOfKing && cell.y >= yOfAttackingFigure && cell.y <= yOfKing
                    )
                }) 
                
                dotsForFigureMove = dotsForFigureMove.filter(el => 
                    cellsBetweenKingAndAttaking.includes(el) || //находится между королем и атакующей = может защитить короля
                    attackingPiece.secondTap.id == el // может убить фигуру 
                ) 

                setAvailableToMove(dotsForFigureMove);
            }
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

    const getFigureClasses = (id, shadow, type, color) => {
        const figure = getFigureById(id);

        if (figure) {
            return (
                figureTypes.find((it) => it.value === figure.type)?.icon + ' text-' + figure.color +
                (figure.color === colors.WHITE && shadow ? ' figureShadow' : '')
            );
        } 
        
        else if (type) {
            return (
                figureTypes.find((it) => it.value === type)?.icon + ' text-' + color +
                (color === colors.WHITE && shadow ? ' figureShadow' : '')
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

    const setRookPositionWhenCastling = (move) => {
        const isKing = getFigureById(move.firstTap.figure).type === pieces.KING
        const dotOfShortCastling = getCell(move.secondTap.x, move.secondTap.y) === getCell(move.firstTap.x + 2, move.firstTap.y)
        const dotOfLongCastling = getCell(move.secondTap.x, move.secondTap.y) === getCell(move.firstTap.x - 2, move.firstTap.y)

        if (isKing && dotOfShortCastling)
            setFigureInCell(getFigureIdFromCell(move.firstTap?.x + 3, move.firstTap?.y), move.firstTap.x + 1, move.firstTap.y)
        else if (isKing && dotOfLongCastling)
            setFigureInCell(getFigureIdFromCell(move.firstTap?.x - 4, move.firstTap?.y), move.firstTap.x - 1, move.firstTap.y)
    }

    const whereFigureCouldGo = (figure, cell) => {
        let dots = [] 
        let figureDots = figureTypes.find(f => f.value === figure?.type)?.getDotsToMove(cell, figure.color)
        let enemyFigureColor = figure?.color === colors.WHITE ? colors.BLACK  : colors.WHITE 

        const pushCellsIdWhereFigureCanGo = (x, y, array) => {
            const figure = getFigureById(getFigureIdFromCell(x, y))

            if (figure) {
                if(!check) {
                    if (figure.color === enemyFigureColor) {
                        array.push(getCellId(x, y));
                    }
                    return true;
                }
                else if (check && figure.color !== enemyFigureColor) 
                    return true;      
            }
        
            array.push(getCellId(x, y));
            return false;
        }
        
        figureDots?.data.forEach(el => {
            if (figureDots.action === moveActions.COULD_BE_INTERRUPTED) {
                for (let p of el) {
                    if ( pushCellsIdWhereFigureCanGo(p.x, p.y, dots)) 
                        break;
                }
            } 
            
            else if (figureDots.action === moveActions.MOVE_FOR_KNIGHT) 
                pushCellsIdWhereFigureCanGo(el.x, el.y, dots)

            else if (figureDots.action === moveActions.KING_ACTIONS) {
                if (el.action === moveActions.MOVE_FOR_KING) 
                    el.data.forEach(d => pushCellsIdWhereFigureCanGo(d.x, d.y, dots))

                else if (el.action === moveActions.SHORT_CASTLING || el.action === moveActions.LONG_CASTLING) {
                    const wasKingMoved = history.find(el =>
                        getFigureById(el.firstTap.figure).type === pieces.KING 
                        && el.figureColor === playerSide
                    )
                    
                    const isCellContainsFigure = (x, y) => getCell(x, y)?.figure
                    if (el.action === moveActions.SHORT_CASTLING) {
                        const wasRightRookMoved = history.find(h => 
                            getCellId(h.firstTap.x, h.firstTap.y) === getCellId(el.data.x + 1, el.data.y)) //H1, H8
                        
                        !wasKingMoved && 
                        !wasRightRookMoved && 
                        !isCellContainsFigure(el.data.x - 1, el.data.y) && 
                        pushCellsIdWhereFigureCanGo(el.data.x, el.data.y, dots);
                    }
                    
                    if (el.action === moveActions.LONG_CASTLING) {
                        const wasLeftRookMoved = history.find(h => 
                            getCellId(h.firstTap.x, h.firstTap.y) === getCellId(el.data.x - 2, el.data.y)) //A1, A8
                        
                        !wasKingMoved && 
                        !wasLeftRookMoved && 
                        !isCellContainsFigure(el.data.x + 1, el.data.y) &&
                        !isCellContainsFigure(el.data.x - 1, el.data.y) &&  
                        pushCellsIdWhereFigureCanGo(el.data.x, el.data.y, dots);   
                    }   
                }  
            }

            else if (figureDots.action === moveActions.PAWN_ACTIONS) {
                const {x, y} = el.data
                const isCellContainsFigure = (x, y) => getCell(x, y)?.figure

                const isActionPawnMove = el.action === moveActions.PAWN_MOVE
                if (isActionPawnMove && !isCellContainsFigure(x, y)) 
                    pushCellsIdWhereFigureCanGo(x, y, dots)

                const isPawnInitialPosition = (cell.y === 6 || cell.y === 1)
                const isActionPawnMoveTwo = el.action === moveActions.PAWN_MOVE_TWO_CELLS

                if ( 
                    isActionPawnMoveTwo && 
                    isPawnInitialPosition && 
                    !isCellContainsFigure(x, y + (figure.color === colors.BLACK ? 1 : -1))
                ) 
                    pushCellsIdWhereFigureCanGo(x, y, dots)

                const isEnemyFigureColor = getFigureByXY(x, y)?.color === (figure.color === colors.BLACK ? colors.WHITE : colors.BLACK)
                if(isEnemyFigureColor){
                    const isActionPawnKillLeft = el.action === moveActions.PAWN_KILL_LEFT 
                    const isActionPawnKillRight = el.action === moveActions.PAWN_KILL_RIGHT

                    if (isActionPawnKillLeft)      
                        pushCellsIdWhereFigureCanGo(x, y, dots)        
                
                    if (isActionPawnKillRight) 
                        pushCellsIdWhereFigureCanGo(x, y, dots)
                }
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

    const changePawnType = (newPawnType) => {
        setFigures(prev => 
            prev.map(fig => (
                {
                    ...fig, 
                    type: modalWindow.figId === fig.id ? newPawnType : fig.type
                }
            ))
        )
        setModalWindow({isOpened: false})
    }
    
    return (
        <div className='row m-0 mw-100 p-2 px-4'>
            {
                modalWindow.isOpened && 
                <Modal 
                    getFigureClasses={getFigureClasses} 
                    candidates={[pieces.KNIGHT, pieces.BISHOP, pieces.ROOK, pieces.QUEEN]} 
                    changePawnType={changePawnType}
                    color={playerSide}
                />}

            <div className='col-lg-3 col-sm-12 p-2'>
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
                    check={check}
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