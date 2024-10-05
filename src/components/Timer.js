import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

const Timer = forwardRef(({ duration, onTimeUp }, ref) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp]);

  useImperativeHandle(ref, () => ({
    resetTimer: () => setTimeRemaining(duration)
  }));

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return <div className="timer">Time Remaining: {formatTime(timeRemaining)}</div>;
});

export default Timer;
