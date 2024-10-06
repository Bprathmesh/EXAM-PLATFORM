// File: components/ExamFinished.js

import React from 'react';

const ExamFinished = ({ examStatus, score, violationCount, windowSwitchCount, questions, answers, onRestart }) => {
  return (
    <div className="exam-platform">
      <h1>Exam Finished</h1>
      <div className="exam-report">
        <h2>Exam Report</h2>
        <p>Status: {examStatus}</p>
        <p>Score: {score}%</p>
        <p>Full-screen violations: {violationCount}</p>
        <p>Window switches: {windowSwitchCount}</p>
      </div>
      <div className="answer-review">
        <h3>Your Answers:</h3>
        {questions.map((question) => (
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
      <button onClick={onRestart} className="reset-button">
        Restart Exam
      </button>
    </div>
  );
};

export default ExamFinished;