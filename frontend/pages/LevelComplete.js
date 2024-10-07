import React from 'react';
import { Link } from 'react-router-dom';

const LevelComplete = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>恭喜! 您已解锁下一关!</h1>
            <div style={styles.scoreContainer}>
                <h2 style={styles.scoreTitle}>本关得分: 1300分</h2>
                <p style={styles.difficultyText}>关卡难度: 中级</p>
            </div>
            <div style={styles.detailsContainer}>
                <p style={styles.detailItem}>🧩 完成碎片: 8/8 (+960分)</p>
                <p style={styles.detailItem}>🔄 旋转使用: 12/10 (-160分)</p>
                <p style={styles.detailItem}>💡 提示使用: 1次 (-100分)</p>
                <p style={styles.detailItem}>⭐ 旋转奖励: +600分</p>
            </div>
            <div style={styles.statusContainer}>
                <p style={styles.statusItem}>本关得分: 1300分</p>
                <p style={styles.statusItem}>关卡满分: 1500分</p>
                <p style={styles.statusItem}>您的最佳: 1400分</p>
            </div>
            <div style={styles.buttonContainer}>
                <Link to="/play" style={styles.button}>Replay</Link>
                <Link to="/level-welcome" style={styles.button}>Next</Link>
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
        fontSize: '2.5rem',
        color: '#5F9EA0',
        marginBottom: '2rem',
        textAlign: 'center',
    },
    scoreContainer: {
        marginBottom: '2rem',
        textAlign: 'center',
    },
    scoreTitle: {
        fontSize: '2rem',
        color: '#5F9EA0',
        marginBottom: '0.5rem',
    },
    difficultyText: {
        fontSize: '1.2rem',
        color: '#708090',
    },
    detailsContainer: {
        marginBottom: '2rem',
    },
    detailItem: {
        fontSize: '1.1rem',
        color: '#708090',
        marginBottom: '0.5rem',
    },
    statusContainer: {
        marginBottom: '2rem',
        textAlign: 'center',
    },
    statusItem: {
        fontSize: '1.1rem',
        color: '#708090',
        marginBottom: '0.5rem',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
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

export default LevelComplete;