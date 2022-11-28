import React from 'react'
import { useState, useEffect } from 'react';

const Timer = (props) => {
    const {initialMinute = 0, initialSeconds = 0} = props;
    const [ minutes, setMinutes ] = useState(initialMinute);
    const [seconds, setSeconds ] =  useState(initialSeconds);

    let myInterval = () => setTimeout(() => {
        if (seconds > 0) {
            setSeconds(seconds - 1);
        }
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(myInterval)
            } else {
                setMinutes(minutes - 1);
                setSeconds(59);
            }
        } 
    }, 1000)

    props.isCountdown && myInterval()

    return (
        <div>
            { 
                minutes === 0 && seconds === 0 ? 
                    <span> 00:00 </span> 
                :
                minutes === 0 && seconds <= 59 ?
                    <span className='text-danger'> {minutes}:{seconds < 10 ?  `0${seconds}` : seconds}</span> 
                : 
                    <span> {minutes}:{seconds < 10 ?  `0${seconds}` : seconds}</span> 
            }
        </div>
    )
}

export default Timer;