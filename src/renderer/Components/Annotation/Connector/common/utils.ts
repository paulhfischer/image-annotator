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

export const invertOrientation = (orientation: Orientation): Orientation => {
    switch (orientation) {
        case 'top':
            return 'bottom';
        case 'right':
            return 'left';
        case 'bottom':
            return 'top';
        case 'left':
            return 'right';
        default:
            throw new Error();
    }
};

export const orientationToAngle = (orientation: Orientation): number => {
    switch (orientation) {
        case 'top':
            return 180;
        case 'right':
            return 270;
        case 'bottom':
            return 0;
        case 'left':
            return 90;
        default:
            throw new Error();
    }
};

export const rotateVector = ({ x, y }: Vector, center: Vector, rotationDeg: number): Vector => {
    const rotationRad = (rotationDeg * Math.PI) / 180;

    return {
        x:
            center.x +
            (x - center.x) * Math.cos(rotationRad) -
            (y - center.y) * Math.sin(rotationRad),
        y:
            center.y +
            (x - center.x) * Math.sin(rotationRad) +
            (y - center.y) * Math.cos(rotationRad),
    };
};

export const angleDeg = (vectorA: Vector, vectorB: Vector): number => {
    const dy = vectorB.y - vectorA.y;
    const dx = vectorB.x - vectorA.x;

    const rad = Math.atan2(dy, dx);
    const deg = (rad * 180) / Math.PI;
    const adjustedDeg = (deg + 360) % 360;

    return (adjustedDeg + 90) % 360;
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
