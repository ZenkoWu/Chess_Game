import React, { useEffect, useState } from "react";
import sword from '.././../imgs/sword-svgrepo-com.svg'
import './ChessBoard.css'

export default function ChessBoard() {

  const maxBoardWidth = 8;
  const maxBoardHeight = 8;
  const letterACodeInASCII = 65;

  let numbersAxis = Array.from( { length: maxBoardHeight },(_, i) => maxBoardHeight - i);

  let lettersAxis = Array.from({ length: maxBoardWidth }, (_, i) =>String.fromCharCode(i + letterACodeInASCII));

  const figureTypes = ["king", "queen", "knight", "bishop", "rook", "pawn"].map(
    (value) => ({
      value,
      icon: "fa-solid fa-chess-" + value,
      whereFigureCouldGo: (cell) =>
        value === "king" ?
          [
          {x: cell.x + 1, y: cell.y},
          {x: cell.x - 1, y: cell.y},
          {x: cell.x, y: cell.y + 1},
          {x: cell.x, y: cell.y - 1},
          {x: cell.x + 1, y: cell.y + 1},
          {x: cell.x + 1, y: cell.y - 1},
          {x: cell.x - 1, y: cell.y - 1},
          {x: cell.x - 1, y: cell.y + 1},
          ]  
        : value === "bishop" ? 
          [
            Array.from({length: maxBoardHeight}, (_, i) => ({x: cell.x + i + 1, y: cell.y + i + 1}) ), 
            Array.from({length: maxBoardHeight}, (_, i) => ({x: cell.x - i - 1, y: cell.y - i - 1}) ), 
            Array.from({length: maxBoardHeight}, (_, i) => ({x: cell.x - i - 1, y: cell.y + i + 1}) ), 
            Array.from({length: maxBoardHeight}, (_, i) => ({x: cell.x + i + 1, y: cell.y - i - 1}) ), 
          ] 
        : value === "rook" ?
          [
            Array.from( { length: maxBoardHeight },(_, i) => ({x: cell.x, y: cell.y + i + 1,}) ),
            Array.from( { length: maxBoardHeight },(_, i) => ({x: cell.x, y: cell.y - i - 1,}) ),
            Array.from( { length: maxBoardWidth },(_, i) => ({x: cell.x + i + 1, y: cell.y}) ),
            Array.from( { length: maxBoardWidth },(_, i) => ({x: cell.x - i - 1 , y: cell.y}) ),
          ]
        : value === "queen" ?
          [
            Array.from( {length: maxBoardHeight },(_, i) => ({x: cell.x, y: cell.y + i + 1,}) ),
            Array.from( {length: maxBoardHeight },(_, i) => ({x: cell.x, y: cell.y - i - 1,}) ),
            Array.from( {length: maxBoardWidth },(_, i) => ({x: cell.x + i + 1, y: cell.y}) ),
            Array.from( {length: maxBoardWidth },(_, i) => ({x: cell.x - i - 1 , y: cell.y}) ),
            Array.from( {length: maxBoardHeight}, (_, i) => ({x: cell.x + i + 1, y: cell.y + i + 1}) ), 
            Array.from( {length: maxBoardHeight}, (_, i) => ({x: cell.x - i - 1, y: cell.y - i - 1}) ), 
            Array.from( {length: maxBoardHeight}, (_, i) => ({x: cell.x - i - 1, y: cell.y + i + 1}) ), 
            Array.from( {length: maxBoardHeight}, (_, i) => ({x: cell.x + i + 1, y: cell.y - i - 1}) ), 
          ]
        : value === "knight" ? 
          [
            {x: cell.x + 1, y: cell.y + 2},
            {x: cell.x + 1, y: cell.y - 2},
            {x: cell.x - 1, y: cell.y + 2},
            {x: cell.x - 1, y: cell.y - 2},
            {x: cell.x + 2, y: cell.y + 1},
            {x: cell.x + 2, y: cell.y - 1},
            {x: cell.x - 2, y: cell.y + 1},
            {x: cell.x - 2, y: cell.y - 1},
          ]
        : null
    
    })
  );


  const [figures, setFigures] = useState(
    Array.from({ length: 32 }, (_, i) => ({
      id: i + 1,
      color: i < 16 ? "black" : "white",
      type: (
        "rook " +
        "knight " +
        "bishop " +
        "queen " +
        "king " +
        "bishop " +
        "knight " +
        "rook " +
        "pawn ".repeat(8)
      ).split(" ")[i % (maxBoardWidth * 2)],
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

  let getDefultCellColor = (x, y) => {
    return (x % 2 === 0 && y % 2 === 0) || (x % 2 !== 0 && y % 2 !== 0)
      ? "bg-lightColored"
      : "bg-brown";
  };

  function setFigureInCell(figId, x, y) {
    setCells((prev) =>
      prev.map((el) => ({
        ...el,
        figure: el.x === x && el.y === y ? figId : el.figure,
      }))
    );
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
        ).id;

        arrayOfFoundElementsId.push(foundFigureId);

        setFigureInCell(foundFigureId, i, el.y);
      }
    });
  }

  let arrDefaultFigurePosition = [
    { start: 0, xOffsetBetweenFigures: 1, type: "pawn", color: "black", y: 6 },
    { start: 0, xOffsetBetweenFigures: 1, type: "pawn", color: "white", y: 1 },
    { start: 4, xOffsetBetweenFigures: 4, type: "king", color: "black", y: 7 },
    { start: 4, xOffsetBetweenFigures: 4, type: "king", color: "white", y: 0 },
    { start: 3, xOffsetBetweenFigures: 5, type: "queen", color: "black", y: 7 },
    { start: 3, xOffsetBetweenFigures: 5, type: "queen", color: "white", y: 0 },
    { start: 1, xOffsetBetweenFigures: 5, type: "knight", color: "black", y: 7 }, 
    { start: 1, xOffsetBetweenFigures: 5, type: "knight", color: "white", y: 0 },
    { start: 2, xOffsetBetweenFigures: 3, type: "bishop", color: "black", y: 7 },
    { start: 2, xOffsetBetweenFigures: 3,  type: "bishop", color: "white", y: 0 },
    { start: 0, xOffsetBetweenFigures: 7, type: "rook", color: "black", y: 7 },
    { start: 0, xOffsetBetweenFigures: 7, type: "rook", color: "white", y: 0 },
  ];

  let [matchNumber, setMatchNumber] = useState(1);

  useEffect(() => {

    setDefaultFigurePosition(arrDefaultFigurePosition);
    setMatchNumber(Math.floor(Math.random() * 10000000));

  }, []);

  let getFigureById = (id) => figures.find((el) => el.id === id);

  let renderFigure = (id, shadow) => {
    let figure = getFigureById(id);

    if (figure) {
      return (
        figureTypes.find((it) => it.value === figure.type).icon + " text-" + figure.color +
        (figure.color === "white" && shadow ? " figureShadow" : "")
      );
    }

  };

  const [playerSide, setPlayerSide] = useState("white");

  const [move, setMove] = useState({});

  const [history, setHistory] = useState([]);

  let historyPush = (move) => setHistory((prev) => [...prev, { ...move, figureColor: playerSide }]);

  const [availableToMove, setAvailableToMove] = useState([]);

  useEffect(() => {
    if (move.secondTap) {

      setFigureInCell(move.firstTap.figure, move.secondTap.x, move.secondTap.y);

      setCells((prev) =>
        prev.map((el) => {
          if (el.id === move.firstTap.id) {
            return { ...el, figure: null };
          } else {
            return el;
          }
        })
      );

      setAvailableToMove([]);

      historyPush(move);
      setMove({});
      // setPlayerSide(prev => prev === 'white' ? 'black' : 'white')

    } else if (move.firstTap) {
        // count where we can go
        setAvailableToMove([...whereFigureCouldGo(getFigureById(move.firstTap.figure), move.firstTap)]);
    }
  }, [move]);

 
  let getCell = (x, y) => cells.find(cell => cell.y === y && cell.x === x)

  let getCellId = (x, y) => cells.find(cell => cell.y === y && cell.x === x)?.id

  let getFigureIdFromCell = (x, y) => cells.find(cell => cell.y === y && cell.x === x)?.figure
  
  let getFigureByXY = (x, y) => {
    let figId = cells.find(c => c.x === x && c.y === y)?.figure
    let fig = figures.find(f => f.id === figId)
    return fig
  }

  console.log(figureTypes)

  const pointsForRookMove = cell => [
    Array.from( { length: maxBoardHeight },(_, i) => ({x: cell.x, y: cell.y + i + 1,}) ),
    Array.from( { length: maxBoardHeight },(_, i) => ({x: cell.x, y: cell.y - i - 1,}) ),
    Array.from( { length: maxBoardWidth },(_, i) => ({x: cell.x + i + 1, y: cell.y}) ),
    Array.from( { length: maxBoardWidth },(_, i) => ({x: cell.x - i - 1 , y: cell.y}) ),
  ]

  const pointsForKnightMove = cell => [
    {x: cell.x + 1, y: cell.y + 2},
    {x: cell.x + 1, y: cell.y - 2},
    {x: cell.x - 1, y: cell.y + 2},
    {x: cell.x - 1, y: cell.y - 2},
    {x: cell.x + 2, y: cell.y + 1},
    {x: cell.x + 2, y: cell.y - 1},
    {x: cell.x - 2, y: cell.y + 1},
    {x: cell.x - 2, y: cell.y - 1},

  ]

  const pointsForBishopMove = cell => [
    Array.from({length: maxBoardHeight}, (_, i) => ({x: cell.x + i + 1, y: cell.y + i + 1}) ), 
    Array.from({length: maxBoardHeight}, (_, i) => ({x: cell.x - i - 1, y: cell.y - i - 1}) ), 
    Array.from({length: maxBoardHeight}, (_, i) => ({x: cell.x - i - 1, y: cell.y + i + 1}) ), 
    Array.from({length: maxBoardHeight}, (_, i) => ({x: cell.x + i + 1, y: cell.y - i - 1}) ), 
  ]

  const pointsForQueenMove = cell => [
    ...pointsForRookMove(cell),
    ...pointsForBishopMove(cell),

  ]

  const pointsForKingMove = cell => [
    {x: cell.x + 1, y: cell.y},
    {x: cell.x - 1, y: cell.y},
    {x: cell.x, y: cell.y + 1},
    {x: cell.x, y: cell.y - 1},
    {x: cell.x + 1, y: cell.y + 1},
    {x: cell.x + 1, y: cell.y - 1},
    {x: cell.x - 1, y: cell.y - 1},
    {x: cell.x - 1, y: cell.y + 1},
  ]

 
  let whereFigureCouldGo = (figure, cell) => {
    let dots = []

    
    if (figure?.type === "pawn" && figure.color === "white") {

      let a =  [
        {x: cell.x, y: cell.y + 2},
        {x: cell.x, y: cell.y + 1},
        {x: cell.x + 1, y: cell.y + 1},
        {x: cell.x - 1, y: cell.y + 1},
      ]
      
      a.map(el => {
        if (cell.y == 1 && !getCell(el.x, el.y)?.figure && !getCell(el.x, el.y)?.figure) {
          dots.push(getCellId(el.x, el.y))
        } else {
            if (getFigureByXY(el.x, el.y)?.color === 'black') {
              dots.push(getCellId(el.x, el.y)) 
            }
            if (getFigureByXY(el.x, el.y)?.color === 'black') {
            dots.push(getCellId(el.x, el.y))
            }
        }
        if (getCell(el.x, el.y)?.figure) {
          return dots; 
        } 
           
        dots.push(getCellId(el.x, el.y))
      } 
        
      )
       
      // if (cell.y == 1 && !getCell(cell.x, cell.y + 1)?.figure && !getCell(cell.x, cell.y + 2)?.figure) {
      //   dots.push(getCellId(cell.x, cell.y + 2))
      // } 
      // else {
      //     if (getFigureByXY(cell.x + 1, cell.y + 1)?.color === 'black') {
      //       dots.push(getCellId(cell.x + 1, cell.y + 1)) 
          
      //     }
      //       if (getFigureByXY(cell.x - 1, cell.y + 1)?.color === 'black') {
      //       dots.push(getCellId(cell.x - 1, cell.y + 1))
            
      //       }
      // } 
      // if (getCell(cell.x, cell.y + 1)?.figure) {
      //   return dots; 
      // } 
         
      // dots.push(getCellId(cell.x, cell.y + 1))
        
        

    } else if (figure?.type === "pawn" && figure.color === "black") {
      
      if(cell.y == 6 && !getCell(cell.x, cell.y - 1)?.figure && !getCell(cell.x, cell.y - 2)?.figure) {
        dots.push(getCellId(cell.x, cell.y - 2)) 
      } 
      else {
        if (getFigureByXY(cell.x - 1, cell.y - 1)?.color === 'white') {
          dots.push(getCellId(cell.x - 1, cell.y - 1)) 
        
        }
        if (getFigureByXY(cell.x + 1, cell.y - 1)?.color === 'white') {
          dots.push(getCellId(cell.x + 1, cell.y - 1))
          
        }
      }
      if (getCell(cell.x, cell.y - 1)?.figure) {
        return dots; 
      } 
         
      dots.push(getCellId(cell.x, cell.y - 1))
         
    } else {
      let pushCellsIdWhereFigureCanGo = (x, y, array) => {
        if(x < 0 || x >= maxBoardWidth || y < 0 || y >= maxBoardHeight) 
          return true;

        let figure = getFigureById(getFigureIdFromCell(x, y))

        if (figure) {
          if (figure.color !== playerSide) {
            array.push(getCellId(x, y));
          }
          return true;
        }
        array.push(getCellId(x, y));
      }

        figureTypes.find(f => f.value == figure.type)?.whereFigureCouldGo(cell)
        ?.forEach(el => {
          if(Array.isArray(el)) {
            for (let p of el) {
              if ( pushCellsIdWhereFigureCanGo(p.x, p.y, dots) ) {
                break;
              }
            }
          } else {
            pushCellsIdWhereFigureCanGo(el.x, el.y, dots)
          }
        })
  
    }

    return dots;
  };

  let isCellFirstTap = (cell) => cell.id === move.firstTap?.id;

  let canActivateCell = (cell) => {
    // функция, подсвечивающая какие фигуры можно нажать для хода
    let figure = getFigureById(cell.figure);
    return figure?.color === playerSide && !isCellFirstTap(cell) ? "cellOnFocus" : null;
  };

  let setFigureMoves = (cell) => {
    let figure = getFigureById(cell.figure);

    if (figure?.color === playerSide) {
      setMove((prev) => ({ ...prev, firstTap: cell }));
    } 
    else if (availableToMove.includes(cell.id)) {
      setMove((prev) => ({ ...prev, secondTap: cell }));

    }
  };

  return (
    <div className="d-flex justify-content-  w-100  p-2 px-5">
      <div className=" w-50 p-2">
        <div className=" w-100 h-100">
          <div className="w-100 bg-brown opacity-75 p-3 text-light">
            <div>Матч</div>

            <div>{matchNumber}</div>
          </div>
        </div>
      </div>

      <div className="w-75 p-2">
        <div
          style={{ width: "550px", backgroundColor: "#fede97" }}
          className=""
        >
          <div className="d-flex px-3 w-100">
            {lettersAxis.map((item, i) => (
              <div key={i} className="px-4 m-auto fw-bold">
                {item}
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-center flex-wrap m-auto position-relative">
            {["start", "end"].map((pos) => (
              <div
                className={`px-1 w-100 h-100 d-flex position-absolute  

               flex-column justify-content-around align-items-${pos}`}
              >
                {numbersAxis.map((item, i) => (
                  <div key={i} className="py-3 fw-bold">
                    {item}
                  </div>
                ))}
              </div>
            ))}

            {cells.map((cell, i) => (
              <div
                key={cell.id}
                className={
                  getDefultCellColor(cell.x, cell.y) +
                  " opacity-75 d-flex justify-content-center align-items-center " +
                  canActivateCell(cell) +
                  " " +
                  (isCellFirstTap(cell) ? "activeCell" : "") +
                  (availableToMove.includes(cell.id) && cell.figure
                  ? " bg-green cursor" :
                    availableToMove.includes(cell.id) 
                    ? " fa-solid fa-circle green-circle fs-4 cursor"
                    
                    : "")
                }
                style={{ width: "4rem", height: "4rem" }}
                onClick={() => setFigureMoves(cell)}
              >
                {/* {cell.x} */}
                {
                   availableToMove.includes(cell.id) && cell.figure
                   ? 
                  <img src={sword} alt="" width='50px' style={{}}/>
                  : ""
                }
                {cell.figure ? (
                  <div
                    className={`${renderFigure(cell.figure, "shadow")} fs-1 position-absolute`}
                  >
                    {/* <div className='fs-5'>{cell.figure}</div> */}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="d-flex px-3 w-100">
            {lettersAxis.map((item, i) => (
              <div key={i} className="px-4 m-auto fw-bold">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* historyBoard */}

      <div className="w-50 p-2">
        <div className="w-100 h-100">
          <div
            className={'bg-black text-white' + (playerSide === "black" ? " opacity-75" : " opacity-50")}
            style={{ height: "15%" }}
          >
            <div className="py-1 px-2 text-start d-flex">
              <i className="fa-solid fa-circle text-success pt-1"></i>
              <div className="ps-1">Player</div>
              <div className="w-100 text-end pe-1">
                {playerSide === "black" ? "<" : null}
              </div>
            </div>
            <div className="d-flex">
              <div className={"p-2 w-50 fs-4 " + (playerSide === "black" ? "playerTurn" : "")}>
                --:--
              </div>
              <div className=" text-start ps-2 w-50  ">{
                  history.map(el =>(
                    el.secondTap?.figure && el.figureColor === 'black'
                     ?
                    <i className={(renderFigure(el.secondTap?.figure)) + ' pe-1 '}></i>
                     : null
                    ) 
                  )
                }</div>
              </div>
          </div>

          <div className=" py-1 ">
            <div className=" bg-brown py-2 px-3 text-center " style={{overflow: 'auto', height:'300px' }} id= 'myDiv'>
              {history.map((el, i) => (
                <div className="border-bottom-brown text-white row py-1">
                  <div className="px-2 col-2">{i + 1}</div>

                  <div className={` text-${el.figureColor} col-5   `}>
                    <span
                      className={renderFigure(el.firstTap?.figure) + " px-1"}
                    ></span>

                    {el.firstTap?.id}
                  </div>

                  <div className={` text-${el.figureColor} text-end pe-5 col-5  `}>
                    {el.secondTap?.figure ? 
                      <i
                      className={renderFigure(el.secondTap?.figure) + " px-1 "}
                    ></i>
                    : null
                    }
                    {el.secondTap?.id}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: "15%" }} className="pb-1">
            <div className="bg-brown h-100">
              <div className="fs-2 text-white p-3">
                <i class="fa-solid fa-house pe-4 cursor"></i>
                <i class="fa-solid fa-flag fs-3 cursor"></i>
              </div>
            </div>
          </div>

          <div className={"bg-white " + (playerSide !== "white" ? " opacity-50" : '')} style={{ height: "15%" }}>
            <div className="py-1 px-2 text-start d-flex">
              <div className="fa-solid fa-circle text-success pt-1"></div>
              <div className="ps-1 ">Player</div>
              <div className="w-100 text-end pe-1">
                {playerSide === "white" ? "<" : null}{" "}
              </div>
            </div>
            <div className="d-flex ">
              <div className={"p-2 w-50 fs-4  " + (playerSide === "white" ? "playerTurn" : "")}>
                --:--
              </div>
              <div className="text-start ps-2 w-50  "> {
                history.map(el => (
                   el.secondTap?.figure && el.figureColor === 'white' ?
                  <i className={(renderFigure(el.secondTap?.figure)) + ' pe-1'}></i>
                   : null
                  )
                  )
              }</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


