import React, { useEffect, useState } from 'react';
import { 
    arrDefaultFigurePosition, 
    figuresInitialState, 
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
import { ChangePawnTypeModal } from '../Modal/ChangePawnTypeModal';

export function ChessGame({changeTheme, theme}) {

    const [figures, setFigures] = useState(figuresInitialState)

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
    const [availableToMove, setAvailableToMove] = useState([]);

    useEffect(() => {

        setDefaultFigurePosition(arrDefaultFigurePosition);
        setMatchNumber(Math.floor(Math.random() * 10000000));

    }, []);

    const [modalWindow, setModalWindow] = useState({isOpened: false})

    const [check, setCheck] = useState({isCheck: false})
    const [isCheckmate, setCheckmate] = useState(false)
    
    const [resetTimer, setResetTimer] = useState(true)
    const [isDraw, setDraw] = useState(false)
    
    const historyPush = (move) => setHistory((prev) => [...prev, { ...move, figureColor: playerSide}]);
    
    const whiteKingId = figures.find(fig => fig.type === pieces.KING && fig.color === colors.WHITE)?.id
    const blackKingId = figures.find( fig => fig.type === pieces.KING && fig.color === colors.BLACK)?.id

    useEffect(()=> {
        let cellsWithFigures = cells.filter(el => el.figure)
        .map(el => {
            let figure = getFigureById(el.figure)
            return {type: figure?.type, color: figure?.color}
        })

        let blackKingWithLightFigure = cellsWithFigures.filter(el => 
            el.color === colors.BLACK && 
            (el.type === pieces.KNIGHT || 
            el.type === pieces.BISHOP ||
            el.type === pieces.KING)
        )
        let whiteKingWithLightFigure = cellsWithFigures.filter(el => 
            el.color === colors.WHITE && 
            (el.type === pieces.KNIGHT || 
            el.type === pieces.BISHOP ||
            el.type === pieces.KING)
        )
       
        let twoKing = cellsWithFigures.length === 2

       if(
            twoKing || 
            (blackKingWithLightFigure.length == 2 || whiteKingWithLightFigure.length == 2 && cellsWithFigures <= 4)
        ) {
            setDraw(true)
        }
    }, [playerSide, modalWindow]) 

    useEffect(()=> {

        let dotsForPlayerSideFiguresMove = []

        if(check.isCheck) {
            cells.forEach(c => {
                if(getFigureById(c.figure)?.color === playerSide) {
                    let dotsToMove = whereFigureCouldGo(getFigureById(c.figure), c)
                    if(getFigureById(c.figure).type !== pieces.KING) {
                        dotsForPlayerSideFiguresMove.push(...canProtectKingWhenCheck(dotsToMove)) 
                    }
                    else {
                        dotsForPlayerSideFiguresMove.push(...canKingMove(dotsToMove))
                    }
                }
            })

            if (dotsForPlayerSideFiguresMove.length < 1) 
                setCheckmate(true)
        }
    }, [cells, check, modalWindow])

    useEffect(() => {

        const cellWithWhiteKing = cells.find(c => c.figure === whiteKingId)
        const cellWithBlackKing = cells.find(c => c.figure === blackKingId)

        let arrOfEnemyFigureMoves = cells.map(c => {
            let isEnemyFigureColor = getFigureById(c.figure)?.color !== playerSide
            return whereFigureCouldGo(isEnemyFigureColor && getFigureById(c.figure), c)
        }).filter(arr => arr.length > 0)

        arrOfEnemyFigureMoves = [].concat(...arrOfEnemyFigureMoves);   
        
        if (arrOfEnemyFigureMoves.includes(cellWithBlackKing?.id) ) {
            setCheck({isCheck: true, cellId: cellWithBlackKing.id})
        } 
        else if (arrOfEnemyFigureMoves.includes(cellWithWhiteKing?.id)) {
            setCheck({isCheck: true, cellId: cellWithWhiteKing.id})
        }

    }, [playerSide, modalWindow])

    useEffect(() => {
        if (move.secondTap) {

            setFigureInCell(move.firstTap.figure, move.secondTap.x, move.secondTap.y);
            setAvailableToMove([]);

            (
                setRookPositionWhenCastling(move) ? 
                setHistory(prev => [
                    ...prev, 
                    {
                        ...move, 
                        figureColor: playerSide, 
                        castling: (move.secondTap.x === move.firstTap.x + 2 ? '0-0' : '0-0-0')
                    }
                ]) 
                :
                historyPush(move)
            )

            const isPawn = getFigureById(move.firstTap.figure).type === pieces.PAWN
            const isBoardEnd = move.secondTap.y === 7 || move.secondTap.y === 0
            if (isPawn && isBoardEnd) {
                setModalWindow({
                    isOpened: true, 
                    figId: move.firstTap.figure, 
                    figX: move.secondTap.x, 
                    figY: move.secondTap.y, 
                    color: playerSide
                })
            }

            setMove({});  
            // todo debug
            setPlayerSide(prev => prev === colors.WHITE ? colors.BLACK : colors.WHITE)
            setCheck({isCheck: false})
            
        } else if (move.firstTap) {
            
            setResetTimer(false)

            let figure = getFigureById(move.firstTap.figure)
            let dotsForFigureMove = whereFigureCouldGo(figure, move.firstTap)

            if (figure.type === pieces.KING) { 
                // король не ходит под удар
                setAvailableToMove(canKingMove(dotsForFigureMove));
            } 
            else if(!check.isCheck) { 
                setAvailableToMove(dotsForFigureMove);
            } 
            else if(check.isCheck) { 
                // если шах и фигура != король
                // фигура может ходить только если может защитить короля или убить фигуру
                setAvailableToMove(canProtectKingWhenCheck(dotsForFigureMove));
            }
        }
    }, [move]);

    let canKingMove = (dotsForFigureMove) => {

        let dotsForEnemyMoves = [] 
           
        cells.forEach(c => {
            if (getFigureById(c.figure)?.color !== playerSide) {
                whereFigureCouldGo(getFigureById(c.figure), c).forEach(el => dotsForEnemyMoves.push(el))
            }
        })

        dotsForFigureMove = dotsForFigureMove.filter(el => !dotsForEnemyMoves.includes(el))
        // рокировки быть не может если король проходит битое поле
        if (!history.find(el => el.castling && el.figureColor === colors.WHITE || el.firstTap.figure === whiteKingId)) { 
            dotsForFigureMove = dotsForFigureMove
                .filter(el => dotsForEnemyMoves.includes('D1') ? el !== 'C1': el)
                .filter(el => dotsForEnemyMoves.includes('F1') ? el !== 'G1': el)
        }
        else if (!history.find(el => el.castling && el.figureColor === colors.BLACK || el.firstTap.figure === blackKingId)) {
            dotsForFigureMove = dotsForFigureMove
                .filter(el => dotsForEnemyMoves.includes('F8') ? el !== 'G8': el)
                .filter(el => dotsForEnemyMoves.includes('D8') ? el !== 'C8': el)
        }

        return dotsForFigureMove;
    }

    let canProtectKingWhenCheck = (dotsForFigureMove) => {
        let attackingPiece = history.at(-1)
        let dotsWhereAttackingPieceCanGo = whereFigureCouldGo(getFigureById(attackingPiece.firstTap.figure), attackingPiece.secondTap)

        const cellWithBlackKing = cells.find(c => c.figure === blackKingId)
        const cellWithWhiteKing = cells.find(c => c.figure === whiteKingId)

        let getCellById = (id) => cells.find(el => el.id === id)

        let cellsBetweenKingAndAttaking = dotsWhereAttackingPieceCanGo.filter(el => {
            let xOfAttackingFigure = attackingPiece.secondTap.x
            let yOfAttackingFigure = attackingPiece.secondTap.y

            let xOfKing = playerSide === 'black' ? cellWithBlackKing.x : cellWithWhiteKing.x
            let yOfKing = playerSide === 'black' ? cellWithBlackKing.y : cellWithWhiteKing.y

            let cell = getCellById(el)
            // todo debug
            return (
                cell.x <= xOfAttackingFigure && cell.x >= xOfKing && cell.y >= yOfAttackingFigure && cell.y <= yOfKing ||
                cell.x > xOfAttackingFigure && cell.x <= xOfKing && cell.y < yOfAttackingFigure && cell.y > yOfKing ||
                cell.x === xOfAttackingFigure && cell.x === xOfKing && cell.y < yOfAttackingFigure && cell.y > yOfKing || //конь
                cell.x < xOfAttackingFigure && cell.x > xOfKing && cell.y < yOfAttackingFigure && cell.y > yOfKing ||
                cell.x > xOfAttackingFigure && cell.x < xOfKing && cell.y > yOfAttackingFigure && cell.y < yOfKing
            )
        }) 
        
        return (
            dotsForFigureMove = dotsForFigureMove.filter(el => 
                cellsBetweenKingAndAttaking.includes(el) || //находится между королем и атакующей = может защитить короля
                attackingPiece.secondTap.id == el // может убить фигуру 
            ) 
        )
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

        if (figure || type) {
            return (
                figureTypes.find((it) => it.value === figure?.type || it.value === type)?.icon 
                + ' text-' + (figure?.color || color) +
                ((figure?.color === colors.WHITE || color === colors.WHITE) && shadow ? ' figureShadow' : '')
            );
        } 

        return false;
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

        if (isKing && dotOfShortCastling) {
            setFigureInCell(getFigureIdFromCell(move.firstTap?.x + 3, move.firstTap?.y), move.firstTap.x + 1, move.firstTap.y)
            return true;
        }
        else if (isKing && dotOfLongCastling) {
            setFigureInCell(getFigureIdFromCell(move.firstTap?.x - 4, move.firstTap?.y), move.firstTap.x - 1, move.firstTap.y)
            return true;
        }

        return false;
    }

    const whereFigureCouldGo = (figure, cell) => {
        let dots = [] 
        let figureDots = figureTypes.find(f => f.value === figure?.type)?.getDotsToMove(cell, figure.color)
        let enemyFigureColor = figure?.color === colors.WHITE ? colors.BLACK  : colors.WHITE 

        const pushCellsIdWhereFigureCanGo = (x, y, array) => {
            const otherFigure = getFigureById(getFigureIdFromCell(x, y))

            if (otherFigure) {
                if(!check.isCheck) {
                    if (otherFigure.color === enemyFigureColor) {
                        array.push(getCellId(x, y));
                    }
                    return true;
                }
                else if (check.isCheck) {
                    if(figure.color == playerSide && otherFigure.color == playerSide) 
                        return true;    
                    else if (otherFigure.color !== playerSide) {
                        array.push(getCellId(x, y));
                        return true; 
                    }
                }
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
                        !check.isCheck && 
                        pushCellsIdWhereFigureCanGo(el.data.x, el.data.y, dots);
                    }
                    
                    if (el.action === moveActions.LONG_CASTLING) {
                        const wasLeftRookMoved = history.find(h => 
                            getCellId(h.firstTap.x, h.firstTap.y) === getCellId(el.data.x - 2, el.data.y)) //A1, A8
                        
                        !wasKingMoved && 
                        !wasLeftRookMoved && 
                        !isCellContainsFigure(el.data.x + 1, el.data.y) &&
                        !isCellContainsFigure(el.data.x - 1, el.data.y) &&
                        !check.isCheck && 
                        pushCellsIdWhereFigureCanGo(el.data.x, el.data.y, dots);   
                    }   
                }  
            }

            else if (figureDots.action === moveActions.PAWN_ACTIONS) {
                const {x, y} = el.data
                const isCellContainsFigure = (x, y) => getCell(x, y)?.figure

                const isActionPawnMove = el.action === moveActions.PAWN_MOVE
                if (isActionPawnMove && !isCellContainsFigure(x, y)) {
                    if(check.isCheck && figure.color === playerSide)
                        pushCellsIdWhereFigureCanGo(x, y, dots)
                    else if (!check.isCheck)
                        pushCellsIdWhereFigureCanGo(x, y, dots)
                }

                const isPawnInitialPosition = (cell.y === 6 || cell.y === 1)
                const isActionPawnMoveTwo = el.action === moveActions.PAWN_MOVE_TWO_CELLS

                if ( 
                    isActionPawnMoveTwo && 
                    isPawnInitialPosition && 
                    !isCellContainsFigure(x, y + (figure.color === colors.BLACK ? 1 : -1)) &&
                    !isCellContainsFigure(x, y)
                ) 
                    pushCellsIdWhereFigureCanGo(x, y, dots)

                const isEnemyFigureColor = getFigureByXY(x, y)?.color === (figure.color === colors.BLACK ? colors.WHITE : colors.BLACK)
                const isActionPawnKillLeft = el.action === moveActions.PAWN_KILL_LEFT 
                const isActionPawnKillRight = el.action === moveActions.PAWN_KILL_RIGHT

                if(isEnemyFigureColor){
                    if (isActionPawnKillLeft)      
                        pushCellsIdWhereFigureCanGo(x, y, dots)        
                
                    if (isActionPawnKillRight) 
                        pushCellsIdWhereFigureCanGo(x, y, dots)
                } 
                else if (check.isCheck && figure.color !== playerSide){
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

    const changePawnType = (newPawnType, color) => {
        let id = Math.random() + 100
        setFigures(prev => [...prev, {color, type: newPawnType, id}])

        setFigureInCell(id, modalWindow.figX, modalWindow.figY)
        setModalWindow({isOpened: false})

    }
    
    let restartGame = () => {
        setDefaultFigurePosition(arrDefaultFigurePosition);
        setMatchNumber(Math.floor(Math.random() * 10000000));
        setFigures(figuresInitialState)
        setCheckmate(false)
        setCheck({isCheck: false})
        setHistory([])
        setPlayerSide(colors.WHITE)
        setResetTimer(true)
        setDraw(false)
    }

    const themeColor = theme === 'light' ? 'bg-brown' : 'bg-blue'
    return (
        <div className='row m-0 mw-100 p-2 px-4 noselect'>
            {
                modalWindow.isOpened && 
                <ChangePawnTypeModal 
                    getFigureClasses={getFigureClasses} 
                    candidates={[pieces.KNIGHT, pieces.BISHOP, pieces.ROOK, pieces.QUEEN]} 
                    changePawnType={changePawnType}
                    color={modalWindow.color}
                />
            }

            <div className='col-lg-3 col-sm-12 p-2 pb-0'>
                <div className={'opacity-75 p-3 text-light ' + themeColor}>
                    <div>{'Матч'}</div>
                    <div>{matchNumber}</div>
                </div>
                <div className='pt-4'>
                    <div 
                        className={'py-3 opacity-75 cursor ' + themeColor}
                        onClick={changeTheme}
                    >
                        {'Сменить тему'}
                    </div>
                </div>
                
                <div className='pt-2 text-white fw-bold'>
                    <div className={'opacity-0' + ((isCheckmate || isDraw)  && ' p-4 opacity-100 animated bg-gold')}>
                            {
                                isCheckmate &&
                                <>
                                    <div>{'Шах и мат!'}</div>
                                    <div>{'Победили черные!'}</div>
                                    <div onClick={()=> restartGame()} className='cursor pt-3'>
                                        <span className=' p-2 bg-green rounded-3'>
                                            <i class="fa-solid fa-rotate-right pe-2"/>
                                            {'Начать игру сначала'}
                                        </span>
                                    </div>
                                </>
                            }
                            {
                                isDraw && 
                                <>
                                    <div>{'Результат'}</div>
                                    <div>{'Ничья'}</div>
                                    <div>{'Недостаточность материала'}</div>
                                    <div onClick={()=> restartGame()} className='cursor pt-3'>
                                        <span className=' p-2 bg-green rounded-3'>
                                            <i class="fa-solid fa-rotate-right pe-2"/>
                                            {'Начать игру сначала'}
                                        </span>
                                    </div>
                                </>
                            }
                    </div> 
                    {
                        !isCheckmate && 
                        <div className={'opacity-0 animated p-4 ' + (check.isCheck && !isCheckmate && ' opacity-100 animated bg-red')}>
                            { 'Шах!'}
                        </div>
                    }
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
                    isCheckmate={isCheckmate}
                    isDraw={isDraw}
                />  
            </div>

            <div className='col-lg-3 col-sm-12 p-2'>

                <PlayerTurn 
                    history={history} 
                    getFigureClasses={getFigureClasses} 
                    isPlayerTurn={playerSide === colors.BLACK}  
                    side={colors.BLACK} 
                    isCheckmate={isCheckmate}
                    resetTimer={resetTimer}
                    isDraw={isDraw}
                />
            
                <HistoryBoard 
                    history={history} 
                    getFigureClasses={getFigureClasses}
                    themeColor={themeColor}
                />

                <div className='pb-1'>
                    <div className={themeColor}>
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
                    isCheckmate={isCheckmate}
                    resetTimer={resetTimer}
                    isDraw={isDraw}
                />

            </div>
        </div>
    );
}