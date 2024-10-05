import React from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import ExamPlatform from './ExamPlatform';
import './App.css';

function App() {
  const handle = useFullScreenHandle();

  return (
    <FullScreen handle={handle}>
      <ExamPlatform fullScreenHandle={handle} />
    </FullScreen>
  );
}

export default App;