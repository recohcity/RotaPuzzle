import React from 'react';
import { Link } from 'react-router-dom';

const Pause = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Game Paused</h1>
            <div style={styles.buttonContainer}>
                <Link to="/play" style={styles.button}>Resume</Link>
                <Link to="/play" style={styles.button}>Restart</Link>
                <button style={styles.button}>Mute Sound</button>
                <Link to="/how-to-play" style={styles.button}>How To Play</Link>
                <Link to="/setup" style={styles.button}>Setup</Link>
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0EAD6', // 莫兰迪色系的背景色
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        boxSizing: 'border-box',
    },
    title: {
        fontSize: '3rem',
        color: '#5F9EA0',
        marginBottom: '3rem',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
    },
    button: {
        padding: '12px 24px',
        fontSize: '1.1rem',
        width: '200px',
        borderRadius: '25px',
        border: '2px solid #5F9EA0',
        backgroundColor: '#5F9EA0',
        color: 'white',
        textDecoration: 'none',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
    },
};

export default Pause;
