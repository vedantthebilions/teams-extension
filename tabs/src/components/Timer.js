import React from 'react';
import { useEffect } from 'react';
import { useStopwatch } from 'react-timer-hook';
import Cookies from 'js-cookie'

export default function TimerUI() {
  let {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: true });
  
  useEffect(()=>{
    //  Cookies.set('name', 1, { expires: 7 })
    // window.sessionStorage.setItem("days", days);
    // window.sessionStorage.setItem("hours", hours);
    // window.sessionStorage.setItem("minutes", minutes);
    // window.sessionStorage.setItem("seconds", seconds);
    // setCookie('days', days);
    // setCookie('hours', hours);
    // setCookie('minutes', minutes);
    // setCookie('seconds', seconds);
      // if( getCookie('seconds')){
      //   console.log('asdasd')
      //   seconds = getCookie('seconds', seconds);
      //   minutes = window.sessionStorage.getItem('minutes')
      //   hours = window.sessionStorage.getItem('hours')
      //   days = window.sessionStorage.getItem('days')
      //   console.log('asjhdgajhlsgdjhasgd')

      // }
  })
  return (
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: '60px'}}>
        <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <p>{isRunning ? 'Running' : 'Not running'}</p>
      {/* <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={reset}>Reset</button> */}
    </div>
  );
}