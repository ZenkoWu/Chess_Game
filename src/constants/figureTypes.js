import { maxBoardHeight, maxBoardWidth} from './constans';
import { moveActions } from './moveActions';

export const pieces = {
    KING: 'king',
    BISHOP: 'bishop',
    QUEEN: 'queen',
    ROOK: 'rook',
    KNIGHT: 'knight', 
    PAWN: 'pawn'
}

export const colors = {
    BLACK: 'black',
    WHITE: 'white'
}

const getRookDotsToMove = func => [
    func(i => 0, i => i + 1 ), 
    func(i => 0, i => -i - 1 ), 
    func(i => i + 1, i => 0 ), 
    func(i => -i - 1, i => 0 ),
  ]

const getBishopDotsToMove = func => [
    func(i => i + 1, i => i + 1 ), 
    func(i => -i - 1, i => -i - 1 ), 
    func(i => -i - 1, i => i + 1 ), 
    func(i => i + 1, i => -i - 1 ),
]



const limitDotsCountToMove = (action, arr) => {
    let filterConditions = (x, y) => (x >= 0 && x < maxBoardWidth) && (y >= 0 && y < maxBoardHeight)

    if(action === moveActions.MOVE_FOR_KNIGHT)
        return arr.filter(el => filterConditions(el.x, el.y))
        
    else if(action === moveActions.MULTI_ACTION)
        return arr.filter(el => filterConditions(el.data.x, el.data.y))
    
    else if(action === moveActions.COULD_BE_INTERRUPTED)
        return arr.map(el => el.filter(el => filterConditions(el.x, el.y)))

    return arr;
}

export const figureTypes = [pieces.KING, pieces.BISHOP, pieces.ROOK, pieces.QUEEN, pieces.KNIGHT, pieces.PAWN].map(
    (value) => ({
        value,
        icon: 'fa-solid fa-chess-' + value,
        getDotsToMove: (cell, color) => {
            const {x, y} = cell

            let getArrayOfDots = (appendX, appendY) => Array.from({length: maxBoardHeight}, (_, i) => (
                {x: x + appendX(i), y: y + appendY(i)}
            ))
            
            let dotsToMove = {
                [pieces.KING]: {
                    action: moveActions.KING_ACTIONS,
                    data: [
                        {
                            action: moveActions.MOVE_FOR_KING,
                            data: [
                                {x: x + 1, y: y},
                                {x: x - 1, y: y},
                                {x: x, y: y + 1},
                                {x: x, y: y - 1},
                                {x: x + 1, y: y + 1},
                                {x: x + 1, y: y - 1},
                                {x: x - 1, y: y - 1},
                                {x: x - 1, y: y + 1},
                            ]
                        },
                        {
                            action: moveActions.SHORT_CASTLING,
                            data: {x: x + 2, y: y}
                        },
                        {
                            action: moveActions.LONG_CASTLING,
                            data: {x: x - 2, y: y}
                        }
                    ]
                    
                },

                [pieces.BISHOP]: {
                    action: moveActions.COULD_BE_INTERRUPTED,
                    data: getBishopDotsToMove(getArrayOfDots)
                },

                [pieces.ROOK]: {
                    action: moveActions.COULD_BE_INTERRUPTED,
                    data: getRookDotsToMove(getArrayOfDots),
                }, 

                [pieces.QUEEN]: {
                    action: moveActions.COULD_BE_INTERRUPTED,
                    data: [
                        ...getBishopDotsToMove(getArrayOfDots),
                        ...getRookDotsToMove(getArrayOfDots),
                    ],
                },
                
                [pieces.KNIGHT]: {
                    action: moveActions.MOVE_FOR_KNIGHT,
                    data: [
                        {x: x + 1, y: y + 2},
                        {x: x + 1, y: y - 2},
                        {x: x - 1, y: y + 2},
                        {x: x - 1, y: y - 2},
                        {x: x + 2, y: y + 1},
                        {x: x + 2, y: y - 1},
                        {x: x - 2, y: y + 1},
                        {x: x - 2, y: y - 1},
                    ]
                },

                [pieces.PAWN]: {
                    action: moveActions.PAWN_ACTIONS,  
                    data: [
                        {
                            action: moveActions.PAWN_MOVE,
                            data: {
                                x: x, 
                                y: y + (color === colors.BLACK ? -1 : 1)
                            }
                            
                        },
                        { 
                            action: moveActions.PAWN_MOVE_TWO_CELLS, 
                            data: {
                                x: x, 
                                y: y + (color === colors.BLACK ? -2 : 2)
                            }
                        },
                        {
                            action: moveActions.PAWN_KILL_RIGHT, 
                            data: {
                                x: x + 1, 
                                y: y + (color === colors.BLACK ? -1 : 1)
                            }
                        },
                        {
                            action: moveActions.PAWN_KILL_LEFT, 
                            data: {
                                x: x - 1, 
                                y: y + (color === colors.BLACK ? -1 : 1)
                            }
                        },
                    ]
                }
            }
           
             Object.keys(dotsToMove).forEach(k => 
                dotsToMove[k].data = limitDotsCountToMove(dotsToMove[k]?.action, dotsToMove[k]?.data)
            )

            return dotsToMove[value]
        }
    })
);

