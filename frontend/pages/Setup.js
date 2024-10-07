import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Setup = () => {
    const [levelCount, setLevelCount] = useState(10);
    const [difficulty, setDifficulty] = useState('初级');
    const [language, setLanguage] = useState('en');
    const navigate = useNavigate();

    const handleSave = () => {
        // 这里可以添加保存设置的逻辑
        console.log('Settings saved:', { levelCount, difficulty, language });
        navigate('/'); // 保存后返回主页
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>RotaPuzzle Game Setup</h1>
            <div style={styles.setupForm}>
                <div style={styles.formGroup}>
                    <label htmlFor="level-count" style={styles.label}>关卡数设置 (1-30):</label>
                    <input 
                        type="number" 
                        id="level-count" 
                        name="level-count" 
                        min="1" 
                        max="30" 
                        value={levelCount}
                        onChange={(e) => setLevelCount(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>难度设置:</label>
                    <div style={styles.difficultyButtons}>
                        {['初级', '中级', '高级'].map((level) => (
                            <button 
                                key={level}
                                onClick={() => setDifficulty(level)}
                                style={{
                                    ...styles.difficultyBtn,
                                    ...(difficulty === level ? styles.activeDifficultyBtn : {})
                                }}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="language" style={styles.label}>语言选择:</label>
                    <select 
                        id="language" 
                        name="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={styles.select}
                    >
                        <option value="en">English</option>
                        <option value="zh-CN">简体中文</option>
                        <option value="zh-TW">繁体中文</option>
                        <option value="ja">日本語</option>
                        <option value="ko">한국어</option>
                        <option value="fr">Français</option>
                        <option value="es">Español</option>
                    </select>
                </div>
                <button onClick={handleSave} style={styles.saveBtn}>保存设置</button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E6E2DD',
        fontFamily: '"Comic Sans MS", cursive, sans-serif',
        color: '#4A4A4A',
        overflow: 'hidden',
    },
    title: {
        fontSize: '3rem',
        marginBottom: '2rem',
        color: '#A78A7F',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    },
    setupForm: {
        backgroundColor: '#F0E9E4',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '600px',
    },
    formGroup: {
        marginBottom: '1.5rem',
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        fontSize: '1.2rem',
        color: '#7D6E83',
    },
    input: {
        width: '100%',
        padding: '0.5rem',
        fontSize: '1rem',
        border: '2px solid #D5CAD0',
        borderRadius: '10px',
        backgroundColor: '#FFFFFF',
        color: '#4A4A4A',
        fontFamily: 'inherit',
    },
    select: {
        width: '100%',
        padding: '0.5rem',
        fontSize: '1rem',
        border: '2px solid #D5CAD0',
        borderRadius: '10px',
        backgroundColor: '#FFFFFF',
        color: '#4A4A4A',
        fontFamily: 'inherit',
    },
    difficultyButtons: {
        display: 'flex',
        gap: '1rem',
    },
    difficultyBtn: {
        flex: 1,
        padding: '0.5rem',
        fontSize: '1rem',
        border: '2px solid #D0B8A8',
        borderRadius: '10px',
        backgroundColor: '#FFFFFF',
        color: '#4A4A4A',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    activeDifficultyBtn: {
        backgroundColor: '#D0B8A8',
        color: '#FFFFFF',
    },
    saveBtn: {
        display: 'block',
        width: '100%',
        padding: '1rem',
        fontSize: '1.2rem',
        border: 'none',
        borderRadius: '10px',
        backgroundColor: '#A78A7F',
        color: '#FFFFFF',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        marginTop: '1.5rem',
    },
};

export default Setup;