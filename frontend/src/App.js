import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Home from '../pages/Home';
import HowToPlay from '../pages/HowToPlay';
import Game from '../pages/Game';
import Setup from '../pages/Setup';
import LevelWelcome from '../pages/LevelWelcome';
import Pause from '../pages/Pause';
import LevelComplete from '../pages/LevelComplete';
import GameComplete from '../pages/GameComplete';
import TestShapeGeneration from '../pages/demo/TestShapeGeneration';
import TestCurveCutting from '../pages/demo/TestCurveCutting';
import PuzzleTest from '../pages/demo/PuzzleTest';
import PolygonTest from '../pages/demo/PolygonTest';

function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/how-to-play" element={<HowToPlay />} />
                    <Route path="/play" element={<Game />} />
                    <Route path="/setup" element={<Setup />} />
                    <Route path="/level-welcome" element={<LevelWelcome />} />
                    <Route path="/pause" element={<Pause />} />
                    <Route path="/level-complete" element={<LevelComplete />} />
                    <Route path="/game-complete" element={<GameComplete />} />
                    <Route path="/test-shape-generation" element={<TestShapeGeneration />} />
                    <Route path="/test-curve-cutting" element={<TestCurveCutting />} />
                    <Route path="/puzzle-test" element={<PuzzleTest />} />
                    <Route path="/polygon-test" element={<PolygonTest />} />
                </Routes>
            </Router>
        </DndProvider>
    );
}

export default App;