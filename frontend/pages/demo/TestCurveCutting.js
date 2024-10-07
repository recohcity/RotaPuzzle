import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { debounce } from 'lodash';

// 定义常量
const MIN_SCREEN_WIDTH = 320;  // 最小屏幕宽度
const MIN_SCREEN_HEIGHT = 480; // 最小屏幕高度
const MIN_SHAPE_DIAMETER = 200; // 最小形状直径
const MAX_SHAPE_DIAMETER = 400; // 最大形状直径
const MIN_SHAPE_AREA = Math.PI * Math.pow(MIN_SHAPE_DIAMETER / 2, 2); // 最小形状面积

const TestShapeGeneration = () => {
    // 状态定义
    const [targetShape, setTargetShape] = useState(null); // 目标形状
    const [cutLine, setCutLine] = useState(null); // 修改：只存储一条切割线
    const [intersections, setIntersections] = useState([]); // 交点
    const [svgSize, setSvgSize] = useState({ width: window.innerWidth, height: window.innerHeight }); // SVG尺寸
    const [safeZone, setSafeZone] = useState(null); // 安全区域
    const svgRef = useRef(null);
    const targetShapeRef = useRef(null);
    const [shapeType, setShapeType] = useState('polygon'); // 新增：形状类型状态
    const [cutType, setCutType] = useState('straight'); // 新增：切割类型状态
    const [fragments, setFragments] = useState([]); // 新增：存储切割后的碎片

    // 更新targetShapeRef
    useEffect(() => {
        targetShapeRef.current = targetShape;
    }, [targetShape]);

    // 将 calculateBounds 函数移到组件内部
    const calculateBounds = (points) => {
        if (!points || points.length === 0) return null;
        const xs = points.map(p => p[0]);
        const ys = points.map(p => p[1]);
        return {
            minX: Math.min(...xs),
            maxX: Math.max(...xs),
            minY: Math.min(...ys),
            maxY: Math.max(...ys)
        };
    };

    // 使用 useMemo 优化计算密集型操作
    const bounds = useMemo(() => {
        if (targetShapeRef.current) {
            return calculateBounds(targetShapeRef.current);
        }
        return null;
    }, [targetShapeRef.current]);

    // 使用 useCallback 优化函数
    const handleGenerate = useCallback((type) => {
        let shape;
        if (type === 'polygon') {
            shape = generateRandomPolygon();
            setShapeType('polygon');
        } else if (type === 'curve') {
            shape = generateRandomCurveShape();
            setShapeType('curve');
        }
        setTargetShape(shape);
        setCutLine(null);
        setIntersections([]);
        setSafeZone(null);
        setFragments([]); // 清除旧的碎片
    }, []);

    // 修改：handleSplit 函数
    const handleSplit = useCallback(() => {
        if (!targetShapeRef.current || !bounds || svgSize.width < MIN_SCREEN_WIDTH || svgSize.height < MIN_SCREEN_HEIGHT) {
            console.log("Invalid state for splitting");
            return;
        }

        const centerX = (bounds.minX + bounds.maxX) / 2;
        const centerY = (bounds.minY + bounds.maxY) / 2;

        // 创建安全区域
        const newSafeZone = createSafeZone(targetShapeRef.current, centerX, centerY, 0.25);
        setSafeZone(newSafeZone);

        // 生成一条切割线
        const newCutLine = generateCutLine(bounds, newSafeZone);
        if (!newCutLine) {
            console.error("Failed to generate a valid cut line");
            return;
        }
        setCutLine(newCutLine);

        // 计算交点
        const allIntersections = shapeType === 'curve'
            ? findCurveIntersections(newCutLine, targetShapeRef.current)
            : findIntersections(newCutLine, targetShapeRef.current);
        setIntersections(allIntersections);

        // 使用新的 cutShape 函数计算切割后的碎片
        const [fragment1, fragment2] = cutShape(targetShapeRef.current, newCutLine, allIntersections);
        setFragments([
            { points: fragment1, color: getRandomColor() },
            { points: fragment2, color: getRandomColor() }
        ]);

    }, [targetShapeRef, bounds, svgSize, cutType, shapeType]);

    // 修改：生成切割线函数
    const generateCutLine = (bounds, safeZone) => {
        for (let attempts = 0; attempts < 1000; attempts++) {
            const cutLine = cutType === 'straight' ? generateLongerCutLine(bounds) : generateCurveCutLine(bounds);

            const intersectsSafe = intersectsSafeZone(cutLine, safeZone);
            const isValid = isValidCutLine(cutLine, targetShapeRef.current, bounds);

            if (intersectsSafe && isValid) {
                return cutLine;
            }
        }
        console.error("Failed to generate a valid cut line");
        return null;
    };

    // 生成随机多边形
    const generateRandomPolygon = () => {
        const numPoints = 5 + Math.floor(Math.random() * 5);
        const screenWidth = Math.max(window.innerWidth, MIN_SCREEN_WIDTH);
        const screenHeight = Math.max(window.innerHeight, MIN_SCREEN_HEIGHT);
        const centerX = screenWidth / 2;
        const centerY = screenHeight / 2;
        const maxRadius = Math.min(
            MAX_SHAPE_DIAMETER / 2, 
            Math.min(screenWidth, screenHeight) / 3
        );
        const minRadius = MIN_SHAPE_DIAMETER / 2;
        
        let points;
        let area;
        
        do {
            points = [];
            for (let i = 0; i < numPoints; i++) {
                const angle = (i / numPoints) * 2 * Math.PI;
                const r = minRadius + Math.random() * (maxRadius - minRadius);
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                points.push([x, y]);
            }
            area = calculatePolygonArea(points);
        } while (area < MIN_SHAPE_AREA);

        return points;
    };

    // 生成随机曲线形状
    const generateRandomCurveShape = () => {
        const numPoints = 6 + Math.floor(Math.random() * 3);
        const screenWidth = Math.max(window.innerWidth, MIN_SCREEN_WIDTH);
        const screenHeight = Math.max(window.innerHeight, MIN_SCREEN_HEIGHT);
        const centerX = screenWidth / 2;
        const centerY = screenHeight / 2;
        const maxRadius = Math.min(MAX_SHAPE_DIAMETER / 2, Math.min(screenWidth, screenHeight) / 3);
        const minRadius = MIN_SHAPE_DIAMETER / 2;

        let points = [];
        let prevDistortion = 0;
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * 2 * Math.PI;
            const r = minRadius + Math.random() * (maxRadius - minRadius);
            
            // 使用平滑的扰动函数，免大幅度波动
            const distortion = (Math.sin(angle * 3) * (maxRadius - minRadius) * 0.2 + prevDistortion) / 2;
            prevDistortion = distortion;
            
            const x = centerX + (r + distortion) * Math.cos(angle);
            const y = centerY + (r + distortion) * Math.sin(angle);
            points.push([x, y]);
        }

        setShapeType('curve'); // 确保设置正确的形状类型
        return points;
    };

    // 计算多边形面积
    const calculatePolygonArea = (points) => {
        let area = 0;
        for (let i = 0; i < points.length; i++) {
            const j = (i + 1) % points.length;
            area += points[i][0] * points[j][1];
            area -= points[j][0] * points[i][1];
        }
        return Math.abs(area / 2);
    };

    // 防抖处理生成函数
    const debouncedHandleGenerate = useMemo(
        () => debounce(handleGenerate, 250),
        [handleGenerate]
    );

    // 初始化和窗口大小变化时生成新形状
    useEffect(() => {
        let isMounted = true;

        const generateAndSetShape = () => {
            const shape = generateRandomPolygon();
            if (isMounted) {
                setTargetShape(shape);
                setCutLine(null);
                setIntersections([]);
            }
        };

        generateAndSetShape();
        window.addEventListener('resize', debouncedHandleGenerate);

        return () => {
            isMounted = false;
            window.removeEventListener('resize', debouncedHandleGenerate);
            debouncedHandleGenerate.cancel();
        };
    }, [debouncedHandleGenerate]);

    // 更新SVG尺寸
    useEffect(() => {
        const updateSvgSize = () => {
            if (svgRef.current) {
                const width = Math.max(window.innerWidth, MIN_SCREEN_WIDTH);
                const height = Math.max(window.innerHeight, MIN_SCREEN_HEIGHT);
                setSvgSize({ width, height });
            }
        };

        const debouncedUpdateSvgSize = debounce(updateSvgSize, 250);
        window.addEventListener('resize', debouncedUpdateSvgSize);
        updateSvgSize();

        return () => {
            window.removeEventListener('resize', debouncedUpdateSvgSize);
            debouncedUpdateSvgSize.cancel();
        };
    }, []);

    // 创建安全区域
    const createSafeZone = (shape, centerX, centerY, scale) => {
        return shape.map(point => [
            (point[0] - centerX) * scale + centerX,
            (point[1] - centerY) * scale + centerY
        ]);
    };

    // 检查是否与安全区域相交
    const intersectsSafeZone = (line, safeZone) => {
        return safeZone.some((point, index) => {
            const nextIndex = (index + 1) % safeZone.length;
            return doLinesIntersect(
                line.x1, line.y1, line.x2, line.y2,
                safeZone[index][0], safeZone[index][1], safeZone[nextIndex][0], safeZone[nextIndex][1]
            );
        });
    };

    // 检查两线段是否相交
    const doLinesIntersect = (x1, y1, x2, y2, x3, y3, x4, y4) => {
        const det = (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1);
        if (det === 0) return false;

        const lambda = ((y4 - y3) * (x4 - x1) + (x3 - x4) * (y4 - y1)) / det;
        const gamma = ((y1 - y2) * (x4 - x1) + (x2 - x1) * (y4 - y1)) / det;

        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    };

    // 修改：检查切割线是否有效
    const isValidCutLine = (line, shape, bounds) => {
        const intersections = shapeType === 'curve' 
            ? findCurveIntersections(line, shape)
            : findIntersections(line, shape);
        
        return intersections.length >= 2;
    };

    // 修改：findIntersections 函数
    const findIntersections = (line, shape) => {
        const intersections = [];
        for (let i = 0; i < shape.length; i++) {
            const nextIndex = (i + 1) % shape.length;
            const currentPoint = shape[i];
            const nextPoint = shape[nextIndex];

            const intersection = lineIntersection(
                line.x1, line.y1, line.x2, line.y2,
                currentPoint[0], currentPoint[1], nextPoint[0], nextPoint[1]
            );
            if (intersection) {
                intersections.push(intersection);
            }
        }
        return intersections;
    };

    // 新增：离散化曲线段的函数
    const discretizeCurveSegment = (start, end, numPoints) => {
        const points = [];
        for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;
            const x = start[0] * (1 - t) + end[0] * t;
            const y = start[1] * (1 - t) + end[1] * t;
            points.push([x, y]);
        }
        return points;
    };

    // 修改：查找曲线与形状的交点
    const findCurveIntersections = (line, shape) => {
        const intersections = [];
        const numSteps = 1000; // 增加离散点的数量以提高精度
        const epsilon = 0.001; // 添加容差

        for (let i = 0; i < shape.length; i++) {
            const nextIndex = (i + 1) % shape.length;
            const curveStart = shape[i];
            const curveEnd = shape[nextIndex];
            
            // 离散化曲线段
            const curvePoints = discretizeCurveSegment(curveStart, curveEnd, numSteps);
            
            for (let j = 0; j < curvePoints.length - 1; j++) {
                const intersection = lineIntersection(
                    line.x1, line.y1, line.x2, line.y2,
                    curvePoints[j][0], curvePoints[j][1], curvePoints[j+1][0], curvePoints[j+1][1]
                );
                if (intersection && !intersections.some(p => distance(p, intersection) < epsilon)) {
                    intersections.push(intersection);
                }
            }
        }

        return intersections;
    };

    // 新增：在曲线上找到最接近给定点的参数 t
    const findParameterOnCurve = (curve, point) => {
        const { x1, y1, x2, y2, cx1, cy1, cx2, cy2 } = curve;
        const [x, y] = point;

        // 使用二分法找到最接近的 t 值
        let tMin = 0;
        let tMax = 1;
        let t = 0.5;
        const iterations = 10; // 可以根据需要调整迭代次数

        for (let i = 0; i < iterations; i++) {
            const px = bezierPoint(t, x1, cx1, cx2, x2);
            const py = bezierPoint(t, y1, cy1, cy2, y2);

            const distanceToPoint = distance([px, py], [x, y]);

            if (distanceToPoint < 0.1) { // 可以调整这个阈值
                return t;
            }

            const leftT = (tMin + t) / 2;
            const leftPx = bezierPoint(leftT, x1, cx1, cx2, x2);
            const leftPy = bezierPoint(leftT, y1, cy1, cy2, y2);
            const leftDistance = distance([leftPx, leftPy], [x, y]);

            const rightT = (t + tMax) / 2;
            const rightPx = bezierPoint(rightT, x1, cx1, cx2, x2);
            const rightPy = bezierPoint(rightT, y1, cy1, cy2, y2);
            const rightDistance = distance([rightPx, rightPy], [x, y]);

            if (leftDistance < rightDistance) {
                tMax = t;
                t = leftT;
            } else {
                tMin = t;
                t = rightT;
            }
        }

        return -1; // 如果没有找到适的 t 值
    };

    // 新增：计算贝塞尔曲线上的点
    const bezierPoint = (t, p0, p1, p2, p3) => {
        const mt = 1 - t;
        return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
    };

    // 新增：将点吸附到最近的边缘
    const snapToEdge = (point, lineStart, lineEnd) => {
        const [x, y] = point;
        const [x1, y1] = lineStart;
        const [x2, y2] = lineEnd;

        const A = x - x1;
        const B = y - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        const param = (dot / lenSq);

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        }
        else if (param > 1) {
            xx = x2;
            yy = y2;
        }
        else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        return [xx, yy];
    };

    // 修改：将贝塞尔曲线离散化为点集
    const discretizeCurve = (curve, numPoints) => {
        if (!curve) return [];
        const points = [];
        for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;
            const x = Math.pow(1-t, 3) * curve.x1 + 3 * Math.pow(1-t, 2) * t * curve.cx1 + 3 * (1-t) * Math.pow(t, 2) * curve.cx2 + Math.pow(t, 3) * curve.x2;
            const y = Math.pow(1-t, 3) * curve.y1 + 3 * Math.pow(1-t, 2) * t * curve.cy1 + 3 * (1-t) * Math.pow(t, 2) * curve.cy2 + Math.pow(t, 3) * curve.y2;
            points.push([x, y]);
        }
        return points;
    };

    // 修改：计算两线段的交点
    const lineIntersection = (x1, y1, x2, y2, x3, y3, x4, y4) => {
        const det = (x1 - x2) * (y3 - y4) - (x3 - x4) * (y1 - y2);
        if (Math.abs(det) < 1e-8) return null; // 使用更小的阈值

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / det;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / det;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return [x1 + t * (x2 - x1), y1 + t * (y2 - y1)];
        }

        return null;
    };

    // 计算两线段之间的角度
    const calculateAngle = (line1, line2) => {
        const dx1 = line1.x2 - line1.x1;
        const dy1 = line1.y2 - line1.y1;
        const dx2 = line2.x2 - line2.x1;
        const dy2 = line2.y2 - line2.y1;
        
        const angle1 = Math.atan2(dy1, dx1);
        const angle2 = Math.atan2(dy2, dx2);
        
        let angle = Math.abs(angle1 - angle2) * (180 / Math.PI);
        if (angle > 90) {
            angle = 180 - angle;
        }
        return angle;
    };

    // 计算两点之间的距离
    const distance = (point1, point2) => {
        return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2));
    };

    // 新增：验证切割是否有效
    const isValidCut = (shape, intersections) => {
        if (intersections.length !== 2) return false;

        // 检查两个交点是否在形状的不同边上
        const edges = shape.map((point, index) => {
            const nextIndex = (index + 1) % shape.length;
            return [point, shape[nextIndex]];
        });

        const [int1, int2] = intersections;
        const int1Edge = edges.findIndex(edge => pointOnLineSegment(int1, edge[0], edge[1]));
        const int2Edge = edges.findIndex(edge => pointOnLineSegment(int2, edge[0], edge[1]));

        return int1Edge !== -1 && int2Edge !== -1 && int1Edge !== int2Edge;
    };

    // 新增：检查点是否在线段上
    const pointOnLineSegment = (point, lineStart, lineEnd) => {
        const d1 = distance(point, lineStart);
        const d2 = distance(point, lineEnd);
        const lineLength = distance(lineStart, lineEnd);
        const buffer = 0.1; // 允许的误差
        return Math.abs(d1 + d2 - lineLength) < buffer;
    };

    // 增：生成随机颜色，确保颜色不重复
    const getRandomColor = (() => {
        const usedColors = new Set();
        return () => {
            let color;
            do {
                color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            } while (usedColors.has(color) || color === '#ffffff' || color === '#f0f0f0');
            usedColors.add(color);
            return color;
        };
    })();

    // 新增：找到所有交点，包括切割线之间的交点
    const findAllIntersections = (cutLines, shape) => {
        let allIntersections = [];

        // 找到切割线与形状的交点
        cutLines.forEach(line => {
            const intersections = shapeType === 'curve' 
                ? findCurveIntersections(line, shape)
                : findIntersections(line, shape);
            allIntersections.push(...intersections);
        });

        // 找到切割线之间的交点
        for (let i = 0; i < cutLines.length; i++) {
            for (let j = i + 1; j < cutLines.length; j++) {
                const intersection = findCutLineIntersection(cutLines[i], cutLines[j]);
                if (intersection) {
                    allIntersections.push(intersection);
                }
            }
        }

        return allIntersections;
    };

    // 新增：找到两条切割线的交点
    const findCutLineIntersection = (line1, line2) => {
        if (cutType === 'straight') {
            return lineIntersection(line1.x1, line1.y1, line1.x2, line1.y2, line2.x1, line2.y1, line2.x2, line2.y2);
        } else {
            // 对于曲线，我们需要离散化并检查每个线段
            const points1 = discretizeCurve(line1, 100);
            const points2 = discretizeCurve(line2, 100);
            for (let i = 0; i < points1.length - 1; i++) {
                for (let j = 0; j < points2.length - 1; j++) {
                    const intersection = lineIntersection(
                        points1[i][0], points1[i][1], points1[i+1][0], points1[i+1][1],
                        points2[j][0], points2[j][1], points2[j+1][0], points2[j+1][1]
                    );
                    if (intersection) return intersection;
                }
            }
        }
        return null;
    };

    // 新增：精计算曲线与直线的交点
    const findCurveLineIntersections = (curveStart, curveEnd, line) => {
        const intersections = [];
        const numSteps = 1000; // 增加步数以提��精度
        for (let i = 0; i <= numSteps; i++) {
            const t = i / numSteps;
            const curvePoint = [
                curveStart[0] * (1 - t) + curveEnd[0] * t,
                curveStart[1] * (1 - t) + curveEnd[1] * t
            ];
            if (pointOnLine(curvePoint, line)) {
                intersections.push(curvePoint);
            }
        }
        return intersections;
    };

    // 辅助函数：检查点是否在线上
    const pointOnLine = (point, line) => {
        const epsilon = 0.1; // 允许的误差范围
        const [x, y] = point;
        const { x1, y1, x2, y2 } = line;
        
        // 检查点是否在线段的范围内
        if (x < Math.min(x1, x2) - epsilon || x > Math.max(x1, x2) + epsilon ||
            y < Math.min(y1, y2) - epsilon || y > Math.max(y1, y2) + epsilon) {
            return false;
        }
        
        // 使用叉积判断点是否在直线上
        const cross = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1);
        return Math.abs(cross) < epsilon;
    };

    // 新增：修改切割逻辑，确保正确构造新的闭合图形
    const cutShape = (shape, cutLine, intersections) => {
        if (intersections.length !== 2) {
            console.error("Invalid number of intersections");
            return [shape, []];
        }

        const [int1, int2] = intersections;
        const newShape1 = [];
        const newShape2 = [];
        let currentShape = newShape1;
        let onShape1 = true;

        for (let i = 0; i < shape.length; i++) {
            const currentPoint = shape[i];
            const nextPoint = shape[(i + 1) % shape.length];

            if (onShape1) {
                currentShape.push(currentPoint);
            }

            const segmentIntersections = intersections.filter(int => 
                pointOnCurveSegment(int, currentPoint, nextPoint)
            );

            for (const intersection of segmentIntersections) {
                currentShape.push(intersection);
                onShape1 = !onShape1;
                currentShape = onShape1 ? newShape1 : newShape2;
                currentShape.push(intersection);
            }
        }

        // 确保两个形状都是闭合的
        if (newShape1[0] !== newShape1[newShape1.length - 1]) {
            newShape1.push(newShape1[0]);
        }
        if (newShape2[0] !== newShape2[newShape2.length - 1]) {
            newShape2.push(newShape2[0]);
        }

        return [newShape1, newShape2];
    };

    // 新增：检查点是否在曲线段上
    const pointOnCurveSegment = (point, start, end) => {
        const epsilon = 0.001; // 容差
        const t = findParameterOnCurve({x1: start[0], y1: start[1], x2: end[0], y2: end[1]}, point);
        return t >= 0 && t <= 1;
    };

    // 修改：renderShape 函数
    const renderShape = (shape, stroke, strokeWidth, fill = "none") => {
        if (!shape || shape.length < 3) return null;

        let pathData;
        if (shapeType === 'polygon' || shape === safeZone) {
            pathData = shape.map((point, index) => {
                const [x, y] = point;
                return index === 0 ? `M${x},${y}` : `L${x},${y}`;
            }).join(' ') + 'Z';
        } else {
            // 使用三次贝塞尔曲线来渲染更平滑的曲线形状
            pathData = shape.reduce((path, point, index, points) => {
                const [x, y] = point;
                if (index === 0) return `M${x},${y}`;
                const [prevX, prevY] = points[(index - 1 + points.length) % points.length];
                const [nextX, nextY] = points[(index + 1) % points.length];
                
                // 计算控制点
                const dx = x - prevX;
                const dy = y - prevY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const factor = distance * 0.3; // 增加这个因子可以增加曲线的弧度
                
                const cp1x = prevX + dx / 2 - dy / distance * factor;
                const cp1y = prevY + dy / 2 + dx / distance * factor;
                const cp2x = x - dx / 2 - dy / distance * factor;
                const cp2y = y - dy / 2 + dx / distance * factor;
                
                return `${path} C${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
            }, '') + 'Z';
        }

        return (
            <path 
                d={pathData} 
                fill={fill}
                stroke={stroke} 
                strokeWidth={strokeWidth}
            />
        );
    };

    // 样式定义
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: MIN_SCREEN_WIDTH,
            minHeight: MIN_SCREEN_HEIGHT,
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            backgroundColor: '#f0f0f0',
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px',
        },
        button: {
            margin: '0 10px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
        },
        gameArea: {
            width: '100%',
            height: 'calc(100% - 80px)', // 减去按钮器的高度
            backgroundColor: '#ffffff',
            position: 'relative',
        },
    };

    // 修改：渲染组件
    return (
        <div style={styles.container}>
            <div style={styles.buttonContainer}>
                <button style={styles.button} onClick={() => handleGenerate('polygon')}>多边形</button>
                <button style={styles.button} onClick={() => handleGenerate('curve')}>曲线图形</button>
                <button style={styles.button} onClick={() => { setCutType('straight'); handleSplit(); }}>直线切割</button>
                <button style={styles.button} onClick={() => { setCutType('curve'); handleSplit(); }}>曲线切割</button>
            </div>
            <div style={styles.gameArea}>
                <svg 
                    ref={svgRef}
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                >
                    {/* 渲染原始形状（半透明） */}
                    {targetShape && renderShape(targetShape, 'orange', 2, 'rgba(200, 200, 200, 0.5)')}

                    {/* 渲染碎片 */}
                    {fragments.map((fragment, index) => (
                        <React.Fragment key={`fragment-${index}`}>
                            {renderShape(fragment.points, 'black', 1, fragment.color)}
                        </React.Fragment>
                    ))}

                    {safeZone && renderShape(safeZone, 'black', 1)} {/* 渲染安全区域 */}

                    {/* 渲染切割线 */}
                    {cutLine && (
                        cutType === 'straight' ? (
                            <line 
                                key="cut-line"
                                x1={cutLine.x1}
                                y1={cutLine.y1}
                                x2={cutLine.x2}
                                y2={cutLine.y2}
                                stroke="red"
                                strokeWidth="2"
                            />
                        ) : (
                            <path
                                key="cut-curve"
                                d={`M${cutLine.x1},${cutLine.y1} C${cutLine.cx1},${cutLine.cy1} ${cutLine.cx2},${cutLine.cy2} ${cutLine.x2},${cutLine.y2}`}
                                stroke="red"
                                strokeWidth="2"
                                fill="none"
                            />
                        )
                    )}

                    {/* 渲染交点 */}
                    {intersections.map((point, index) => (
                        <g key={`intersection-${index}`}>
                            <circle 
                                cx={point[0]} 
                                cy={point[1]} 
                                r="4"
                                fill="green"
                            />
                            <circle 
                                cx={point[0]} 
                                cy={point[1]} 
                                r="2"
                                fill="white"
                            />
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
};

// 添加：生成更长的直线切割线
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

// 添加：生成曲线切割线
const generateCurveCutLine = (bounds) => {
    const extension = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) * 0.5;
    const x1 = bounds.minX - extension + Math.random() * (bounds.maxX - bounds.minX + 2 * extension);
    const y1 = bounds.minY - extension + Math.random() * (bounds.maxY - bounds.minY + 2 * extension);
    const x2 = bounds.minX - extension + Math.random() * (bounds.maxX - bounds.minX + 2 * extension);
    const y2 = bounds.minY - extension + Math.random() * (bounds.maxY - bounds.minY + 2 * extension);
    
    // 增加控制点的偏移范围，以增加中段弧度
    const maxControlOffset = extension * 0.8;
    
    // 计算线段中点
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    // 计算垂直于线段的方向
    const dx = x2 - x1;
    const dy = y2 - y1;
    const perpX = -dy;
    const perpY = dx;
    
    // 归一化垂直向量
    const length = Math.sqrt(perpX * perpX + perpY * perpY);
    const normalizedPerpX = perpX / length;
    const normalizedPerpY = perpY / length;
    
    // 生成随机偏移
    const offset = (Math.random() - 0.5) * maxControlOffset;
    
    // 计算控制点
    const cx1 = midX + normalizedPerpX * offset;
    const cy1 = midY + normalizedPerpY * offset;
    const cx2 = cx1;
    const cy2 = cy1;

    return { x1, y1, x2, y2, cx1, cy1, cx2, cy2 };
};

export default TestShapeGeneration;