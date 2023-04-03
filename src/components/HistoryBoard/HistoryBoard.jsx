import { OneMoveHistory } from './OneMoveHistory/OneMoveHistory'
import { useEffect, useRef } from 'react'

export let HistoryBoard = ({history, getFigureClasses, themeColor}) => {
    
    const scroll = useRef(null);

    useEffect(() => {
        scroll.current.scroll({ top: 100000, behavior: 'smooth' });
      });

    return (
        <div className='py-1'>
            <div className={'py-1 px-3 text-center ' + themeColor} style={{overflow: 'auto', height: '300px' }} ref={scroll}>
                {history.map((el, i) => (
                    <OneMoveHistory 
                        key={i}
                        moveNumber={i + 1}
                        getFigureClasses={getFigureClasses} 
                        {...el}
                    />
                ))}
            </div>
        </div>
    )
}
