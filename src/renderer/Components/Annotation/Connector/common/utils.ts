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

export const orthogonalVector = (vector: Vector): Vector => {
    return {
        x: -vector.y,
        y: vector.x,
    };
};

export const braceVectors = (
    pointA: Vector,
    pointB: Vector,
    orientation: Orientation,
): {
    start: Vector;
    tip: Vector;
    end: Vector;
    s: Vector;
    q1: Vector;
    q2: Vector;
    c: Vector;
    q3: Vector;
    q4: Vector;
    e: Vector;
} => {
    let start: Vector;
    let end: Vector;

    switch (orientation) {
        case 'top':
            end = pointA.x > pointB.x ? pointB : pointA;
            start = pointA.x > pointB.x ? pointA : pointB;
            break;
        case 'right':
            start = pointA.y < pointB.y ? pointB : pointA;
            end = pointA.y < pointB.y ? pointA : pointB;
            break;
        case 'bottom':
            end = pointA.x > pointB.x ? pointA : pointB;
            start = pointA.x > pointB.x ? pointB : pointA;
            break;
        case 'left':
            start = pointA.y < pointB.y ? pointA : pointB;
            end = pointA.y < pointB.y ? pointB : pointA;
            break;
        default:
            throw new Error();
    }

    const { x: dx, y: dy } = normalizedVector(connectionVector(start, end));
    const length = vectorLength(connectionVector(start, end));
    const stretch = 0.5;
    const size = 40;
    const dashSize = size * (1 / 6);
    const bodySize = size * (2 / 3);
    const normalizedOrthagonal = normalizedVector(orthogonalVector(connectionVector(start, end)));

    const s = {
        x: start.x + dashSize * normalizedOrthagonal.x,
        y: start.y + dashSize * normalizedOrthagonal.y,
    };

    const e = {
        x: end.x + dashSize * normalizedOrthagonal.x,
        y: end.y + dashSize * normalizedOrthagonal.y,
    };

    const c = {
        x: start.x - 0.5 * length * dx + bodySize * dy,
        y: start.y - 0.5 * length * dy - bodySize * dx,
    };

    const tip = {
        x: c.x + dashSize * normalizedOrthagonal.x,
        y: c.y + dashSize * normalizedOrthagonal.y,
    };

    const q1 = {
        x: start.x + stretch * bodySize * dy,
        y: start.y - stretch * bodySize * dx,
    };

    const q2 = {
        x: start.x - 0.25 * length * dx + (1 - stretch) * bodySize * dy,
        y: start.y - 0.25 * length * dy - (1 - stretch) * bodySize * dx,
    };

    const q3 = {
        x: end.x + stretch * bodySize * dy,
        y: end.y - stretch * bodySize * dx,
    };

    const q4 = {
        x: start.x - 0.75 * length * dx + (1 - stretch) * bodySize * dy,
        y: start.y - 0.75 * length * dy - (1 - stretch) * bodySize * dx,
    };

    return { start, tip, end, s, q1, q2, c, q3, q4, e };
};
