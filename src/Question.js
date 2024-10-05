import React, { useState } from 'react';

const Question = ({ question, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const handleAnswerChange = (e) => {
    setSelectedAnswer(e.target.value);
    onAnswer(question.id, e.target.value);
  };

  return (
    <div className="question">
      <h3>{question.text}</h3>
      {question.options.map((option, index) => (
        <div key={index}>
          <input
            type="radio"
            id={`q${question.id}_option${index}`}
            name={`question${question.id}`}
            value={option}
            checked={selectedAnswer === option}
            onChange={handleAnswerChange}
          />
          <label htmlFor={`q${question.id}_option${index}`}>{option}</label>
        </div>
      ))}
    </div>
  );
};

export default Question;
