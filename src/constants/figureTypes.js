import { maxBoardHeight} from "./constans";

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
      getDotsToMove: (cell, color) => {
        
        let getArrayOfDots = (appendX, appendY) => Array.from({length: maxBoardHeight}, (_, i) => 
        ({x: cell.x + appendX(i), y: cell.y + appendY(i)}))
          
        return ({
          'king': 
            {
              action: '',
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
            }
          ,
          'bishop': 
            {
              action: '',
              data: [...getBishopDotsToMove(getArrayOfDots)]
            }
          ,

          'rook' : 
            {
              action: 'c',
              data: [
                ...getRookDotsToMove(getArrayOfDots),
              ], 
            }
          , 
          
          'queen' : 
            {
              action: '',
              data: [
                ...getBishopDotsToMove(getArrayOfDots),
                ...getRookDotsToMove(getArrayOfDots),
              ],
            }
          ,
          
          'knight' : {
              action: 'k',
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
            }
          ,
          
          'pawn': {  
            data: [
              {
                action: 'go',
                x: cell.x, 
                y: cell.y + (color === 'black' ? -1 : 1)
              },
              { 
                action: 'go2', 
                x: cell.x, 
                y: cell.y + (color === 'black' ? -2 : 2)
              },
              {
                action: 'killR', 
                x: cell.x + 1, 
                y: cell.y + (color === 'black' ? -1 : 1)
              },
              {
                action: 'killL', 
                x: cell.x - 1, 
                y: cell.y + (color === 'black' ? -1 : 1)
              },
            ]
          }
        })[value]
    }
    })
  );