import React from 'react';
import { Link } from 'react-router-dom';

const GameComplete = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>RotaPuzzle</h1>
            <div style={styles.content}>
                <div style={styles.leftSection}>
                    <h2 style={styles.sectionTitle}>Game Over</h2>
                    <p style={styles.scoreText}>本次游戏总得分: 5000</p>
                    <p style={styles.difficultyText}>本次游戏使用的难度: 中级</p>
                    <Link to="/" style={styles.button}>Play Again</Link>
                </div>
                <div style={styles.rightSection}>
                    <h2 style={styles.sectionTitle}>Top 5 Scores</h2>
                    <div style={styles.scoreItem}>1. 5000 - 中级 - Today</div>
                    <div style={styles.scoreItem}>2. 4800 - 中级 - 2023-06-15</div>
                    {/* ... 其他排行榜项目 */}
                </div>
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
        backgroundColor: '#F0EAD6',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        boxSizing: 'border-box',
    },
    title: {
        fontSize: '3rem',
        color: '#5F9EA0',
        marginBottom: '2rem',
    },
    content: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '80%',
        maxWidth: '1000px',
    },
    leftSection: {
        flex: 1,
        marginRight: '2rem',
    },
    rightSection: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: '2rem',
        color: '#5F9EA0',
        marginBottom: '1rem',
    },
    scoreText: {
        fontSize: '1.2rem',
        color: '#708090',
        marginBottom: '0.5rem',
    },
    difficultyText: {
        fontSize: '1.2rem',
        color: '#708090',
        marginBottom: '1rem',
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
        display: 'inline-block',
        marginTop: '1rem',
    },
    scoreItem: {
        fontSize: '1.1rem',
        color: '#708090',
        marginBottom: '0.5rem',
    },
};

export default GameComplete;