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
    const [cutLines, setCutLines] = useState([]); // 切割线
    const [intersections, setIntersections] = useState([]); // 交点
    const [svgSize, setSvgSize] = useState({ width: window.innerWidth, height: window.innerHeight }); // SVG尺寸
    const svgRef = useRef(null);
    const targetShapeRef = useRef(null);

    // 更新targetShapeRef
    useEffect(() => {
        targetShapeRef.current = targetShape;
    }, [targetShape]);

    // 生成随机形状
    const generateRandomShape = () => {
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

    // 处理生成新形状
    const handleGenerate = useCallback(() => {
        const shape = generateRandomShape();
        setTargetShape(shape);
        setCutLines([]);
        setIntersections([]);
    }, []);

    // 防抖处理生成函数
    const debouncedHandleGenerate = useMemo(
        () => debounce(handleGenerate, 250),
        [handleGenerate]
    );

    // 初始化和窗口大小变化时生成新形状
    useEffect(() => {
        let isMounted = true;

        const generateAndSetShape = () => {
            const shape = generateRandomShape();
            if (isMounted) {
                setTargetShape(shape);
                setCutLines([]);
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

    // 处理分割操作
    const handleSplit = useCallback(() => {
        if (!targetShapeRef.current || svgSize.width < MIN_SCREEN_WIDTH || svgSize.height < MIN_SCREEN_HEIGHT) {
            console.log("Invalid state for splitting");
            return;
        }

        const bounds = calculateBounds(targetShapeRef.current);
        const centerX = (bounds.minX + bounds.maxX) / 2;
        const centerY = (bounds.minY + bounds.maxY) / 2;

        // 创建安全区域，scale值0.25表示安全区域为原始形状的1/4大小
        const safeZone = createSafeZone(targetShapeRef.current, centerX, centerY, 0.25);

        // 存储新生成的切割线
        const newCutLines = [];

        // 最大尝试次数，用于防止无限循环
        // 范围：1000-10000，根据需要的精确度和性能要求调整
        const maxAttempts = 3000;

        // 切割线之间的最小角度（度）
        // 范围：10-45，较小的角度会产生更多样的切割，较大的角度会使切割更均匀
        const minAngle = 30;

        // 切割线交点之间的最小距离（像素）
        // 范围：20-100，较小的距离允许更密集的切割，较大的距离使切割更分散
        const minDistance = 50;

        for (let attempts = 0; attempts < maxAttempts; attempts++) {
            const cutLine = generateCutLine(bounds);

            const intersectsSafe = intersectsSafeZone(cutLine, safeZone);
            const isValid = isValidCutLine(cutLine, targetShapeRef.current, bounds);
            
            const hasValidAngle = newCutLines.every(existingLine => 
                calculateAngle(cutLine, existingLine) >= minAngle
            );

            let hasValidDistance = true;
            if (newCutLines.length === 2) {
                const existingIntersection = lineIntersection(
                    newCutLines[0].x1, newCutLines[0].y1, newCutLines[0].x2, newCutLines[0].y2,
                    newCutLines[1].x1, newCutLines[1].y1, newCutLines[1].x2, newCutLines[1].y2
                );
                if (existingIntersection) {
                    const newIntersections = [
                        lineIntersection(cutLine.x1, cutLine.y1, cutLine.x2, cutLine.y2, newCutLines[0].x1, newCutLines[0].y1, newCutLines[0].x2, newCutLines[0].y2),
                        lineIntersection(cutLine.x1, cutLine.y1, cutLine.x2, cutLine.y2, newCutLines[1].x1, newCutLines[1].y1, newCutLines[1].x2, newCutLines[1].y2)
                    ].filter(Boolean);

                    hasValidDistance = newIntersections.every(newIntersection => 
                        distance(existingIntersection, newIntersection) >= minDistance
                    );
                }
            }

            if (intersectsSafe && isValid && hasValidAngle && hasValidDistance) {
                newCutLines.push(cutLine);
                if (newCutLines.length === 3) break;
            }
        }

        setCutLines(newCutLines);

        const allIntersections = newCutLines.flatMap(line => findIntersections(line, targetShapeRef.current));
        setIntersections(allIntersections);
    }, [svgSize]);

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

    // 检查切割线是否有效
    const isValidCutLine = (line, shape, bounds) => {
        const intersections = findIntersections(line, shape);
        const lineLength = Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2));
        const minLength = Math.min(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) * 0.5;

        return intersections.length >= 2 && 
               lineLength >= minLength &&
               line.x1 >= bounds.minX && line.x1 <= bounds.maxX &&
               line.y1 >= bounds.minY && line.y1 <= bounds.maxY &&
               line.x2 >= bounds.minX && line.x2 <= bounds.maxX &&
               line.y2 >= bounds.minY && line.y2 <= bounds.maxY;
    };

    // 生成切割线
    const generateCutLine = (bounds) => {
        const x1 = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
        const y1 = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);
        const x2 = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
        const y2 = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);
        return { x1, y1, x2, y2 };
    };

    // 计算形状的边界
    const calculateBounds = (points) => {
        const xs = points.map(p => p[0]);
        const ys = points.map(p => p[1]);
        return {
            minX: Math.min(...xs),
            maxX: Math.max(...xs),
            minY: Math.min(...ys),
            maxY: Math.max(...ys)
        };
    };

    // 查找切割线与形状的交点
    const findIntersections = (line, shape) => {
        const intersections = [];
        for (let i = 0; i < shape.length; i++) {
            const nextIndex = (i + 1) % shape.length;
            const intersection = lineIntersection(
                line.x1, line.y1, line.x2, line.y2,
                shape[i][0], shape[i][1], shape[nextIndex][0], shape[nextIndex][1]
            );
            if (intersection) {
                const isDuplicate = intersections.some(existingPoint => 
                    Math.abs(existingPoint[0] - intersection[0]) < 0.001 && 
                    Math.abs(existingPoint[1] - intersection[1]) < 0.001
                );
                if (!isDuplicate) {
                    intersections.push(intersection);
                }
            }
        }
        return intersections;
    };

    // 计算两线段的交点
    const lineIntersection = (x1, y1, x2, y2, x3, y3, x4, y4) => {
        const det = (x1 - x2) * (y3 - y4) - (x3 - x4) * (y1 - y2);
        if (det === 0) return null;

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / det;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / det;

        if (t > 0 && t < 1 && u > 0 && u < 1) {
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

    // 渲染形状
    const renderShape = (shape, stroke, strokeWidth) => {
        if (!shape || shape.length < 3) return null;

        const pathData = shape.map((point, index) => {
            const [x, y] = point;
            return index === 0 ? `M${x},${y}` : `L${x},${y}`;
        }).join(' ') + 'Z';

        return (
            <path 
                d={pathData} 
                fill="none"
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
            height: 'calc(100% - 80px)', // 减去按钮容器的高度
            backgroundColor: '#ffffff',
            position: 'relative',
        },
    };

    // 渲染组件
    return (
        <div style={styles.container}>
            <div style={styles.buttonContainer}>
                <button style={styles.button} onClick={handleGenerate}>刷新</button>
                <button style={styles.button} onClick={handleSplit}>分割</button>
            </div>
            <div style={styles.gameArea}>
                <svg 
                    ref={svgRef}
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                >
                    {renderShape(targetShape, 'orange', 2)} {/* 渲染目标形状 */}
                    {cutLines.map((line, index) => (
                        <line 
                            key={`line-${index}`}
                            x1={line.x1}
                            y1={line.y1}
                            x2={line.x2}
                            y2={line.y2}
                            stroke="red"
                            strokeWidth="2"
                        />
                    ))} {/* 渲染切割线 */}
                    {intersections.map((point, index) => (
                        <circle 
                            key={`intersection-${index}`}
                            cx={point[0]} 
                            cy={point[1]} 
                            r="4"
                            fill="green"
                        />
                    ))} {/* 渲染交点 */}
                </svg>
            </div>
        </div>
    );
};

export default TestShapeGeneration;

