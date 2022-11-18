import { maxBoardHeight} from './constans';
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

export const figureTypes = [pieces.KING, pieces.BISHOP, pieces.ROOK, pieces.QUEEN, pieces.KNIGHT, pieces.PAWN].map(
    (value) => ({
        value,
        icon: 'fa-solid fa-chess-' + value,
        getDotsToMove: (cell, color) => {
            const {x, y} = cell

            let getArrayOfDots = (appendX, appendY) => Array.from({length: maxBoardHeight}, (_, i) => 
            ({x: x + appendX(i), y: y + appendY(i)}))
            
            return ({
                [pieces.KING]: {
                    action: moveActions.MOVE_FOR_KNIGHT,
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
                    ],
                },

                [pieces.PAWN]: {  
                    data: [
                        {
                            action: moveActions.PAWN_MOVE,
                            x: x, 
                            y: y + (color === colors.BLACK ? -1 : 1)
                        },
                        { 
                            action: moveActions.PAWN_MOVE_TWO_CELLS, 
                            x: x, 
                            y: y + (color === colors.BLACK ? -2 : 2)
                        },
                        {
                            action: moveActions.PAWN_KILL_RIGHT, 
                            x: x + 1, 
                            y: y + (color === colors.BLACK ? -1 : 1)
                        },
                        {
                            action: moveActions.PAWN_KILL_LEFT, 
                            x: x - 1, 
                            y: y + (color === colors.BLACK ? -1 : 1)
                        },
                    ]
                }
            })[value]
        }
    })
);

