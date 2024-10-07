import React from 'react';
import { Link } from 'react-router-dom';

const HowToPlay = () => {
    return (
        <div style={styles.container}>
            <Link to="/" style={styles.skipButton}>Skip tutorial</Link>
            <h1 style={styles.title}>How To Play</h1>
            <div style={styles.imageContainer}>
                {/* 这里可以添加游戏截图 */}
                <div style={styles.placeholderImage}>Game Screenshot</div>
            </div>
            <p style={styles.description}>
                在此游戏中，拖动明亮的碎片，将碎片放入轮廓内。点击一个碎片后，将出现两个按钮：顺时针和逆时针旋转该碎片，将碎片放入轮廓内。旋转次数越少，得分越高。
            </p>
            <Link to="/play" style={styles.button}>Start Game</Link>
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
    skipButton: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        textDecoration: 'none',
        color: '#5F9EA0',
        fontSize: '1rem',
    },
    title: {
        fontSize: '2.5rem',
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
    },
    placeholderImage: {
        fontSize: '1.2rem',
        color: '#708090',
    },
    description: {
        fontSize: '1.1rem',
        color: '#708090',
        textAlign: 'center',
        maxWidth: '800px',
        marginBottom: '2rem',
        lineHeight: '1.6',
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

export default HowToPlay;
