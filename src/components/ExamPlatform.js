import React, { useState, useEffect, useRef, useCallback } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Timer from "./Timer";
import Question from "./Question";
import QuestionNavigation from "./QuestionNavigation";
import ProgressBar from "./ProgressBar";
import "./ExamPlatform.css";

const sampleQuestions = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["Paris", "Berlin", "London", "Madrid"],
    weight: 1,
  },
  {
    id: 2,
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Jupiter", "Mars", "Saturn"],
    weight: 2,
  },
  {
    id: 3,
    text: "What is 12 + 2?",
    options: ["3", "4", "14", "6"],
    weight: 1,
  },
];

const ExamPlatform = () => {
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [windowSwitchCount, setWindowSwitchCount] = useState(0);
  const [examStatus, setExamStatus] = useState("");
  const [answers, setAnswers] = useState({});
  const [examDuration, setExamDuration] = useState(3600); // Default 1 hour
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const timerRef = useRef(null);
  const fullScreenHandle = useFullScreenHandle();

  const terminateExam = useCallback((reason) => {
    setExamFinished(true);
    setExamStatus(reason);
    
    if (document.fullscreenElement) {
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
          document.webkitExitFullscreen();
        }
      } catch (error) {
        console.warn("Failed to exit full-screen mode:", error);
      }
    }
  }, []);

  const handleViolation = useCallback(() => {
    setViolationCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount === 1) {
        alert(
          "Violation Warning: Please do not exit full-screen mode. This is your first warning."
        );
      } else {
        terminateExam(
          "Exam terminated due to multiple full-screen violations."
        );
      }
      return newCount;
    });
  }, [terminateExam]);

  const handleWindowSwitch = useCallback(() => {
    setWindowSwitchCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount > 2) {
        terminateExam("Exam terminated due to excessive window switching.");
      } else {
        alert(
          `Warning: Window switching detected. You have ${
            3 - newCount
          } switches remaining.`
        );
      }
      return newCount;
    });
  }, [terminateExam]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (examStarted && !examFinished && document.hidden) {
        handleWindowSwitch();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [examStarted, examFinished, handleWindowSwitch]);

  const startExam = useCallback(() => {
    if (
      window.confirm(
        `Are you ready to start the exam? The exam will begin in full-screen mode and last for ${
          examDuration / 60
        } minutes. Note: Switching windows more than twice will terminate the exam.`
      )
    ) {
      setExamStarted(true);
      fullScreenHandle.enter();
    }
  }, [examDuration, fullScreenHandle]);

  const submitExam = useCallback(() => {
    terminateExam("Exam completed successfully.");
  }, [terminateExam]);

  const resetExam = useCallback(() => {
    setExamStarted(false);
    setExamFinished(false);
    setViolationCount(0);
    setWindowSwitchCount(0);
    setExamStatus("");
    setAnswers({});
    setCurrentQuestionIndex(0);
    if (timerRef.current) {
      timerRef.current.resetTimer();
    }
  }, []);

  const handleAnswer = useCallback((questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  }, []);

  const calculateScore = useCallback(() => {
    let totalScore = 0;
    let totalWeight = 0;

    sampleQuestions.forEach((question) => {
      if (answers[question.id] === question.options[2]) {
        totalScore += question.weight;
      }
      totalWeight += question.weight;
    });

    const scorePercentage = (totalScore / totalWeight) * 100;
    return scorePercentage.toFixed(2);
  }, [answers]);

  const handleDurationChange = useCallback((e) => {
    setExamDuration(Number(e.target.value) * 60);
  }, []);

  const navigateQuestion = useCallback((index) => {
    if (index >= 0 && index < sampleQuestions.length) {
      setCurrentQuestionIndex(index);
    }
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (!examStarted && e.key === 'Enter') {
      startExam();
    } else if (examStarted && !examFinished) {
      switch(e.key) {
        case 'ArrowLeft':
          navigateQuestion(currentQuestionIndex - 1);
          break;
        case 'ArrowRight':
          navigateQuestion(currentQuestionIndex + 1);
          break;
        default:
          break;
      }
    }
  }, [examStarted, examFinished, currentQuestionIndex, navigateQuestion, startExam]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const renderExamContent = useCallback(() => (
    <div className="exam-platform">
      <div className="exam-header">
        <h1>Exam in Progress</h1>
        <Timer
          duration={examDuration}
          onTimeUp={() => terminateExam("Exam time expired.")}
          ref={timerRef}
        />
      </div>
      <ProgressBar current={currentQuestionIndex + 1} total={sampleQuestions.length} />
      <QuestionNavigation 
        questions={sampleQuestions}
        currentIndex={currentQuestionIndex}
        answers={answers}
        onNavigate={navigateQuestion}
      />
      <div className="exam-content">
        <Question
          question={sampleQuestions[currentQuestionIndex]}
          onAnswer={handleAnswer}
        />
      </div>
      <div className="exam-footer">
        <button onClick={submitExam} className="submit-button">
          Submit Exam
        </button>
      </div>
    </div>
  ), [currentQuestionIndex, examDuration, answers, handleAnswer, navigateQuestion, submitExam, terminateExam]);

  if (!examStarted) {
    return (
      <div className="exam-platform">
        <h1>Welcome to the Exam Platform</h1>
        <p>This exam contains {sampleQuestions.length} questions.</p>
        <div className="exam-setup">
          <label htmlFor="duration">Exam Duration (minutes):</label>
          <input
            type="number"
            id="duration"
            value={examDuration / 60}
            onChange={handleDurationChange}
            min="1"
            max="180"
          />
        </div>
        <button onClick={startExam} className="start-button">
          Start Exam
        </button>
        <p>Press Enter to start the exam</p>
      </div>
    );
  }

  if (examFinished) {
    return (
      <div className="exam-platform">
        <h1>Exam Finished</h1>
        <div className="exam-report">
          <h2>Exam Report</h2>
          <p>Status: {examStatus}</p>
          <p>Score: {calculateScore()}%</p>
          <p>Full-screen violations: {violationCount}</p>
          <p>Window switches: {windowSwitchCount}</p>
        </div>
        <div className="answer-review">
          <h3>Your Answers:</h3>
          {sampleQuestions.map((question) => (
            <div key={question.id} className="question-review">
              <p>
                Question {question.id} (Weight: {question.weight}):{" "}
                {answers[question.id] || "Not answered"} -{" "}
                {answers[question.id] === question.options[2]
                  ? "Correct"
                  : "Incorrect"}
              </p>
            </div>
          ))}
        </div>
        <button onClick={resetExam} className="reset-button">
          Restart Exam
        </button>
      </div>
    );
  }

  return (
    <FullScreen
      handle={fullScreenHandle}
      onChange={(state) => {
        if (!state && fullScreenHandle.active && examStarted && !examFinished) {
          handleViolation();
        }
      }}
    >
      {fullScreenHandle.active ? (
        renderExamContent()
      ) : (
        <div className="exam-platform">
          <h1>Warning: Not in Full-Screen Mode</h1>
          <p>Please return to full-screen mode to continue the exam.</p>
          <button onClick={fullScreenHandle.enter} className="start-button">
            Return to Full-Screen
          </button>
        </div>
      )}
    </FullScreen>
  );
};

export default ExamPlatform;