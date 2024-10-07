import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Play from './pages/Play';
import Setup from './pages/Setup';
import LevelWelcome from './pages/LevelWelcome';
import Pause from './pages/Pause';
import LevelComplete from './pages/LevelComplete';
import GameComplete from './pages/GameComplete';
import HowToPlay from './pages/HowToPlay';
import TestShapeGeneration from './pages/demo/TestShapeGeneration';
import TestCurveCutting from './pages/demo/TestCurveCutting';
import PuzzleTest from './pages/demo/PuzzleTest';
import PolygonTest from './pages/demo/PolygonTest';
import CurveTest from './pages/demo/CurveTest';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/level-welcome" element={<LevelWelcome />} />
        <Route path="/pause" element={<Pause />} />
        <Route path="/level-complete" element={<LevelComplete />} />
        <Route path="/game-complete" element={<GameComplete />} />
        <Route path="/how-to-play" element={<HowToPlay />} />
        <Route path="/demo/test-shape-generation" element={<TestShapeGeneration />} />
        <Route path="/demo/test-curve-cutting" element={<TestCurveCutting />} />
        <Route path="/demo/puzzle-test" element={<PuzzleTest />} />
        <Route path="/demo/polygon-test" element={<PolygonTest />} />
        <Route path="/demo/curve-test" element={<CurveTest />} />
      </Routes>
    </Router>
  );
}

export default App;