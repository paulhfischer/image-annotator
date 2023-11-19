export interface Vector {
    x: number;
    y: number;
}

export type Orientation = 'top' | 'right' | 'bottom' | 'left';

export const connectionVector = (pointA: Vector, pointB: Vector): Vector => {
    return {
        x: pointA.x - pointB.x,
        y: pointA.y - pointB.y,
    };
};

export const vectorLength = (vector: Vector): number => {
    return Math.sqrt(vector.x ** 2 + vector.y ** 2);
};

export const normalizedVector = (vector: Vector): Vector => {
    return {
        x: vector.x / vectorLength(vector),
        y: vector.y / vectorLength(vector),
    };
};

export const centerVector = (vectors: Vector[]): Vector => {
    const sumX = vectors.reduce((sum, coordinate) => sum + coordinate.x, 0);
    const sumY = vectors.reduce((sum, coordinate) => sum + coordinate.y, 0);

    return {
        x: Math.round(sumX / vectors.length),
        y: Math.round(sumY / vectors.length),
    };
};
