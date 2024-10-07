import React from 'react';
import { Link } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Play = () => {
    return (
        <div style={styles.container}>
            <div style={styles.topBar}>
                <Link to="/pause" style={styles.pauseButton}>
                    <span style={styles.pauseIcon}>⏸</span>
                </Link>
                <div style={styles.statusBar}>
                    <span>Puzzle 1 of 4</span>
                    <span>10880</span>
                    <span>中级</span>
                </div>
            </div>
            <div style={styles.gameArea}>
                {/* 游戏区域内容已清空 */}
            </div>
            <div style={styles.bottomBar}>
                <div style={styles.rotationInfo}>10/6</div>
                <div style={styles.controls}>
                    <button style={styles.rotateButton}>↺</button>
                    <button style={styles.rotateButton}>↻</button>
                </div>
                <button style={styles.hintButton}>Hint</button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F0EAD6',
        fontFamily: 'Arial, sans-serif',
    },
    topBar: {
        height: '8vh',
        minHeight: '50px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2vw',
        backgroundColor: '#5F9EA0',
    },
    pauseButton: {
        textDecoration: 'none',
        color: 'white',
    },
    pauseIcon: {
        fontSize: 'calc(16px + 1vw)',
    },
    statusBar: {
        display: 'flex',
        gap: '2vw',
        color: 'white',
        fontSize: 'calc(12px + 0.5vw)',
    },
    gameArea: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E6E6FA',
        position: 'relative',
    },
    bottomBar: {
        height: '10vh',
        minHeight: '60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2vw',
        backgroundColor: '#5F9EA0',
    },
    rotationInfo: {
        color: 'white',
        fontSize: 'calc(12px + 0.5vw)',
    },
    controls: {
        display: 'flex',
        gap: '1vw',
    },
    rotateButton: {
        width: '6vmin',
        height: '6vmin',
        minWidth: '40px',
        minHeight: '40px',
        fontSize: 'calc(16px + 1vw)',
        backgroundColor: '#F0EAD6',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    hintButton: {
        padding: '1vh 2vw',
        fontSize: 'calc(12px + 0.5vw)',
        backgroundColor: '#F0EAD6',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

// 修改导出，用 DndProvider 包裹 Play 组件
export default function PlayWithDnd() {
    return (
        <DndProvider backend={HTML5Backend}>
            <Play />
        </DndProvider>
    );
}