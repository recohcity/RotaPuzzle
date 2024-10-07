import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';

// 定义常量（从 TestCurveCutting.js 复制）
const MIN_SCREEN_WIDTH = 320;
const MIN_SCREEN_HEIGHT = 480;
const MIN_SHAPE_DIAMETER = 200;
const MAX_SHAPE_DIAMETER = 400;
const MIN_SHAPE_AREA = Math.PI * Math.pow(MIN_SHAPE_DIAMETER / 2, 2);

function PolygonTest() {
    console.log("PolygonTest component rendered");
    const [rectangle, setRectangle] = useState(null);
    const [puzzle, setPuzzle] = useState(null);
    const [draggingPiece, setDraggingPiece] = useState(null);
    const canvasRef = useRef(null);
    const [rectangleArea, setRectangleArea] = useState(0);
    const [puzzleAreas, setPuzzleAreas] = useState([]);
    const [cutCount, setCutCount] = useState(3); // 默认切割次数改为3
    const [cutType, setCutType] = useState('straight'); // 'straight' or 'diagonal'
    const [isScattered, setIsScattered] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [completedPieces, setCompletedPieces] = useState([]);
    const [originalPositions, setOriginalPositions] = useState([]);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const [svgSize, setSvgSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [safeZone, setSafeZone] = useState(null);
    const [originalShape, setOriginalShape] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (originalShape) {
            drawPolygon(ctx, originalShape, 'black', 'rgba(200, 200, 200, 0.3)');
        }

        if (puzzle) {
            drawPuzzle(ctx, puzzle);
        }

    }, [originalShape, puzzle, showHint, selectedPiece, completedPieces]);

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

    // 生成多边形
    const generatePolygon = useCallback(() => {
        const numPoints = 5 + Math.floor(Math.random() * 5);
        const canvas = canvasRef.current;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.min(MAX_SHAPE_DIAMETER / 4, Math.min(canvas.width, canvas.height) / 5); // 进一步缩小比例
        const minRadius = MIN_SHAPE_DIAMETER / 4; // 缩小最小半径
        
        let points;
        let area;
        
        do {
            points = [];
            for (let i = 0; i < numPoints; i++) {
                const angle = (i / numPoints) * 2 * Math.PI;
                const r = minRadius + Math.random() * (maxRadius - minRadius);
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                points.push({ x, y });
            }
            area = calculatePolygonArea(points);
        } while (area < MIN_SHAPE_AREA / 16); // 调整最小面积

        setOriginalShape(points);
        setOriginalPositions([{ points, rotation: 0 }]);
        setPuzzle(null);
        setIsScattered(false);
        setCompletedPieces([]);
        setIsCompleted(false);
        setSelectedPiece(null);

        setRectangle(null);
        setRectangleArea(area);
        console.log(`多边形面积: ${area.toFixed(2)}`);

        const bounds = calculateBounds(points);
        const safeZone = createSafeZone(points, bounds);
        setSafeZone(safeZone);

        // 清除画布并重新绘制
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPolygon(ctx, points, 'black', 'rgba(200, 200, 200, 0.3)');
    }, []);

    // 生成切割线
    const generateCuts = useCallback((shape, count, type) => {
        const bounds = calculateBounds(shape);
        const cuts = [];
        const maxAttempts = 1000; // 增加最大尝试次数

        const maxCuts = type === 'straight' ? 5 : 5; // 限制最大切割线数量
        const actualCount = Math.min(count, maxCuts);

        for (let i = 0; i < actualCount; i++) {
            let cut;
            let attempts = 0;
            do {
                if (type === 'straight') {
                    cut = generateStraightCutLine(bounds);
                } else {
                    cut = generateDiagonalCutLine(bounds);
                }
                attempts++;
            } while (!isValidCut(cut, shape, cuts) && attempts < maxAttempts);

            if (attempts < maxAttempts) {
                cuts.push(cut);
            } else {
                console.log(`Failed to generate valid cut for cut ${i + 1}`);
                break;
            }
        }

        return cuts;
    }, []);

    // 生成直线切割线
    const generateStraightCutLine = (bounds) => {
        const isVertical = Math.random() < 0.5;
        if (isVertical) {
            const x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
            return { x1: x, y1: bounds.minY, x2: x, y2: bounds.maxY, type: 'straight' };
        } else {
            const y = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);
            return { x1: bounds.minX, y1: y, x2: bounds.maxX, y2: y, type: 'straight' };
        }
    };

    // 生成斜线切割线
    const generateDiagonalCutLine = (bounds) => {
        const extension = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) * 0.5;
        const centerX = (bounds.minX + bounds.maxX) / 2;
        const centerY = (bounds.minY + bounds.maxY) / 2;
        
        // 随机选择起点和终点
        const startAngle = Math.random() * 2 * Math.PI;
        const endAngle = startAngle + Math.PI + (Math.random() - 0.5) * Math.PI; // 确保终点在起点的大致对面

        const x1 = centerX + Math.cos(startAngle) * extension;
        const y1 = centerY + Math.sin(startAngle) * extension;
        const x2 = centerX + Math.cos(endAngle) * extension;
        const y2 = centerY + Math.sin(endAngle) * extension;

        return { x1, y1, x2, y2, type: 'diagonal' };
    };

    // 检查切割线是否有效
    const isValidCut = (cut, shape, existingCuts) => {
        // 检查是否与形状相交
        const intersections = doesCutIntersectShape(cut, shape);
        if (intersections < 2) return false;

        // 检查是否与现有切割线过于接近
        for (let existingCut of existingCuts) {
            if (cutsAreTooClose(cut, existingCut)) {
                return false;
            }
        }

        return true;
    };

    // 检查切割线是否太靠近
    const cutsAreTooClose = (cut1, cut2) => {
        const minDistance = 20; // 可以根据需要调整这个值
        const points = [
            {x: cut1.x1, y: cut1.y1},
            {x: cut1.x2, y: cut1.y2},
            {x: cut2.x1, y: cut2.y1},
            {x: cut2.x2, y: cut2.y2}
        ];

        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const dx = points[i].x - points[j].x;
                const dy = points[i].y - points[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < minDistance) {
                    return true;
                }
            }
        }

        return false;
    };

    const doesCutIntersectShape = (cut, shape) => {
        let intersections = 0;
        for (let i = 0; i < shape.length; i++) {
            const j = (i + 1) % shape.length;
            if (lineIntersection(
                { x: cut.x1, y: cut.y1 },
                { x: cut.x2, y: cut.y2 },
                shape[i],
                shape[j]
            )) {
                intersections++;
            }
        }
        return intersections;
    };

    const isCutTooCloseToEdge = (cut, shape) => {
        const minDistance = 10; // 可以根据需要调整
        for (let point of shape) {
            if (distanceToLine(point, cut) < minDistance) {
                return true;
            }
        }
        return false;
    };

    const distanceToLine = (point, lineStart, lineEnd) => {
        const A = point.x - lineStart.x;
        const B = point.y - lineStart.y;
        const C = lineEnd.x - lineStart.x;
        const D = lineEnd.y - lineStart.y;

        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;
        if (len_sq !== 0) {
            param = dot / len_sq;
        }

        let xx, yy;

        if (param < 0) {
            xx = lineStart.x;
            yy = lineStart.y;
        }
        else if (param > 1) {
            xx = lineEnd.x;
            yy = lineEnd.y;
        }
        else {
            xx = lineStart.x + param * C;
            yy = lineStart.y + param * D;
        }

        const dx = point.x - xx;
        const dy = point.y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    };

    // 生成拼图
    const generatePuzzle = useCallback(() => {
        if (!originalShape) return;

        const shape = [...originalShape];
        let validPuzzle = null;
        let attempts = 0;
        const maxAttempts = 1000;

        console.log("Generating puzzle. Original shape:", shape);

        while (!validPuzzle && attempts < maxAttempts) {
            const cuts = generateCuts(shape, cutCount, cutType);
            if (cuts.length < cutCount) {
                console.log("Not enough valid cuts generated, retrying...");
                attempts++;
                continue;
            }
            const newPuzzle = splitPolygon(shape, cuts);

            console.log(`Attempt ${attempts + 1}:`, { cuts, newPuzzle });

            if (newPuzzle.length > 1 && newPuzzle.every(isValidPiece)) {
                validPuzzle = newPuzzle;
                console.log("Valid puzzle found:", validPuzzle);
            }
            attempts++;
        }

        if (validPuzzle) {
            setPuzzle(validPuzzle.map(piece => ({ points: piece, rotation: 0 })));
            setOriginalPositions(validPuzzle.map(piece => ({ points: piece, rotation: 0 })));
            const areas = validPuzzle.map(piece => calculatePolygonArea(piece));
            setPuzzleAreas(areas);
            setIsScattered(false);
            setCompletedPieces([]);
            setIsCompleted(false);
            setSelectedPiece(null);

            console.log("Puzzle generation complete:", {
                pieceCount: validPuzzle.length,
                areas: areas.map(a => a.toFixed(2)),
                totalArea: areas.reduce((sum, area) => sum + area, 0).toFixed(2)
            });

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            drawPuzzle(ctx, validPuzzle.map(piece => ({ points: piece, rotation: 0 })));
        } else {
            console.error("Failed to generate valid puzzle after", maxAttempts, "attempts");
            alert("无法生成有效的拼图，请重试");
        }
    }, [originalShape, cutCount, cutType]);

    const isValidPiece = (piece) => {
        return piece.length >= 3 && calculatePolygonArea(piece) > MIN_SHAPE_AREA / 50;
    };

    const splitPolygon = (shape, cuts) => {
        console.log("Splitting polygon. Shape:", shape, "Cuts:", cuts);
        let pieces = [shape];
        cuts.forEach((cut, index) => {
            const newPieces = [];
            pieces.forEach(piece => {
                const splitResult = splitPiece(piece, cut);
                newPieces.push(...splitResult);
            });
            pieces = newPieces;
            console.log(`After cut ${index + 1}:`, pieces);
        });
        console.log("Final pieces after splitting:", pieces);
        return pieces.filter(piece => piece.length >= 3);
    };

    const splitPiece = (piece, cut) => {
        const intersections = [];
        for (let i = 0; i < piece.length; i++) {
            const j = (i + 1) % piece.length;
            const intersection = lineIntersection(
                { x: cut.x1, y: cut.y1 },
                { x: cut.x2, y: cut.y2 },
                piece[i],
                piece[j]
            );
            if (intersection) {
                intersections.push({ point: intersection, index: i });
            }
        }

        if (intersections.length !== 2) {
            return [piece];
        }

        intersections.sort((a, b) => a.index - b.index);
        const [int1, int2] = intersections;

        const piece1 = [
            ...piece.slice(0, int1.index + 1),
            int1.point,
            int2.point,
            ...piece.slice(int2.index + 1)
        ];

        const piece2 = [
            int1.point,
            ...piece.slice(int1.index + 1, int2.index + 1),
            int2.point
        ];

        return [piece1, piece2];
    };

    const drawRectangle = (ctx, rect) => {
        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.width, rect.height);
        ctx.strokeStyle = 'black';
        ctx.stroke();
    };

    // 绘制拼图
    const drawPuzzle = (ctx, pieces) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // 始终绘制原始多边形
        if (originalShape) {
            drawPolygon(ctx, originalShape, 'black', 'rgba(200, 200, 200, 0.3)');
        }

        // 绘制拼图块
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

    // 绘制单个拼图块
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
        
        if (!isCompleted) {
            ctx.strokeStyle = 'black';
            if (selectedPiece === index) {
                ctx.setLineDash([5, 5]); // 设置虚线样式
            } else {
                ctx.setLineDash([]); // 重置为实线
            }
            ctx.stroke();
            ctx.setLineDash([]); // 重置为实线，避免影响其他绘制
        }

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

    // 绘制完成效果
    const drawCompletionEffect = (ctx) => {
        if (!originalShape) return;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(originalShape[0].x, originalShape[0].y);
        for (let i = 1; i < originalShape.length; i++) {
            ctx.lineTo(originalShape[i].x, originalShape[i].y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'gold';
        ctx.lineWidth = 5;
        ctx.stroke();

        const bounds = calculateBounds(originalShape);
        ctx.font = '24px Arial';
        ctx.fillStyle = 'gold';
        ctx.fillText('完成！', bounds.minX + (bounds.maxX - bounds.minX) / 2 - 30, bounds.minY - 20);
        ctx.restore();
        
        console.log("完成效果已绘制");
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

    // 处理鼠标按下事件
    const handleMouseDown = (e) => {
        if (!puzzle) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ctx = canvas.getContext('2d');

        let clickedPieceIndex = -1;
        for (let i = 0; i < puzzle.length; i++) {
            if (isPointNearPiece(x, y, puzzle[i])) {
                clickedPieceIndex = i;
                break;
            }
        }

        if (clickedPieceIndex !== -1) {
            setSelectedPiece(clickedPieceIndex);
            setDraggingPiece({ index: clickedPieceIndex, startX: x, startY: y });
        } else {
            setSelectedPiece(null);
        }

        drawPuzzle(ctx, puzzle);
    };

    // 处理鼠标移动事件
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

    // 处理鼠标松开事件
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

    // 检查拼图是否完成
    const checkCompletion = (currentPuzzle) => {
        if (!originalPositions[0] || !currentPuzzle) return;

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

    // 散开拼图
    const scatterPuzzle = () => {
        if (!puzzle) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const bounds = calculateBounds(originalShape);
        const centerX = (bounds.minX + bounds.maxX) / 2;
        const centerY = (bounds.minY + bounds.maxY) / 2;
        const maxDimension = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);

        const margin = maxDimension;
        const scatterAreaWidth = canvasWidth - 2 * margin;
        const scatterAreaHeight = canvasHeight - 2 * margin;

        const scatteredPuzzle = [];
        const occupiedAreas = [];

        for (let piece of puzzle) {
            let newPiece;
            let attempts = 0;
            const maxAttempts = 200;
            let newCenterX, newCenterY;

            do {
                const angle = Math.random() * 2 * Math.PI;
                const distance = Math.random() * Math.min(scatterAreaWidth, scatterAreaHeight) * 0.4 + maxDimension;
                
                newCenterX = centerX + distance * Math.cos(angle);
                newCenterY = centerY + distance * Math.sin(angle);

                newCenterX = Math.max(margin, Math.min(newCenterX, canvasWidth - margin));
                newCenterY = Math.max(margin, Math.min(newCenterY, canvasHeight - margin));

                const pieceCenter = piece.points.reduce((acc, point) => ({
                    x: acc.x + point.x / piece.points.length,
                    y: acc.y + point.y / piece.points.length
                }), { x: 0, y: 0 });

                const randomRotation = Math.floor(Math.random() * 8) * 45;
                newPiece = {
                    points: piece.points.map(point => ({
                        x: point.x - pieceCenter.x + newCenterX,
                        y: point.y - pieceCenter.y + newCenterY
                    })),
                    rotation: randomRotation
                };

                attempts++;
            } while ((isOverlapping(newPiece, occupiedAreas) || 
                      isPointInPolygon({x: newCenterX, y: newCenterY}, originalShape)) && 
                     attempts < maxAttempts);

            if (attempts < maxAttempts) {
                scatteredPuzzle.push(newPiece);
                occupiedAreas.push(calculateBounds(newPiece.points));
            } else {
                console.log("Failed to place piece after maximum attempts");
            }
        }

        setPuzzle(scatteredPuzzle);
        setIsScattered(true);
        setCompletedPieces([]);
        setIsCompleted(false);
        setSelectedPiece(null);

        drawPuzzle(ctx, scatteredPuzzle);
    };

    const isOverlapping = (piece, occupiedAreas) => {
        const pieceBounds = calculateBounds(piece.points);
        for (let area of occupiedAreas) {
            if (boundsOverlap(pieceBounds, area, 10)) { // 添加10像素的缓冲区
                return true;
            }
        }
        return false;
    };

    const boundsOverlap = (bounds1, bounds2, buffer = 0) => {
        return !(bounds1.maxX + buffer < bounds2.minX || 
                 bounds1.minX - buffer > bounds2.maxX || 
                 bounds1.maxY + buffer < bounds2.minY || 
                 bounds1.minY - buffer > bounds2.maxY);
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

    // 显示提示轮廓
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

    // 旋转拼图
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

    // 添加新的辅助函数
    const calculateBounds = (points) => {
        const xs = points.map(p => p.x);
        const ys = points.map(p => p.y);
        return {
            minX: Math.min(...xs),
            maxX: Math.max(...xs),
            minY: Math.min(...ys),
            maxY: Math.max(...ys)
        };
    };

    const createSafeZone = (shape, bounds) => {
        const centerX = (bounds.minX + bounds.maxX) / 2;
        const centerY = (bounds.minY + bounds.maxY) / 2;
        return shape.map(point => ({
            x: (point.x - centerX) * 0.25 + centerX,
            y: (point.y - centerY) * 0.25 + centerY
        }));
    };

    // 修改绘制函数以支持多边形
    const drawPolygon = (ctx, points, stroke, fill = 'none') => {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.stroke();
    };

    // 添加缺失的函数
    const generateLongerCutLine = (bounds) => {
        const extension = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) * 0.5;
        const centerX = (bounds.minX + bounds.maxX) / 2;
        const centerY = (bounds.minY + bounds.maxY) / 2;
        const angle = Math.random() * 2 * Math.PI;
        const x1 = centerX + Math.cos(angle) * extension;
        const y1 = centerY + Math.sin(angle) * extension;
        const x2 = centerX - Math.cos(angle) * extension;
        const y2 = centerY - Math.sin(angle) * extension;
        return { x1, y1, x2, y2 };
    };

    const generateCurveCutLine = (bounds) => {
        const extension = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) * 0.5;
        const x1 = bounds.minX - extension + Math.random() * (bounds.maxX - bounds.minX + 2 * extension);
        const y1 = bounds.minY - extension + Math.random() * (bounds.maxY - bounds.minY + 2 * extension);
        const x2 = bounds.minX - extension + Math.random() * (bounds.maxX - bounds.minX + 2 * extension);
        const y2 = bounds.minY - extension + Math.random() * (bounds.maxY - bounds.minY + 2 * extension);
        
        const maxControlOffset = extension * 0.8;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const perpX = -dy;
        const perpY = dx;
        const length = Math.sqrt(perpX * perpX + perpY * perpY);
        const normalizedPerpX = perpX / length;
        const normalizedPerpY = perpY / length;
        const offset = (Math.random() - 0.5) * maxControlOffset;
        const cx1 = midX + normalizedPerpX * offset;
        const cy1 = midY + normalizedPerpY * offset;
        const cx2 = cx1;
        const cy2 = cy1;

        return { x1, y1, x2, y2, cx1, cy1, cx2, cy2 };
    };

    // 添加缺失的辅助函数
    const isValidCutLine = (cut, shape, bounds) => {
        // 简单的实现，可以根据需要进行调整
        return true;
    };

    // 添加 intersectsSafeZone 函数
    const intersectsSafeZone = (cut, safeZone) => {
        if (cut.type === 'straight') {
            return doLinesIntersect(cut.x1, cut.y1, cut.x2, cut.y2, safeZone);
        } else {
            // 对于曲线，我们可以简化为检查起点和终点
            return (
                isPointInPolygon({ x: cut.x1, y: cut.y1 }, safeZone) ||
                isPointInPolygon({ x: cut.x2, y: cut.y2 }, safeZone)
            );
        }
    };

    const doLinesIntersect = (x1, y1, x2, y2, polygon) => {
        for (let i = 0; i < polygon.length; i++) {
            const j = (i + 1) % polygon.length;
            if (lineIntersection(
                { x: x1, y: y1 },
                { x: x2, y: y2 },
                polygon[i],
                polygon[j]
            )) {
                return true;
            }
        }
        return false;
    };

    const isPointInPolygon = (point, polygon) => {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x, yi = polygon[i].y;
            const xj = polygon[j].x, yj = polygon[j].y;
            
            const intersect = ((yi > point.y) !== (yj > point.y))
                && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    };

    // 新增函数：检查点是否靠近拼图
    const isPointNearPiece = (x, y, piece) => {
        const bounds = calculateBounds(piece.points);
        const buffer = 10; // 增加响应区域

        if (x >= bounds.minX - buffer && x <= bounds.maxX + buffer &&
            y >= bounds.minY - buffer && y <= bounds.maxY + buffer) {
            // 如果点在拼图的边界框内（包括缓冲区），进行更精确的检查
            return isPointInPolygon({x, y}, piece.points) || 
                   isPointNearPolygonEdge(x, y, piece.points, buffer);
        }
        return false;
    };

    // 新增函数：检查点是否靠近多边形边缘
    const isPointNearPolygonEdge = (x, y, points, buffer) => {
        for (let i = 0; i < points.length; i++) {
            const j = (i + 1) % points.length;
            if (distanceToLine({x, y}, points[i], points[j]) <= buffer) {
                return true;
            }
        }
        return false;
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>多边形拼图生成</h1>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={generatePolygon} style={{ marginRight: '10px' }}>生成多边形</button>
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
                    max="5" // 将最大值改为5
                    value={cutCount} 
                    onChange={(e) => setCutCount(parseInt(e.target.value))} 
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    <input 
                        type="radio" 
                        id="straightCut"
                        name="cutType"
                        value="straight" 
                        checked={cutType === 'straight'} 
                        onChange={() => setCutType('straight')} 
                    />
                    直线切割
                </label>
                <label style={{ marginLeft: '10px' }}>
                    <input 
                        type="radio" 
                        id="diagonalCut"
                        name="cutType"
                        value="diagonal" 
                        checked={cutType === 'diagonal'} 
                        onChange={() => setCutType('diagonal')} 
                    />
                    斜线切割
                </label>
            </div>
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


// 在 PolygonTest.js 文件的末尾
export default PolygonTest;