import React from 'react';
import { Link } from 'react-router-dom';

const LevelWelcome = ({ currentLevel = 1, totalLevels = 4 }) => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Welcome!</h1>
            <div style={styles.imageContainer}>
                {/* 这里可以添加拼图预览图像 */}
                <div style={styles.placeholderImage}>Puzzle Preview</div>
            </div>
            <p style={styles.progress}>Puzzle {currentLevel} of {totalLevels}</p>
            <Link to="/play" style={styles.button}>Begin</Link>
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
        marginBottom: '2rem',
    },
    imageContainer: {
        width: '60%',
        maxWidth: '600px',
        aspectRatio: '16 / 9',
        backgroundColor: '#DDD',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '2rem',
        borderRadius: '10px',
        overflow: 'hidden',
    },
    placeholderImage: {
        fontSize: '1.2rem',
        color: '#708090',
    },
    progress: {
        fontSize: '1.5rem',
        color: '#708090',
        marginBottom: '2rem',
    },
    button: {
        padding: '12px 24px',
        fontSize: '1.1rem',
        borderRadius: '25px',
        border: '2px solid #5F9EA0',
        backgroundColor: '#5F9EA0',
        color: 'white',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
    },
};

export default LevelWelcome;
