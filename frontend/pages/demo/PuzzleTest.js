import React, { useState, useEffect, useRef } from 'react';

function PuzzleTest() {
    const [rectangle, setRectangle] = useState(null);
    const [puzzle, setPuzzle] = useState(null);
    const [draggingPiece, setDraggingPiece] = useState(null);
    const canvasRef = useRef(null);
    const [rectangleArea, setRectangleArea] = useState(0);
    const [puzzleAreas, setPuzzleAreas] = useState([]);
    const [cutCount, setCutCount] = useState(2);
    const [cutType, setCutType] = useState('straight'); // 'straight' or 'diagonal'
    const [isScattered, setIsScattered] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [completedPieces, setCompletedPieces] = useState([]);
    const [originalPositions, setOriginalPositions] = useState([]);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (rectangle) {
            drawRectangle(ctx, rectangle);
        }

        if (puzzle) {
            drawPuzzle(ctx, puzzle);
        }

    }, [rectangle, puzzle, showHint, selectedPiece, completedPieces]);

    const generateRectangle = () => {
        const width = 200;
        const height = 100;
        const x = 400; // 居中
        const y = 200; // 居中
        const newRectangle = { x, y, width, height };
        setRectangle(newRectangle);
        setPuzzle(null);
        const area = width * height;
        setRectangleArea(area);
        console.log(`长方形面积: ${area.toFixed(2)}`);
    };

    const generatePuzzle = () => {
        if (!rectangle) return;

        const { x, y, width, height } = rectangle;
        const minAreaThreshold = rectangleArea * 0.1; // 设置最小面积阈值为总面积的10%
        let validPuzzle = null;
        let attempts = 0;
        const maxAttempts = 50;

        while (!validPuzzle && attempts < maxAttempts) {
            const cuts = generateCuts(x, y, width, height, cutCount, cutType);
            const newPuzzle = splitRectangle(x, y, width, height, cuts);
            
            // 检查是否所有拼图块都大于最小面积阈值
            const isValid = newPuzzle.every(piece => calculatePolygonArea(piece) >= minAreaThreshold);
            
            if (isValid) {
                validPuzzle = newPuzzle;
            }
            
            attempts++;
        }

        if (validPuzzle) {
            const puzzleWithRotation = validPuzzle.map(piece => ({
                points: piece,
                rotation: 0
            }));
            setPuzzle(puzzleWithRotation);
            setOriginalPositions(puzzleWithRotation);
            const areas = validPuzzle.map(piece => calculatePolygonArea(piece));
            setPuzzleAreas(areas);
            setIsScattered(false); // 重置散开状态
            setCompletedPieces([]); // 重置完成的拼图
            setIsCompleted(false); // 重置完成状态

            console.log(`分割拼图数量: ${areas.length}`);
            console.log(`每块拼图面积: ${areas.map(a => a.toFixed(2)).join(', ')}`);
            console.log(`所有拼图面积之和: ${areas.reduce((sum, area) => sum + area, 0).toFixed(2)}`);
            console.log(`面积差异: ${Math.abs(rectangleArea - areas.reduce((sum, area) => sum + area, 0)).toFixed(2)}`);
        } else {
            console.log("无法生成有效的拼图，请重试");
        }
    };

    const generateCuts = (x, y, width, height, count, type) => {
        const cuts = [];
        const safetyMargin = Math.min(width, height) * 0.1;

        // 定义安全区
        const safeZone = {
            x: x + width * 0.375,
            y: y + height * 0.375,
            width: width * 0.25,
            height: height * 0.25
        };

        for (let i = 0; i < count; i++) {
            let cut;
            if (type === 'straight') {
                // 保持直线切割的逻辑不变
                const isVertical = Math.random() < 0.5;
                if (isVertical) {
                    cut = {
                        type: 'straight',
                        isVertical: true,
                        position: x + safetyMargin + Math.random() * (width - 2 * safetyMargin)
                    };
                } else {
                    cut = {
                        type: 'straight',
                        isVertical: false,
                        position: y + safetyMargin + Math.random() * (height - 2 * safetyMargin)
                    };
                }
            } else {
                // 改进斜线切割的生成
                let start, end, intersectsOrTouchesSafeZone;
                do {
                    const startSide = Math.floor(Math.random() * 4);
                    const endSide = (startSide + 1 + Math.floor(Math.random() * 2)) % 4;
                    
                    switch (startSide) {
                        case 0: start = {x: x + Math.random() * width, y: y}; break; // 上边
                        case 1: start = {x: x + width, y: y + Math.random() * height}; break; // 边
                        case 2: start = {x: x + Math.random() * width, y: y + height}; break; // 下边
                        case 3: start = {x: x, y: y + Math.random() * height}; break; // 左边
                    }
                    switch (endSide) {
                        case 0: end = {x: x + Math.random() * width, y: y}; break;
                        case 1: end = {x: x + width, y: y + Math.random() * height}; break;
                        case 2: end = {x: x + Math.random() * width, y: y + height}; break;
                        case 3: end = {x: x, y: y + Math.random() * height}; break;
                    }

                    // 检查线段是否与安全区交或接触
                    intersectsOrTouchesSafeZone = lineIntersectsOrTouchesRectangle(start, end, safeZone);
                } while (!intersectsOrTouchesSafeZone);

                cut = {
                    type: 'diagonal',
                    start: start,
                    end: end
                };
            }
            cuts.push(cut);
        }

        return cuts;
    };

    const splitRectangle = (x, y, width, height, cuts) => {
        let pieces = [[
            { x, y },
            { x: x + width, y },
            { x: x + width, y: y + height },
            { x, y: y + height }
        ]];

        const minAreaThreshold = width * height * 0.1; // 最小面积阈值

        cuts.forEach(cut => {
            const newPieces = [];
            pieces.forEach(piece => {
                const splitResult = splitPiece(piece, cut);
                if (splitResult.length === 2) {
                    // 检查割后的两个片段是否都大于最小面积阈值
                    if (calculatePolygonArea(splitResult[0]) >= minAreaThreshold &&
                        calculatePolygonArea(splitResult[1]) >= minAreaThreshold) {
                        newPieces.push(...splitResult);
                    } else {
                        newPieces.push(piece); // 如果有一个太小，保留原始片段
                    }
                } else {
                    newPieces.push(piece);
                }
            });
            pieces = newPieces;
        });

        return pieces;
    };

    const splitPiece = (piece, cut) => {
        if (cut.type === 'straight') {
            return splitPieceStraight(piece, cut);
        } else {
            return splitPieceDiagonal(piece, cut);
        }
    };

    const splitPieceStraight = (piece, cut) => {
        if (cut.isVertical) {
            if (cut.position <= piece[0].x || cut.position >= piece[2].x) {
                return [piece];
            }
            return [
                [
                    { x: piece[0].x, y: piece[0].y },
                    { x: cut.position, y: piece[0].y },
                    { x: cut.position, y: piece[2].y },
                    { x: piece[0].x, y: piece[2].y }
                ],
                [
                    { x: cut.position, y: piece[0].y },
                    { x: piece[1].x, y: piece[1].y },
                    { x: piece[2].x, y: piece[2].y },
                    { x: cut.position, y: piece[2].y }
                ]
            ];
        } else {
            if (cut.position <= piece[0].y || cut.position >= piece[2].y) {
                return [piece];
            }
            return [
                [
                    { x: piece[0].x, y: piece[0].y },
                    { x: piece[1].x, y: piece[1].y },
                    { x: piece[1].x, y: cut.position },
                    { x: piece[0].x, y: cut.position }
                ],
                [
                    { x: piece[0].x, y: cut.position },
                    { x: piece[1].x, y: cut.position },
                    { x: piece[2].x, y: piece[2].y },
                    { x: piece[3].x, y: piece[3].y }
                ]
            ];
        }
    };

    const splitPieceDiagonal = (piece, cut) => {
        const { start, end } = cut;
        const intersections = [];
        
        for (let i = 0; i < piece.length; i++) {
            const p1 = piece[i];
            const p2 = piece[(i + 1) % piece.length];
            const intersection = lineIntersection(p1, p2, start, end);
            if (intersection) {
                intersections.push(intersection);
            }
        }

        if (intersections.length >= 2) {
            // 保交点是唯一的
            const uniqueIntersections = intersections.filter((v, i, a) => a.findIndex(t => t.x === v.x && t.y === v.y) === i);
            
            if (uniqueIntersections.length >= 2) {
                const [int1, int2] = uniqueIntersections;
                const leftPiece = [];
                const rightPiece = [];
                let isLeft = true;

                for (let i = 0; i < piece.length; i++) {
                    const point = piece[i];
                    if (isPointOnLeftSide(point, start, end)) {
                        leftPiece.push(point);
                    } else {
                        rightPiece.push(point);
                    }
                    
                    // 检查是否需要添加交点
                    const nextPoint = piece[(i + 1) % piece.length];
                    if (isPointOnLeftSide(point, start, end) !== isPointOnLeftSide(nextPoint, start, end)) {
                        leftPiece.push(int1.x === int2.x && int1.y === int2.y ? int1 : (isLeft ? int1 : int2));
                        rightPiece.push(int1.x === int2.x && int1.y === int2.y ? int1 : (isLeft ? int1 : int2));
                        isLeft = !isLeft;
                    }
                }

                return [leftPiece, rightPiece];
            }
        }
        return [piece];
    };

    const drawRectangle = (ctx, rect) => {
        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.width, rect.height);
        ctx.strokeStyle = 'black';
        ctx.stroke();
    };

    const drawPuzzle = (ctx, pieces) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // 绘制散开拼图的放置区域
        ctx.beginPath();
        ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.rect(rectangle.x - 10, rectangle.y - 10, rectangle.width + 20, rectangle.height + 20);
        ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
        ctx.fill('evenodd');

        if (rectangle) {
            drawRectangle(ctx, rectangle);
        }

        // 绘制所有拼图
        pieces.forEach((piece, index) => {
            drawPiece(ctx, piece, index, completedPieces.includes(index));
        });

        // 绘制正在拖动的拼图（如有）
        if (draggingPiece !== null) {
            drawPiece(ctx, pieces[draggingPiece.index], draggingPiece.index, false);
        }

        // 绘制完成效果
        if (isCompleted) {
            drawCompletionEffect(ctx);
        }

        // 绘制选中拼图的提示轮廓
        if (showHint && selectedPiece !== null && !completedPieces.includes(selectedPiece)) {
            drawHintOutline(ctx);
        }
    };

    const drawPiece = (ctx, piece, index, isCompleted = false) => {
        ctx.save();
        const center = piece.points.reduce((acc, point) => ({
            x: acc.x + point.x / piece.points.length,
            y: acc.y + point.y / piece.points.length
        }), { x: 0, y: 0 });

        ctx.translate(center.x, center.y);
        ctx.rotate(piece.rotation * Math.PI / 180);
        ctx.translate(-center.x, -center.y);

        ctx.beginPath();
        ctx.moveTo(piece.points[0].x, piece.points[0].y);
        for (let i = 1; i < piece.points.length; i++) {
            ctx.lineTo(piece.points[i].x, piece.points[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = isCompleted ? 'skyblue' : ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98FB98'][index % 5];
        ctx.fill();
        
        ctx.strokeStyle = 'black';
        if (selectedPiece === index && !isCompleted) {
            ctx.setLineDash([5, 5]);
        } else {
            ctx.setLineDash([]);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.restore();

        // 存储路径
        const path = new Path2D();
        ctx.save();
        ctx.translate(center.x, center.y);
        ctx.rotate(piece.rotation * Math.PI / 180);
        ctx.translate(-center.x, -center.y);
        path.moveTo(piece.points[0].x, piece.points[0].y);
        for (let i = 1; i < piece.points.length; i++) {
            path.lineTo(piece.points[i].x, piece.points[i].y);
        }
        ctx.restore();
        path.closePath();
        piece.path = path;
    };

    const drawCompletionEffect = (ctx) => {
        ctx.save();
        ctx.beginPath();
        ctx.rect(rectangle.x - 5, rectangle.y - 5, rectangle.width + 10, rectangle.height + 10);
        ctx.strokeStyle = 'gold';
        ctx.lineWidth = 5;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.rect(rectangle.x - 10, rectangle.y - 10, rectangle.width + 20, rectangle.height + 20);
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.font = '24px Arial';
        ctx.fillStyle = 'brown';
        ctx.fillText('完成！', rectangle.x + rectangle.width / 2 - 30, rectangle.y - 20);
        ctx.restore();
        
        console.log("完成效果已绘制");
        
        // 移除重复的弹窗提示
        // setTimeout(() => alert("恭喜！图已完成！"), 100);
    };

    const calculatePolygonArea = (vertices) => {
        let area = 0;
        for (let i = 0; i < vertices.length; i++) {
            let j = (i + 1) % vertices.length;
            area += vertices[i].x * vertices[j].y;
            area -= vertices[j].x * vertices[i].y;
        }
        return Math.abs(area / 2);
    };

    const handleMouseDown = (e) => {
        if (!puzzle) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ctx = canvas.getContext('2d');

        let clickedPieceIndex = -1;
        for (let i = 0; i < puzzle.length; i++) {
            if (ctx.isPointInPath(puzzle[i].path, x, y)) {
                clickedPieceIndex = i;
                break;
            }
        }

        if (clickedPieceIndex !== -1) {
            // 设置选中的拼图
            setSelectedPiece(clickedPieceIndex);
            // 开始拖动
            setDraggingPiece({ index: clickedPieceIndex, startX: x, startY: y });
        } else {
            // 点击空白区域，取消选中
            setSelectedPiece(null);
        }

        // 重绘图以新选中态的显示
        drawPuzzle(ctx, puzzle);
    };

    const handleMouseMove = (e) => {
        if (!draggingPiece || !puzzle) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dx = x - draggingPiece.startX;
        const dy = y - draggingPiece.startY;

        const newPuzzle = puzzle.map((piece, index) => {
            if (index === draggingPiece.index) {
                return {
                    points: piece.points.map(point => ({ x: point.x + dx, y: point.y + dy })),
                    rotation: piece.rotation
                };
            }
            return piece;
        });

        setPuzzle(newPuzzle);
        setDraggingPiece({ ...draggingPiece, startX: x, startY: y });
    };

    const handleMouseUp = () => {
        if (draggingPiece && puzzle) {
            const newPuzzle = [...puzzle];
            const piece = newPuzzle[draggingPiece.index];
            const originalPiece = originalPositions[draggingPiece.index];

            const isNearOriginal = piece.points.every((point, i) => {
                const originalPoint = originalPiece.points[i];
                return Math.abs(point.x - originalPoint.x) < 30 && Math.abs(point.y - originalPoint.y) < 30;
            });

            if (isNearOriginal && piece.rotation % 360 === 0) {
                newPuzzle[draggingPiece.index] = {
                    points: originalPiece.points,
                    rotation: 0
                };
                console.log("磁吸效果触发");
                if (!completedPieces.includes(draggingPiece.index)) {
                    setCompletedPieces([...completedPieces, draggingPiece.index]);
                }
            }

            setPuzzle(newPuzzle);
            checkCompletion(newPuzzle);
        }
        setDraggingPiece(null);
    };

    const checkCompletion = (currentPuzzle) => {
        if (!rectangle || !currentPuzzle) return;

        const isCompleted = currentPuzzle.every((piece, index) => {
            return piece.rotation % 360 === 0 && piece.points.every((point, i) => {
                const originalPoint = originalPositions[index].points[i];
                return Math.abs(point.x - originalPoint.x) < 1 && Math.abs(point.y - originalPoint.y) < 1;
            });
        });

        setIsCompleted(isCompleted);
        console.log("拼图完成状态:", isCompleted);

        if (isCompleted) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            drawCompletionEffect(ctx);
        }
    };

    const scatterPuzzle = () => {
        if (!puzzle) return;

        const canvas = canvasRef.current;
        const scatteredPuzzle = puzzle.map((piece, index) => {
            // 计算新的位置，避免遮挡长方形
            const angle = (index / puzzle.length) * 2 * Math.PI;
            const distance = Math.max(rectangle.width, rectangle.height) * 1.2; // 增加距离
            const centerX = rectangle.x + rectangle.width / 2;
            const centerY = rectangle.y + rectangle.height / 2;
            let newCenterX = centerX + distance * Math.cos(angle);
            let newCenterY = centerY + distance * Math.sin(angle);

            // 确���拼图不会超出画布边界
            newCenterX = Math.max(50, Math.min(newCenterX, canvas.width - 50));
            newCenterY = Math.max(50, Math.min(newCenterY, canvas.height - 50));

            // 移动拼图块
            const pieceCenter = piece.points.reduce((acc, point) => ({
                x: acc.x + point.x / piece.points.length,
                y: acc.y + point.y / piece.points.length
            }), { x: 0, y: 0 });

            const randomRotation = Math.floor(Math.random() * 8) * 45; // 随机旋转 0, 45, 90, ..., 315 度
            return {
                points: piece.points.map(point => ({
                    x: point.x - pieceCenter.x + newCenterX,
                    y: point.y - pieceCenter.y + newCenterY
                })),
                rotation: randomRotation
            };
        });

        setPuzzle(scatteredPuzzle);
        setIsScattered(true);
        setCompletedPieces([]);
        setIsCompleted(false);
    };

    const drawHintOutline = (ctx) => {
        if (originalPositions.length > 0 && selectedPiece !== null) {
            ctx.save();
            ctx.strokeStyle = 'green';
            ctx.setLineDash([5, 5]);
            const piece = originalPositions[selectedPiece];
            ctx.beginPath();
            ctx.moveTo(piece.points[0].x, piece.points[0].y);
            piece.points.forEach(point => ctx.lineTo(point.x, point.y));
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
            console.log("提示轮廓已绘制");
        }
    };

    const showHintOutline = () => {
        if (selectedPiece !== null && !completedPieces.includes(selectedPiece)) {
            console.log("显示选中拼图提示轮廓");
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            drawHintOutline(ctx);
            setTimeout(() => {
                console.log("隐藏提示轮廓");
                drawPuzzle(ctx, puzzle); // 重新绘制拼图，清除提示轮廓
            }, 1500);
        }
    };

    const rotatePiece = (clockwise) => {
        if (selectedPiece !== null) {
            const newPuzzle = [...puzzle];
            const piece = newPuzzle[selectedPiece];
            piece.rotation += clockwise ? 45 : -45;
            setPuzzle(newPuzzle);
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            drawPuzzle(ctx, newPuzzle);
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>拼图生成演示</h1>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={generateRectangle} style={{ marginRight: '10px' }}>生成长方形</button>
                <button onClick={generatePuzzle} style={{ marginRight: '10px' }}>生成拼图</button>
                <button onClick={scatterPuzzle} disabled={!puzzle || isScattered}>
                    {isScattered ? "拼图已散开" : "散开拼图"}
                </button>
                <button onClick={showHintOutline} disabled={!isScattered || selectedPiece === null || completedPieces.includes(selectedPiece)}>提示选中</button>
                <button onClick={() => rotatePiece(true)} disabled={selectedPiece === null}>顺时针旋转</button>
                <button onClick={() => rotatePiece(false)} disabled={selectedPiece === null}>逆时针旋转</button>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="cutCount">切割次数: {cutCount}</label>
                <input 
                    type="range" 
                    id="cutCount" 
                    min="1" 
                    max="10" 
                    value={cutCount} 
                    onChange={(e) => setCutCount(parseInt(e.target.value))} 
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    <input 
                        type="radio" 
                        value="straight" 
                        checked={cutType === 'straight'} 
                        onChange={() => setCutType('straight')} 
                    />
                    直线切割
                </label>
                <label style={{ marginLeft: '10px' }}>
                    <input 
                        type="radio" 
                        value="diagonal" 
                        checked={cutType === 'diagonal'} 
                        onChange={() => setCutType('diagonal')} 
                    />
                    斜线切割
                </label>
            </div>
            {/* 移除显示区域，但保留数据 */}
            <canvas 
                ref={canvasRef}
                width={1000}
                height={600}
                style={{ border: '1px solid black' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            ></canvas>
        </div>
    );
}

// 在 PuzzleTest 函数外部添加这些辅助函数
const lineIntersection = (p1, p2, p3, p4) => {
    const x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y;
    const x3 = p3.x, y3 = p3.y, x4 = p4.x, y4 = p4.y;
    
    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom === 0) return null; // 平行线

    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return null; // 交点不在线段上

    return {
        x: x1 + ua * (x2 - x1),
        y: y1 + ua * (y2 - y1)
    };
};

// 辅助函数：判断点是否在线的左侧
const isPointOnLeftSide = (point, lineStart, lineEnd) => {
    return ((lineEnd.x - lineStart.x) * (point.y - lineStart.y) - 
            (lineEnd.y - lineStart.y) * (point.x - lineStart.x)) > 0;
};

// 在 PuzzleTest 函数外部添加这个新的辅助函数
const lineIntersectsOrTouchesRectangle = (lineStart, lineEnd, rect) => {
    // 检查线段是否与矩形的四条边相交
    const rectLines = [
        {start: {x: rect.x, y: rect.y}, end: {x: rect.x + rect.width, y: rect.y}},
        {start: {x: rect.x + rect.width, y: rect.y}, end: {x: rect.x + rect.width, y: rect.y + rect.height}},
        {start: {x: rect.x + rect.width, y: rect.y + rect.height}, end: {x: rect.x, y: rect.y + rect.height}},
        {start: {x: rect.x, y: rect.y + rect.height}, end: {x: rect.x, y: rect.y}}
    ];

    for (const rectLine of rectLines) {
        if (lineIntersection(lineStart, lineEnd, rectLine.start, rectLine.end)) {
            return true;
        }
    }

    // 检查线段的端点是否在矩形内部或边上
    const isPointInOrOnRect = (point) => 
        point.x >= rect.x && point.x <= rect.x + rect.width &&
        point.y >= rect.y && point.y <= rect.y + rect.height;

    return isPointInOrOnRect(lineStart) || isPointInOrOnRect(lineEnd);
};

export default PuzzleTest;