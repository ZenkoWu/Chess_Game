import { maxBoardHeight} from './constans';
import { moveActions } from './moveActions';

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

export const figureTypes = ['king', 'bishop', 'rook', 'queen', 'knight', 'pawn'].map(
    (value) => ({
        value,
        icon: 'fa-solid fa-chess-' + value,
        getDotsToMove: (cell, color) => { // ??? cell x y destructure
            
            let getArrayOfDots = (appendX, appendY) => Array.from({length: maxBoardHeight}, (_, i) => 
            ({x: cell.x + appendX(i), y: cell.y + appendY(i)}))
            
            return ({
                'king': {
                    action: moveActions.COULD_BE_INTERRUPTED,
                    data: [
                        {x: cell.x + 1, y: cell.y},
                        {x: cell.x - 1, y: cell.y},
                        {x: cell.x, y: cell.y + 1},
                        {x: cell.x, y: cell.y - 1},
                        {x: cell.x + 1, y: cell.y + 1},
                        {x: cell.x + 1, y: cell.y - 1},
                        {x: cell.x - 1, y: cell.y - 1},
                        {x: cell.x - 1, y: cell.y + 1},
                    ]
                },
                'bishop': {
                    action: moveActions.COULD_BE_INTERRUPTED,
                    data: [...getBishopDotsToMove(getArrayOfDots)] // ??? destructure
                },
                'rook': {
                    action: moveActions.COULD_BE_INTERRUPTED,
                    data: [
                        ...getRookDotsToMove(getArrayOfDots), // ??? destructure
                    ], 
                }, 
                'queen': {
                    action: moveActions.COULD_BE_INTERRUPTED,
                    data: [
                        ...getBishopDotsToMove(getArrayOfDots),
                        ...getRookDotsToMove(getArrayOfDots),
                    ],
                },
                
                'knight' : {
                    action: moveActions.MOVE_FOR_KNIGHT,
                    data: [
                        {x: cell.x + 1, y: cell.y + 2},
                        {x: cell.x + 1, y: cell.y - 2},
                        {x: cell.x - 1, y: cell.y + 2},
                        {x: cell.x - 1, y: cell.y - 2},
                        {x: cell.x + 2, y: cell.y + 1},
                        {x: cell.x + 2, y: cell.y - 1},
                        {x: cell.x - 2, y: cell.y + 1},
                        {x: cell.x - 2, y: cell.y - 1},
                    ],
                },

                'pawn': {
                    // ??? action moveActions.MULTI_ACTIONS
                    data: [
                        {
                            action: moveActions.PAWN_MOVE,
                            // ??? data: {x, y}
                            x: cell.x,
                            y: cell.y + (color === 'black' ? -1 : 1)
                        },
                        {
                            action: moveActions.PAWN_MOVE_TWO_CELLS,
                            x: cell.x,
                            y: cell.y + (color === 'black' ? -2 : 2)
                        },
                        {
                            action: moveActions.PAWN_KILL_RIGHT,
                            x: cell.x + 1,
                            y: cell.y + (color === 'black' ? -1 : 1)
                        },
                        {
                            action: moveActions.PAWN_KILL_LEFT,
                            x: cell.x - 1,
                            y: cell.y + (color === 'black' ? -1 : 1)
                        },
                    ]
                }
            })[value]
        }
    })
);