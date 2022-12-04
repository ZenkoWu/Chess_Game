import React, {useState, useEffect, useRef} from 'react'

const STATUS = {
    STARTED: 'Started',
    STOPPED: 'Stopped',
}

const INITIAL_COUNT = 1800

function useInterval(callback, delay) {
    const savedCallback = useRef()
  
    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])
  
    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current()
        }
        if (delay !== null) {
            let id = setInterval(tick, delay)
            return () => clearInterval(id)
        }
    }, [delay])
}
  
const twoDigits = (num) => String(num).padStart(2, '0')

function Timer(props) {
    const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_COUNT)
    const [status, setStatus] = useState(STATUS.STOPPED)

    const secondsToDisplay = secondsRemaining % 60
    const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60
    const minutesToDisplay = minutesRemaining % 60

    const handleStart = () => {
        setStatus(STATUS.STARTED)
    }
    const handleStop = () => {
        setStatus(STATUS.STOPPED)
    }
    const handleReset = () => {
        setStatus(STATUS.STOPPED)
        setSecondsRemaining(INITIAL_COUNT)
    }

    useInterval(
        () => {
        if (secondsRemaining > 0) {
            setSecondsRemaining(secondsRemaining - 1)
        } else {
            setStatus(STATUS.STOPPED)
        }
        },
        status === STATUS.STARTED ? 1000 : null,
        // passing null stops the interval
  )

  useEffect(() => {

        (props.isCheckmate || !props.isCountdown || props.isDraw) && handleStop()
        !props.isCheckmate && !props.isDraw && props.isCountdown && handleStart()
        props.resetTimer && handleReset()

  }, [props.isCountdown, props.isCheckmate, props.resetTimer, props.isDraw])

  return (
    <div>
        <div onClick={handleReset}>
            {twoDigits(minutesToDisplay)}:{twoDigits(secondsToDisplay)}
        </div>
    </div>
  )
}

export default Timer;