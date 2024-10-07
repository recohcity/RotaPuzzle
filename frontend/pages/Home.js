import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [isMuted, setIsMuted] = useState(false);

    const toggleMute = () => {
        setIsMuted(!isMuted);
        // 这里可以添加实际的音频控制逻辑
    };

    return (
        <div style={styles.container}>
            <div style={styles.tempNav}>
                <h3>menu</h3>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/how-to-play">How To Play</Link></li>
                    <li><Link to="/play">Play</Link></li>
                    <li><Link to="/setup">Setup</Link></li>
                    <li><Link to="/level-welcome">Level Welcome</Link></li>
                    <li><Link to="/pause">Pause</Link></li>
                    <li><Link to="/level-complete">Level Complete</Link></li>
                    <li><Link to="/game-complete">Game Complete</Link></li>
                    <li><Link to="demo/test-shape-generation">Test Shape Generation</Link></li>
                    <li><Link to="demo/test-curve-cutting">Test Curve Cutting</Link></li>
                    <li><Link to="demo/puzzle-test">Puzzle Test</Link></li>
                    <li><Link to="demo/polygon-test">Polygon Test</Link></li>
                    <li><Link to="demo/curve-test">Curve Test</Link></li>
                </ul>
            </div>
            <h1 style={styles.title}>RotaPuzzle</h1>
            <p style={styles.description}>
                通过将碎片拼凑成指定目标形状，来锻炼你的空间推理能力。
            </p>
            <div style={styles.buttonContainer}>
                <Link to="/how-to-play" style={styles.button}>How To Play</Link>
                <Link to="/play" style={{...styles.button, ...styles.playButton}}>Play</Link>
                <Link to="/setup" style={styles.button}>Setup</Link>
            </div>
            <button onClick={toggleMute} style={styles.muteButton}>
                {isMuted ? '🔇' : '🔊'}
            </button>
        </div>
    );
};

const styles = {
    container: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0EAD6', // 莫兰迪色系的背景色
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '4rem',
        color: '#5F9EA0', // 莫兰迪色系的标题颜色
        marginBottom: '2rem',
    },
    description: {
        fontSize: '1.2rem',
        color: '#708090', // 莫兰迪色系的文字颜色
        textAlign: 'center',
        maxWidth: '600px',
        marginBottom: '3rem',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '1.5rem',
    },
    button: {
        padding: '12px 24px',
        fontSize: '1.1rem',
        borderRadius: '25px',
        border: '2px solid #5F9EA0',
        backgroundColor: 'transparent',
        color: '#5F9EA0',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
    },
    playButton: {
        backgroundColor: '#5F9EA0',
        color: 'white',
    },
    muteButton: {
        position: 'absolute',
        bottom: '2rem',
        right: '2rem',
        background: 'none',
        border: 'none',
        fontSize: '2rem',
        cursor: 'pointer',
        color: '#5F9EA0',
    },
    tempNav: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 1000,
    },
};

export default Home;
