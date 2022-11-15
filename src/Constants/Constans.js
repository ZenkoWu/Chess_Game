export const maxBoardWidth = 8;
export const maxBoardHeight = 8;
const letterACodeInASCII = 65;
export const numbersAxis = Array.from( { length: maxBoardHeight },(_, i) => maxBoardHeight - i);
export const lettersAxis = Array.from({ length: maxBoardWidth }, (_, i) =>String.fromCharCode(i + letterACodeInASCII));
export const arrDefaultFigurePosition = [
  { start: 0, xOffsetBetweenFigures: 1, type: 'pawn', color: 'black', y: 6 },
  { start: 0, xOffsetBetweenFigures: 1, type: 'pawn', color: 'white', y: 1 },
  { start: 4, xOffsetBetweenFigures: 4, type: 'king', color: 'black', y: 7 },
  { start: 4, xOffsetBetweenFigures: 4, type: 'king', color: 'white', y: 0 },
  { start: 3, xOffsetBetweenFigures: 5, type: 'queen', color: 'black', y: 7 },
  { start: 3, xOffsetBetweenFigures: 5, type: 'queen', color: 'white', y: 0 },
  { start: 1, xOffsetBetweenFigures: 5, type: 'knight', color: 'black', y: 7 }, 
  { start: 1, xOffsetBetweenFigures: 5, type: 'knight', color: 'white', y: 0 },
  { start: 2, xOffsetBetweenFigures: 3, type: 'bishop', color: 'black', y: 7 },
  { start: 2, xOffsetBetweenFigures: 3,  type: 'bishop', color: 'white', y: 0 },
  { start: 0, xOffsetBetweenFigures: 7, type: 'rook', color: 'black', y: 7 },
  { start: 0, xOffsetBetweenFigures: 7, type: 'rook', color: 'white', y: 0 },
];


let a = (x, y) => {
  return  Array.from({length: maxBoardHeight}, (_, i) => ({x: x + i, y: y + i }) )
}

export const figureTypes = ['king', 'bishop', 'rook', 'queen', 'knight', 'pawn'].map(
  (value) => ({
    value,
    icon: 'fa-solid fa-chess-' + value,
    getDotsToMove: (cell, color) => ( {
      'king': [
        {x: cell.x + 1, y: cell.y},
        {x: cell.x - 1, y: cell.y},
        {x: cell.x, y: cell.y + 1},
        {x: cell.x, y: cell.y - 1},
        {x: cell.x + 1, y: cell.y + 1},
        {x: cell.x + 1, y: cell.y - 1},
        {x: cell.x - 1, y: cell.y - 1},
        {x: cell.x - 1, y: cell.y + 1},
      ],
      'bishop': [
        // a(cell.x + i + 1, ), 
        Array.from({length: maxBoardHeight}, (_, i) => ({x: cell.x + i + 1, y: cell.y + i + 1}) ), 
        Array.from({length: maxBoardHeight}, (_, i) => ({x: cell.x - i - 1, y: cell.y - i - 1}) ), 
        Array.from({length: maxBoardHeight}, (_, i) => ({x: cell.x - i - 1, y: cell.y + i + 1}) ), 
        Array.from({length: maxBoardHeight}, (_, i) => ({x: cell.x + i + 1, y: cell.y - i - 1}) ), 
      ],
      'rook' : [
        Array.from( { length: maxBoardHeight },(_, i) => ({x: cell.x, y: cell.y + i + 1,}) ),
        Array.from( { length: maxBoardHeight },(_, i) => ({x: cell.x, y: cell.y - i - 1,}) ),
        Array.from( { length: maxBoardWidth },(_, i) => ({x: cell.x + i + 1, y: cell.y}) ),
        Array.from( { length: maxBoardWidth },(_, i) => ({x: cell.x - i - 1 , y: cell.y}) ),
      ],
      'queen' : [
        Array.from( {length: maxBoardHeight },(_, i) => ({x: cell.x, y: cell.y + i + 1,}) ),
        Array.from( {length: maxBoardHeight },(_, i) => ({x: cell.x, y: cell.y - i - 1,}) ),
        Array.from( {length: maxBoardWidth },(_, i) => ({x: cell.x + i + 1, y: cell.y}) ),
        Array.from( {length: maxBoardWidth },(_, i) => ({x: cell.x - i - 1 , y: cell.y}) ),
        Array.from( {length: maxBoardHeight}, (_, i) => ({x: cell.x + i + 1, y: cell.y + i + 1}) ), 
        Array.from( {length: maxBoardHeight}, (_, i) => ({x: cell.x - i - 1, y: cell.y - i - 1}) ), 
        Array.from( {length: maxBoardHeight}, (_, i) => ({x: cell.x - i - 1, y: cell.y + i + 1}) ), 
        Array.from( {length: maxBoardHeight}, (_, i) => ({x: cell.x + i + 1, y: cell.y - i - 1}) ), 
      ],
      'knight' : [
        {x: cell.x + 1, y: cell.y + 2},
        {x: cell.x + 1, y: cell.y - 2},
        {x: cell.x - 1, y: cell.y + 2},
        {x: cell.x - 1, y: cell.y - 2},
        {x: cell.x + 2, y: cell.y + 1},
        {x: cell.x + 2, y: cell.y - 1},
        {x: cell.x - 2, y: cell.y + 1},
        {x: cell.x - 2, y: cell.y - 1},
      ],
      'pawn': [cell.x, cell.y + (color === 'black' ? -1 : 1) ]
    })[value]
  })
);
//  FT FILE 