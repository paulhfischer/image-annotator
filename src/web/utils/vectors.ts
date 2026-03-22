import { Dimensions, Orientation } from '../types';

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
    let sumX = 0;
    let sumY = 0;
    let sumArea = 0;
    const n = vectors.length;

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

export const labelVector = (start: Vector, canvasDimensions: Dimensions, orientation: Orientation): Vector => {
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
