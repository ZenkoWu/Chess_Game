import React, { useEffect, useState } from 'react'

export default function ChessBoard() {

const maxBoardWidth = 8
const maxBoardHeight = 8 
const letterACodeInASCII = 65
 
let numbersAxis = Array.from({length: maxBoardHeight}, (el, i) => maxBoardHeight  - i)
let lettersAxis = Array.from({length: maxBoardWidth}, (el, i) =>  String.fromCharCode(i + letterACodeInASCII))
  
const figureTypes = 
['king', 'queen', 'knight', 'bishop', 'rook', 'pawn'].map(value => ({value, icon: 'fa-solid fa-chess-' + value}))

const [figures, setFigures] = useState(Array.from({length: 32}, (el, i) => (
    {  
      id: i + 1,
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


function setFigureInCell(figId, x, y) {
  setCells((prev) => 
    prev.map(el => (
       {...el, figure: el.x == x && el.y == y ? figId : el.figure}
    ))
  )
 }

function setDefaultFigurePosition(arr) {
  let arrayOfFoundElementsId = []
  let foundFigureId;
  arr.forEach(el=> {
  for (let i = el.start; i < maxBoardWidth; i += el.xOffsetBetweenFigures) {
    foundFigureId = figures.find(f => f.type == el.type && f.color == el.color && !arrayOfFoundElementsId.includes(f.id)).id
    arrayOfFoundElementsId.push(foundFigureId)
    setFigureInCell(foundFigureId, i, el.y)
  }
});
}

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


useEffect(() => {
  setDefaultFigurePosition(arrDefaultFigurePosition)
  }, [])

// console.log(figures)
// console.log(cells)


let getFigure = (id) => figures.find(el => el.id == id)

let renderFigure = (id) => {
let figure = getFigure(id)
  if (figure) {
    return figureTypes.find(it => it.value == figure.type).icon + ' text-' + figure.color 
  }
  }

  let currentSide = (id) => {
    let figure = getFigure(id)
    console.log(figure)
    return (figure?.color  == 'white' ? 'activeSide' : null) 
  }

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
        {['start', 'end'].map(pos =>
          <div
            className={`px-1 w-100 h-100 d-flex position-absolute 
            flex-column justify-content-around align-items-${pos}`}
          >
            {numbersAxis.map((item, i) =>
              <div key={i} className='py-3 fw-bold'>{item}</div>
            )}
          </div>
        )}
        {
          cells.map((cell, i) => (
            <div
              key={cell.id}
              className={`bg-${cell.x % 2 == 0 && cell.y % 2 == 0 || cell.x % 2 !== 0 && cell.y % 2 !== 0 ? 'lighter' : 'brown'} 
              ${currentSide(cell.figure)} opacity-75 d-flex justify-content-center align-items-center`
              }
              style={{ width: "4rem", height: "4rem" }}
            >
              {cell.figure ?            
                <div 
                  className = {`${renderFigure(cell.figure)} fs-1`}
                >
                  <div className='fs-5'>{cell.figure}</div>
                </div>
              : cell.id}  
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

