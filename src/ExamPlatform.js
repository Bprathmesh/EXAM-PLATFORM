import React, { useState, useEffect, useRef, useCallback } from 'react';
import Timer from './Timer';
import Question from './Question';
import './ExamPlatform.css';

const sampleQuestions = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"]
  },
  {
    id: 2,
    text: "Which planet is known as the Red Planet?",
    options: ["Mars", "Jupiter", "Venus", "Saturn"]
  },
  {
    id: 3,
    text: "What is 2 + 2?",
    options: ["3", "4", "5", "6"]
  }
];

const ExamPlatform = ({ fullScreenHandle }) => {
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [windowSwitchCount, setWindowSwitchCount] = useState(0);
  const [examStatus, setExamStatus] = useState('');
  const [answers, setAnswers] = useState({});
  const timerRef = useRef(null);

  const terminateExam = useCallback((reason) => {
    setExamFinished(true);
    setExamStatus(reason);
    fullScreenHandle.exit();
  }, [fullScreenHandle]);

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
  }, [terminateExam]);

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
  }, [terminateExam]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        handleViolation();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleWindowSwitch();
      }
    };

    if (examStarted && !examFinished) {
      document.addEventListener('fullscreenchange', handleFullScreenChange);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [examStarted, examFinished, handleViolation, handleWindowSwitch]);

  const startExam = () => {
    if (window.confirm('Are you ready to start the exam? The exam will begin in full-screen mode. Note: Switching windows more than twice will terminate the exam.')) {
      setExamStarted(true);
      fullScreenHandle.enter();
    }
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
    setAnswers({});
    if (timerRef.current) {
      timerRef.current.resetTimer();
    }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer
    }));
  };

  if (!examStarted) {
    return (
      <div className="exam-platform">
        <h1>Welcome to the Exam Platform</h1>
        <p>This exam contains {sampleQuestions.length} questions.</p>
        <p>You will have 60 minutes to complete the exam.</p>
        <button onClick={startExam}>Start Exam</button>
      </div>
    );
  }

  if (examFinished) {
    return (
      <div className="exam-platform">
        <h1>Exam Finished</h1>
        <h2>Exam Report</h2>
        <p>Status: {examStatus}</p>
        <p>Full-screen violations: {violationCount}</p>
        <p>Window switches: {windowSwitchCount}</p>
        <h3>Your Answers:</h3>
        {sampleQuestions.map(question => (
          <p key={question.id}>
            Question {question.id}: {answers[question.id] || "Not answered"}
          </p>
        ))}
        <button onClick={resetExam}>Restart Exam</button>
      </div>
    );
  }

  return (
    <div className="exam-platform">
      <div className="exam-header">
        <h1>Exam in Progress</h1>
        <Timer 
          duration={3600} 
          onTimeUp={() => terminateExam('Exam time expired.')} 
          ref={timerRef}
        />
      </div>
      <div className="exam-content">
        {sampleQuestions.map(question => (
          <Question 
            key={question.id} 
            question={question} 
            onAnswer={handleAnswer}
          />
        ))}
      </div>
      <div className="exam-footer">
        <button onClick={submitExam}>Submit Exam</button>
      </div>
    </div>
  );
};

export default ExamPlatform;