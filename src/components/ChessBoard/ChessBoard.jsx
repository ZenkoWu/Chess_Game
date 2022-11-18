import { lettersAxis, numbersAxis } from '../../constants/constans';
import { Cell } from './Cell/Cell';
import './ChessBoard.css'

const LettersAxis=()=> {
    return (
        <div className='row m-0 mw-100 px-4'>
            {lettersAxis.map((item, i) => (
                <div key={i} className='col fw-bold'>
                {item}
                </div>
            ))}
        </div> 
    )
}

const NumbersAxis=()=> {
    return (
        <div className={`col p-0 `}>
            {numbersAxis.map((item, i) => (
                <div key={i} className=' fw-bold' style={{padding:'20px 0'}}>
                {item}
                </div>
            ))}
        </div> 
    )
}

export default function ChessBoard(
    {
        cells, 
        isCellFirstTap, 
        canActivateCell, 
        availableToMove, 
        getFigureClasses, 
        setFigureMoves 
    }) {

    return (
        <div className='boardBorderColor'>

            <LettersAxis/>

            <div className='row m-0 mw-100'>

                <NumbersAxis/>
            
                <div className='col-11 p-0'>  
                    <div className='row m-0 mw-100'> 
                        {cells.map(cell => (
                            <Cell
                                key={cell.id}
                                canActivateCell={canActivateCell}
                                cell={cell}
                                availableToMove={availableToMove}
                                setFigureMoves={setFigureMoves}
                                getFigureClasses={getFigureClasses}
                                isCellFirstTap={isCellFirstTap}
                            />
                        ))}
                    </div>
                </div>

                <NumbersAxis/>

            </div>

            <LettersAxis/>

        </div>
    );
}

