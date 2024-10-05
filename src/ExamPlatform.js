import React, { useState, useEffect, useRef, useCallback } from 'react';
import Timer from './Timer';
import './ExamPlatform.css';

const ExamPlatform = ({ fullScreenHandle }) => {
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [windowSwitchCount, setWindowSwitchCount] = useState(0);
  const [examStatus, setExamStatus] = useState('');
  const timerRef = useRef(null);

  const handleViolation = useCallback(() => {
    setViolationCount((prevCount) => {
      if (prevCount === 0) {
        alert('Violation Warning: Please do not exit full-screen mode. This is your first warning.');
        return prevCount + 1;
      } else {
        terminateExam('Exam terminated due to multiple full-screen violations.');
        return prevCount;
      }
    });
  }, []);

  const handleWindowSwitch = useCallback(() => {
    setWindowSwitchCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount > 2) {
        terminateExam('Exam terminated due to excessive window switching.');
      } else {
        alert(`Warning: Window switching detected. You have ${3 - newCount} switches remaining.`);
      }
      return newCount;
    });
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (examStarted && !document.fullscreenElement) {
        handleViolation();
      }
    };

    const handleVisibilityChange = () => {
      if (examStarted && document.hidden) {
        handleWindowSwitch();
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [examStarted, handleViolation, handleWindowSwitch]);

  const startExam = () => {
    if (window.confirm('Are you ready to start the exam? The exam will begin in full-screen mode. Note: Switching windows more than twice will terminate the exam.')) {
      setExamStarted(true);
      fullScreenHandle.enter();
    }
  };

  const terminateExam = (reason) => {
    setExamFinished(true);
    setExamStatus(reason);
    fullScreenHandle.exit();
  };

  const submitExam = () => {
    terminateExam('Exam completed successfully.');
  };

  const resetExam = () => {
    setExamStarted(false);
    setExamFinished(false);
    setViolationCount(0);
    setWindowSwitchCount(0);
    setExamStatus('');
    if (timerRef.current) {
      timerRef.current.resetTimer();
    }
  };

  if (!examStarted) {
    return (
      <div className="exam-platform">
        <h1>Welcome to the Exam Platform</h1>
        <button onClick={startExam}>Start Exam</button>
      </div>
    );
  }

  if (examFinished) {
    return (
      <div className="exam-platform">
        <h1>Exam Finished</h1>
        <p>Status: {examStatus}</p>
        <p>Full-screen violations: {violationCount}</p>
        <p>Window switches: {windowSwitchCount}</p>
        <button onClick={resetExam}>Restart Exam</button>
      </div>
    );
  }

  return (
    <div className="exam-platform">
      <h1>Exam in Progress</h1>
      <Timer 
        duration={3600} 
        onTimeUp={() => terminateExam('Exam time expired.')} 
        ref={timerRef}
      />
      <button onClick={submitExam}>Submit Exam</button>
    </div>
  );
};

export default ExamPlatform;