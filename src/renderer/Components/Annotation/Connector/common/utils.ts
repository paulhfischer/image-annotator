export interface Vector {
    x: number;
    y: number;
}

export type Orientation = 'top' | 'right' | 'bottom' | 'left';

export const connectionVector = (pointA: Vector, pointB: Vector): Vector => {
    return {
        x: pointB.x - pointA.x,
        y: pointB.y - pointA.y,
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
    c: Vector;
    q1: Vector;
    q2: Vector;
    q3: Vector;
    q4: Vector;
    p1: Vector;
    p2: Vector;
    p3: Vector;
    p4: Vector;
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
    const { x: nx, y: ny } = normalizedVector(orthogonalVector(connectionVector(start, end)));

    const length = vectorLength(connectionVector(end, start));

    const height = 25;

    const q1 = {
        x: start.x + dx * 0 + nx * (0.5 * height),
        y: start.y + dy * 0 + ny * (0.5 * height),
    };

    const p1 = {
        x: q1.x + dx * (0.5 * height) + nx * 0,
        y: q1.y + dy * (0.5 * height) + nx * 0,
    };

    const p2 = {
        x: start.x + dx * (0.5 * length - 0.5 * height) + nx * (0.5 * height),
        y: start.y + dy * (0.5 * length - 0.5 * height) + ny * (0.5 * height),
    };

    const q2 = {
        x: start.x + dx * (0.5 * length - 0.25 * height) + nx * 0.5 * height,
        y: start.y + dy * (0.5 * length - 0.25 * height) + ny * 0.5 * height,
    };

    const c = {
        x: start.x + dx * (length / 2) + nx * height,
        y: start.y + dy * (length / 2) + ny * height,
    };

    const tip = {
        x: start.x + dx * (length / 2) + nx * (1.75 * height),
        y: start.y + dy * (length / 2) + ny * (1.75 * height),
    };

    const q3 = {
        x: end.x - dx * (0.5 * length - 0.25 * height) + nx * 0.5 * height,
        y: end.y - dy * (0.5 * length - 0.25 * height) + ny * 0.5 * height,
    };

    const p3 = {
        x: end.x - dx * (0.5 * length - 0.5 * height) + nx * (0.5 * height),
        y: end.y - dy * (0.5 * length - 0.5 * height) + ny * (0.5 * height),
    };

    const p4 = {
        x: end.x - dx * (0.5 * height) + nx * (0.5 * height),
        y: end.y - dy * (0.5 * height) + ny * (0.5 * height),
    };

    const q4 = {
        x: end.x - dx * 0 + nx * (0.5 * height),
        y: end.y - dy * 0 + ny * (0.5 * height),
    };

    return { start, tip, end, c, q1, q2, q3, q4, p1, p2, p3, p4 };
};
