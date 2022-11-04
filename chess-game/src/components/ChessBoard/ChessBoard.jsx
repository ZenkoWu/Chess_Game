import React, { useEffect, useState } from 'react'


export default function ChessBoard() {

const maxBoardWidth = 8
const maxBoardHeight = 8 
const letterACodeInASCII = 65
 
let numbersAxis = Array.from({length: maxBoardHeight}, (el, i) => maxBoardHeight  - i)
let lettersAxis = Array.from({length: maxBoardWidth}, (el, i) =>  String.fromCharCode(i + letterACodeInASCII))
  
const figureTypes = 
['king', 'queen', 'knight', 'bishop', 'rook', 'pawn'].map(value => (
  {
    value,
    icon: 'fa-solid fa-chess-' + value, 
    // whereFigureCanGo: () => {} 
  }
  ))

  // let whereFigureCanGo = [
  //   {type:'pawn', x: '', y: 1 || 2, color: ''}
  // ]

const [figures, setFigures] = useState(Array.from({length: 32}, (el, i) => (
    {  
      id: i + 1,
      color: i < 16  ? 'black': 'white',
      type: ('rook ' + 'knight ' + 'bishop '  + 'queen ' + 'king ' + 'bishop ' + 'knight ' + 'rook ' + 'pawn '.repeat(8)).split(' ')[i % (maxBoardWidth * 2)], 
     
    icon: 'fa-solid fa-chess-' + 'pawn ',
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

let getDeafultCellColor = (x, y) => {
  return x % 2 == 0 && y % 2 == 0 || x % 2 !== 0 && y % 2 !== 0 ? 'bg-lightColored' : 'bg-brown'
}

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

  let getFigureById = (id) => figures.find(el => el.id == id)

  let renderFigure = (id) => {
  let figure = getFigureById(id)
    if (figure) {
      return figureTypes.find(it => it.value == figure.type).icon + ' text-' + figure.color 
    }
    }

const [playerSide, setPlayerSide] = useState('white')

const [move, setMove] = useState({})

const [history, setHistory] = useState([])

let historyPush = (move) => setHistory(prev => 
  // [...prev, {firstTap: move.firstTap, secondTap: move.secondTap, figureColor: playerSide}])
  [...prev, {...move, figureColor: playerSide}])

useEffect(() => {
  if(move.secondTap){
    historyPush(move)
    setMove({})
    setPlayerSide(prev => prev == 'white' ? 'black' : 'white')
    // setFigureInCell(move.firstTap.figure, move.secondTap.x, move.secondTap.y)
    //   setCells((prev) => 
    //   prev.map(el => {
    //     if(el.id == move.firstTap?.id) {
    //       return {...el, figure: null}
    //     } else {
    //       return el
    //     }
    //   }
    //   ))
    // setFigureInCell(figId, x, y)
    // move and save 
    // изменяем положение фигуры в соответствие с выбранной клеткой через функцию сетфигурпозишн
    // сохраняем второй тап или весь мув в историю через хистори пуш (решить как отображать историю из массива)
    // обновляем setMove({})
    // через setPlayerSide меняем игрока на противоположный не на конкретный
    } 
    else if(move.firstTap) {
    // count where we can go
    }
}, [move])

console.log(history)

let changeFigurePosition = (foundFigId, cell) => {
  setFigureInCell(foundFigId, cell.x, cell.y)
  // console.log(cells)
}

  const [availableToMove, setAvailableToMove] = useState([])
  
  let whereFigureCanGoo = [
    {id: 'D2', dots: ['D3','D4']},
    {id: 'C2', dots: ['C3','C4']},
    {id: 'A2', dots: ['A3','A4']},
    {id: 'C7', dots: ['C6','C5']},
    {id: 'B8', dots: ['C6','A6']},
  ]

  let isCellFirstTap = cell => (cell.id == move.firstTap?.id) 

  let canActivateCell = (cell) => {
    let figure = getFigureById(cell.figure)
    return (figure?.color == playerSide && !isCellFirstTap(cell) ? 'cellOnFocus' : null) 
  }

  let setM = (cell) => {
    let figure = getFigureById(cell.figure)

    if (figure?.color === playerSide) {

      setMove(prev => ({...prev, firstTap: cell}))

      let canGo = whereFigureCanGoo.find(el => el.id === cell.id)
      setAvailableToMove([...canGo.dots])

    } else if (availableToMove.includes(cell.id)) {
    // (availableToMove.find(el => el.dots.includes(cell.id) && el.type == figure.type)) {
      setMove(prev => ({...prev, secondTap: cell}))
      setFigureInCell(move.firstTap.figure, cell.x, cell.y)
      setCells((prev) => 
      prev.map(el => {
        if(el.id == move.firstTap.id) {
          return {...el, figure: null}
        } else {
          return el
        }
        
      }
      ))
      
    // setPlayerSide(prev => prev === 'white' ? 'black' : 'white')
    setAvailableToMove([])
    }
  }

//   let getFigureInCell = (x, y) => {
//     // конкретная фигура {id, color, type}. если ничего вернет null
//     }
    
//     // для ладьи
//     let whereFigureCouldGo = (cell) => {
//     let dots = []
    
//     // x+
    // for(let i = cell.x + 1; i < 8; i++){
    //   let figure = getFigureById(cell.figure)
    //    if(figure?.color === playerSide)  
        
    //     dots.push(cell.id)
    //    if(figure)
    //       break;
    // }
    
//     //...
    
//     return dots
//     }

// let checkCell = (x, y, side, push) => {
//   let figure = getFigureInCell (x, y)
//    if(figure?.color === side)
//       return false   
    
//    push({x, y})
//    if(figure)
//       return false;
//    return true
// }

// // x+
// for(let i = x + 1; i < maxW; i++){
//    if(checkCell (i, y, side, dots.push))
//       break;
// }


  return (
    <div className='d-flex justify-content-   w-100 border p-3 px-5'>
      <div className=' w-50 p-2'><div className='border w-100 h-100'></div></div>
      <div className='w-75 p-2'> 
        <div
          style={{ width: '550px', backgroundColor: '#fede97' }}
          className=''
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
                  className={getDeafultCellColor(cell.x, cell.y) + 
                    " opacity-75 d-flex justify-content-center align-items-center " + canActivateCell(cell) + " " + 
                    (isCellFirstTap(cell) ? "activeCell" : "") + (availableToMove.includes(cell.id) ? ' fa-solid fa-circle green-circle fs-4' : '')}
                  style={{ width: "4rem", height: "4rem" }}
                  onClick = {() => setM(cell)}
                >
                  {cell.figure ?            
                    <div className = {`${renderFigure(cell.figure)} fs-1`}>
                      {/* <div className='fs-5'>{cell.figure}</div> */}
                    </div>
                  : null}  
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
      </div>
      {/* historyBoard */}
      <div className='w-50 p-2'>
        <div className='w-100 h-100 '>
            <div className='bg-black opacity-75 text-white' style={{height:'16%'}}>
              <div className='p-1 text-start d-flex'>
                <div className='fa-solid fa-circle text-success pt-1'></div>
                <div className='ps-1'>Player</div>
                <div className='w-100 text-end pe-1'> 
                  {playerSide == 'black' ? '<' : null} 
                </div>
              </div>
              <div className={'p-2 w-50 fs-3 ' + (playerSide == 'black' ? 'playerTurn' : '')}>
                --:--
              </div>
          </div>
         
          <div className='h-50 py-1'>
              <div className=' bg-brown h-100 p-2 text-start'>
                 {history.map((el, i) => (
                    <div className='border-bottom-brown text-white d-flex justify-content-'>
                      <div className='px-2'>{i + 1}</div>
                      <div className={`w-50 text-${el.figureColor}`}>
                        <span className={renderFigure(el.firstTap?.figure)}></span>
                        {el.firstTap?.id}
                      </div>
                      <div className={`w-50 text-${el.figureColor}`}>{el.secondTap?.id}</div>
                      {/* <div className='w-50'>{el.id}</div> */}
                    </div>
                  )
                )}
              </div>
          </div>
          <div style={{height:'16.6%'}} className='pb-1'>
            <div className='bg-brown h-100' >
              <div className='fs-2 text-white p-4'>
                <i class="fa-solid fa-house pe-4"></i>   
                <i class="fa-solid fa-flag fs-3"></i>
                </div>
            </div>
          </div>
          <div className='bg-white' style={{height:'16%'}}>
            <div className='p-1 text-start d-flex'>
              <div className='fa-solid fa-circle text-success pt-1'></div>
              <div className='ps-1'>Player</div>
              <div className='w-100 text-end pe-1'> 
              {playerSide == 'white' ? '<' : null} </div>
            </div>
            <div className={'p-2 w-50 fs-3 ' + (playerSide == 'white' ? 'playerTurn' : '')}>
              --:--
            </div>
          </div>
         
        </div>
      </div>
    </div>
  )
}

