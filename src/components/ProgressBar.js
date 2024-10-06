// File: ProgressBar.js

import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;
  return (
    <div className="progress-bar">
      <div className="progress" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

export default ProgressBar;