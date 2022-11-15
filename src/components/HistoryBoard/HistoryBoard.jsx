import { OneMoveHistory } from "./OneMoveHistory/OneMoveHistory"

export let HistoryBoard = ({history, renderFigure}) => {
  return (
    <div className='py-1'>
      <div className='bg-brown py-1 px-3 text-center' style={{overflow: 'auto', height: '300px' }}>
        {history.map((el, i) => (
          <OneMoveHistory 
            key ={i}
            moveNumber ={i + 1}
            renderFigure = {renderFigure} 
            {...el}
            />
        ))}
      </div>
    </div>
)
}
