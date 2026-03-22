import { type Orientation } from '../types';
import { getFontSize, getLineWidth, getTailSize, type Dimensions } from './canvas';

export type Vector = {
    x: number;
    y: number;
};

export const connectionVector = (pointA: Vector, pointB: Vector): Vector => {
    return {
        x: pointB.x - pointA.x,
        y: pointB.y - pointA.y,
    };
};

export const vectorLength = (vector: Vector): number => {
    return Math.sqrt(vector.x ** 2 + vector.y ** 2);
};

export const vectorAngleRad = (vector: Vector): number => {
    return Math.atan2(vector.y, vector.x);
};

export const vectorAngleDeg = (vector: Vector): number => {
    const deg = (vectorAngleRad(vector) * 180) / Math.PI;
    const adjustedDeg = (deg + 360) % 360;

    return (adjustedDeg + 90) % 360;
};

export const normalizedVector = (vector: Vector): Vector => {
    return {
        x: vector.x / vectorLength(vector),
        y: vector.y / vectorLength(vector),
    };
};

export const orthogonalVector = (vector: Vector): Vector => {
    return {
        x: -vector.y,
        y: vector.x,
    };
};

export const reversedVector = (vector: Vector): Vector => {
    return {
        x: -vector.x,
        y: -vector.y,
    };
};

export const centroidVector = (vectors: Vector[]): Vector => {
    const n = vectors.length;

    if (n === 0) {
        throw new Error();
    }

    if (n === 1) {
        return vectors[0];
    }

    if (n === 2) {
        return {
            x: (vectors[0].x + vectors[1].x) / 2,
            y: (vectors[0].y + vectors[1].y) / 2,
        };
    }

    let sumX = 0;
    let sumY = 0;
    let sumArea = 0;

    for (let i = 0; i < n; i += 1) {
        const { x: x0, y: y0 } = vectors[i];
        const { x: x1, y: y1 } = vectors[(i + 1) % n];
        const area = x0 * y1 - x1 * y0;
        sumX += (x0 + x1) * area;
        sumY += (y0 + y1) * area;
        sumArea += area;
    }

    const area = sumArea / 2;
    return {
        x: sumX / (6 * area),
        y: sumY / (6 * area),
    };
};

export const rotatedVectorRad = ({ x, y }: Vector, center: Vector, angleRad: number): Vector => {
    return {
        x: center.x + (x - center.x) * Math.cos(angleRad) - (y - center.y) * Math.sin(angleRad),
        y: center.y + (x - center.x) * Math.sin(angleRad) + (y - center.y) * Math.cos(angleRad),
    };
};

export const rotatedVectorDeg = (vector: Vector, center: Vector, angleDeg: number): Vector => {
    return rotatedVectorRad(vector, center, angleDeg * (Math.PI / 180));
};

export const tailBendVector = (
    tip: Vector,
    angleDeg: number,
    canvasDimensions: Dimensions,
    orientation: Orientation,
): Vector => {
    const tailSize = getTailSize(canvasDimensions);

    switch (orientation) {
        case 'top':
            return rotatedVectorDeg({ x: tip.x, y: tip.y - tailSize }, tip, -angleDeg);
        case 'right':
            return rotatedVectorDeg({ x: tip.x + tailSize, y: tip.y }, tip, angleDeg);
        case 'bottom':
            return rotatedVectorDeg({ x: tip.x, y: tip.y + tailSize }, tip, angleDeg);
        case 'left':
            return rotatedVectorDeg({ x: tip.x - tailSize, y: tip.y }, tip, -angleDeg);
        default:
            throw new Error(`Unknown orientation: ${orientation}`);
    }
};

export const labelVector = (
    start: Vector,
    canvasDimensions: Dimensions,
    orientation: Orientation,
): Vector => {
    switch (orientation) {
        case 'top':
            return { x: start.x, y: 0 };
        case 'right':
            return { x: canvasDimensions.width, y: start.y };
        case 'bottom':
            return { x: start.x, y: canvasDimensions.height };
        case 'left':
            return { x: 0, y: start.y };
        default:
            throw new Error(`Unknown orientation: ${orientation}`);
    }
};

export const triangleVectors = (
    position: Vector,
    canvasDimensions: Dimensions,
    orientation: Orientation,
): Vector[] => {
    const size = getFontSize(canvasDimensions);
    const lineWidth = getLineWidth(canvasDimensions);

    let rotation: number;
    switch (orientation) {
        case 'top':
            rotation = 180;
            break;
        case 'right':
            rotation = 270;
            break;
        case 'bottom':
            rotation = 0;
            break;
        case 'left':
            rotation = 90;
            break;
        default:
            throw new Error();
    }

    return [
        // base
        { x: position.x - size / 2, y: position.y + size },
        { x: position.x + size / 2, y: position.y + size },
        // tip
        { x: position.x + lineWidth / 4, y: position.y },
        { x: position.x - lineWidth / 4, y: position.y },
    ].map((vector) => rotatedVectorDeg(vector, position, rotation));
};

export const arrowHeadVectors = (position: Vector, size: number, rotation: number): Vector[] => {
    const width = size * 1.5;

    return [
        // base
        { x: position.x - width / 2, y: position.y + width },
        { x: position.x, y: position.y + 0.75 * width },
        { x: position.x + width / 2, y: position.y + width },
        // tip
        { x: position.x, y: position.y },
    ].map((vector) => rotatedVectorDeg(vector, position, rotation));
};

export const vectorsToString = (vectors: Vector[]): string => {
    return vectors.map(({ x, y }) => `${x},${y}`).join(' ');
};
