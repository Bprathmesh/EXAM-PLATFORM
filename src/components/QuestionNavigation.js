// File: QuestionNavigation.js

import React from 'react';

const QuestionNavigation = ({ questions, currentIndex, answers, onNavigate }) => {
  return (
    <div className="question-navigation">
      {questions.map((question, index) => (
        <button
          key={question.id}
          className={`nav-button ${answers[question.id] ? 'answered' : ''} ${index === currentIndex ? 'current' : ''}`}
          onClick={() => onNavigate(index)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default QuestionNavigation;