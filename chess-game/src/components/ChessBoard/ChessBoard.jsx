import React, { useEffect, useState } from 'react'

export default function ChessBoard() {
  // const [board, setBoard] = useState(
  //   [
  //     {id: 'A8', figure: 'rookBlack'},
  //     {id: 'B8', figure: 'knightBlack'},
  //     {id: 'C8', figure: 'bishopBlack'},
  //     {id: 'D8', figure: 'queenBlack'},
  //     {id: 'E8', figure: 'kingBlack'},
  //     {id: 'F8', figure: 'bishopBlack'},
  //     {id: 'G8', figure: 'knightBlack'},
  //     {id: 'H8', figure: 'rookBlack'},
  //     {id: 'A7', figure: 'pawnBlack'},
  //     {id: 'B7', figure: 'pawnBlack'},
  //     {id: 'C7', figure: 'pawnBlack'},
  //     {id: 'D7', figure: 'pawnBlack'},
  //     {id: 'E7', figure: 'pawnBlack'},
  //     {id: 'F7', figure: 'pawnBlack'},
  //     {id: 'G7', figure: 'pawnBlack'},
  //     {id: 'H7', figure: 'pawnBlack'},
  //     {id: 'A6',},
  //     {id: 'B6',},
  //     {id: 'C6',},
  //     {id: 'D6',},
  //     {id: 'E6',},
  //     {id: 'F6',},
  //     {id: 'G6',},
  //     {id: 'H6',},
  //     {id: 'A5',},
  //     {id: 'B5',},
  //     {id: 'C5',},
  //     {id: 'D5',},
  //     {id: 'E5',},
  //     {id: 'F5',},
  //     {id: 'G5',},
  //     {id: 'H5',},
  //     {id: 'A4',},
  //     {id: 'B4',},
  //     {id: 'C4',},
  //     {id: 'D4',},
  //     {id: 'E4',},
  //     {id: 'F4',},
  //     {id: 'G4',},
  //     {id: 'H4',},
  //     {id: 'A3',},
  //     {id: 'B3',},
  //     {id: 'C3',},
  //     {id: 'D3',},
  //     {id: 'E3',},
  //     {id: 'F3',},
  //     {id: 'G3',},
  //     {id: 'H3',},
  //     {id: 'A2', figure: 'pawnWhite'},
  //     {id: 'B2', figure: 'pawnWhite'},
  //     {id: 'C2', figure: 'pawnWhite'},
  //     {id: 'D2', figure: 'pawnWhite'},
  //     {id: 'E2', figure: 'pawnWhite'},
  //     {id: 'F2', figure: 'pawnWhite'},
  //     {id: 'G2', figure: 'pawnWhite'},
  //     {id: 'H2', figure: 'pawnWhite'},
  //     {id: 'A1', figure: 'rookWhite'},
  //     {id: 'B1', figure: 'knightWhite'},
  //     {id: 'C1', figure: 'bishopWhite'},
  //     {id: 'D1', figure: 'queenWhite'},
  //     {id: 'E1', figure: 'kingWhite'},
  //     {id: 'F1', figure: 'bishopWhite'},
  //     {id: 'G1', figure: 'knightWhite'},
  //     {id: 'H1', figure: 'rookWhite'},

  //   ]
  // )
   


  
//  function defaultPawnInit (y, color) {
//   for (let i = 0; i < maxBoardWidth; i++) {
//     setFigureInCell(figures.find(f => f.type == 'pawn' && f.color == color), i, y)
//   }
//  }

// function defaultKnightInit (y, color) {
//   for (let i = 1; i < maxBoardWidth; i+=5) {
//     setFigureInCell(figures.find(f => f.type == 'knight' && f.color == color), i, y)
//   }
// }
 
// function defaultBishopInit (y, color) {
//   for (let i = 2; i <maxBoardWidth; i+=3) {
//     setFigureInCell(figures.find(f => f.type == 'bishop' && f.color === color), i, y)
//   }
// }

// function defaultRookInit (y, color) {
//   for (let i = 0; i <maxBoardWidth; i+=7) {
//     setFigureInCell(figures.find(f => f.type == 'rook' && f.color === color), i, y)
//   }
// }

// function defaultKingInit (y, color) {
//   for (let i = 4; i < maxBoardWidth; i+=4) {
//     setFigureInCell(figures.find(f => f.type == 'king' && f.color === color), i, y)
//   }
// }

// function defaultQueenInit (y, color) {
//   for (let i = 3; i < maxBoardWidth; i+=5) {
//     setFigureInCell(figures.find(f => f.type == 'queen' && f.color === color), i, y)
//   }
// }



const maxBoardWidth = 8
const maxBoardHeight = 8 
const letterACodeInASCII = 65

let numbersAxis = Array.from({length: maxBoardHeight}, (el, i) => maxBoardHeight  - i)
let lettersAxis = Array.from({length: maxBoardWidth}, (el, i) =>  String.fromCharCode(i + letterACodeInASCII))
  
const figureTypes = 
['king', 'queen', 'knight', 'bishop', 'rook', 'pawn'].map(value => ({value, icon: 'fa-solid fa-chess-' + value}))

const [figures, setFigures] = useState(Array.from({length: 32}, (el, i) => (
    {  
      id: i,
      color: i < 16  ? 'black': 'white',
      type: ('rook ' + 'knight ' + 'bishop '  + 'queen ' + 'king ' + 'bishop ' + 'knight ' + 'rook ' + 'pawn '.repeat(8)).split(' ')[i % (maxBoardWidth * 2)], 
     }
  )
)) 

const [cells, setCells] = useState(Array.from({length: maxBoardWidth * maxBoardHeight}, (el, i) => (
  {
    id: lettersAxis[i % maxBoardWidth] + numbersAxis[Math.floor(i / maxBoardHeight) % maxBoardHeight ],
    figure: null,
    x:  i % maxBoardWidth,
    y: (maxBoardHeight - 1) - Math.floor(i / maxBoardHeight) % maxBoardHeight
  }
  )
))


function setFigureInCell(fig, x, y) {
  setCells((prev) => 
    prev.map(el => (
       {...el, figure: el.x == x && el.y == y ? fig : el.figure}
    ))
  )
 }

// function defaultFigurePosition(start, step, type, color, y ) {
//   for (let i = start; i < maxBoardWidth; i += step) {
//     setFigureInCell(figures.find(f => f.type == type && f.color == color), i, y)
//   }
// }

let arrDefaultFigurePosition = [
   {start: 0, xOffsetBetweenFigures: 1, type: 'pawn', color: 'black', y: 6},
   {start: 0, xOffsetBetweenFigures: 1, type: 'pawn', color: 'white', y: 1},
   {start: 4, xOffsetBetweenFigures: 4, type: 'king', color: 'black', y: 7},
   {start: 4, xOffsetBetweenFigures: 4, type: 'king', color: 'white', y: 0},
   {start: 3, xOffsetBetweenFigures: 5, type: 'queen', color: 'black', y: 7},
   {start: 3, xOffsetBetweenFigures: 5, type: 'queen', color: 'white', y: 0},
   {start: 1, xOffsetBetweenFigures: 5, type: 'knight', color: 'black', y: 7},
   {start: 1, xOffsetBetweenFigures: 5, type: 'knight', color: 'white', y: 0},
   {start: 2, xOffsetBetweenFigures: 3, type: 'bishop', color: 'black', y: 7},
   {start: 2, xOffsetBetweenFigures: 3, type: 'bishop', color: 'white', y: 0},
   {start: 0, xOffsetBetweenFigures: 7, type: 'rook', color: 'black', y: 7},
   {start: 0, xOffsetBetweenFigures: 7, type: 'rook', color: 'white', y: 0},
]

function setDefaultFigurePosition(arr) {
  let arrayOfFoundElements = []
  let foundFigure;
  arr.forEach(el=> {
  for (let i = el.start; i < maxBoardWidth; i += el.xOffsetBetweenFigures) {
    foundFigure = figures.find(f => f.type == el.type && f.color == el.color && !arrayOfFoundElements.includes(f))
    arrayOfFoundElements.push(foundFigure)
    setFigureInCell(foundFigure, i, el.y)
  }
});
}


useEffect(() => {
  setDefaultFigurePosition(arrDefaultFigurePosition)
  // defaultFigurePosition(0, 1, 'pawn', 'black', 6)
  // defaultFigurePosition(0, 1, 'pawn', 'white', 1)
  // defaultFigurePosition(4, 4, 'king', 'black', 7)
  // defaultFigurePosition(4, 4, 'king', 'white', 0)
  // defaultFigurePosition(3, 5, 'queen', 'black', 7)
  // defaultFigurePosition(3, 5, 'queen', 'white', 0)
  // defaultFigurePosition(1, 5, 'knight', 'black', 7)
  // defaultFigurePosition(1, 5, 'knight', 'white', 0)
  // defaultFigurePosition(2, 3, 'bishop', 'black', 7)
  // defaultFigurePosition(2, 3, 'bishop', 'white', 0)
  // defaultFigurePosition(0, 7, 'rook', 'black', 7)
  // defaultFigurePosition(0, 7, 'rook', 'white', 0)
  }, [])

  console.log(figures)
console.log(cells)

let getFigureIcon = (arr, el) => arr.find(it => it.value == el.figure.type).icon

  return (
    <div
      style={{ width: '550px', backgroundColor: '#fede97' }}
      className='m-auto'
    >
      <div className='d-flex px-3 w-100'>
        {lettersAxis.map((item, i) =>
          <div key={i} className='px-4 m-auto fw-bold'>{item}</div>
        )}
      </div>
      <div className='d-flex justify-content-center flex-wrap m-auto position-relative'>
        <div
          className='px-1 w-100 h-100 d-flex position-absolute 
          flex-column justify-content-around align-items-start'
        >
          {numbersAxis.map((item, i) =>
            <div key={i} className='py-3 fw-bold'>{item}</div>
          )}
        </div>
        <div
          className='px-1 w-100 h-100 d-flex position-absolute 
          flex-column justify-content-around align-items-end'
        >
          {numbersAxis.map((item, i) =>
            <div key={i} className='py-3 fw-bold'>{item}</div>
          )}
        </div>
        {/* строка - дублирование кода, за исключением align-items-*, как фиксить */}
        {
          cells.map((cell, i) => (
            <div key={cell.id}>
              <div
                className={`bg-${
                  // cell.x % 2 == 0 && cell.y % 2 == 0 || cell.x % 2 !== 0 && cell.y % 2 !== 0 ? 'lighter' : 'brown'
                  Math.floor(i / maxBoardWidth) % 2 == 0 && i % 2 == 0 || Math.floor(i / maxBoardWidth) % 2 !== 0 && i % 2 !== 0 ?
                    'lighter' : 'brown'
                  } opacity-75 d-flex justify-content-center align-items-center`
                }
                style={{ width: "4rem", height: "4rem" }}
              >
                {/* {cell.id} */}
                {cell.figure ?            
                  <div 
                    className ={`${getFigureIcon(figureTypes, cell)} fs-1 text-${cell.figure.color}`}
                    // className ={`${figureTypes.find(it => it.value == cell.figure.type).icon} fs-1 text-${cell.figure.color}`}
                  >
                    <div className='fs-5'>
                      {cell.figure.id}
                    </div>
                  </div>
                : cell.id}  
              </div>
            </div>
          ))
        }
      </div>
      <div className='d-flex px-3 w-100'>
        {lettersAxis.map((item, i) =>
          <div key={i} className='px-4 m-auto fw-bold'>{item}</div>
        )}
      </div>
    </div>
  )
}

