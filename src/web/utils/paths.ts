import { Orientation } from '../types';
import { Vector, connectionVector, normalizedVector, orthogonalVector, reversedVector, vectorAngleRad, vectorLength } from './vectors';

type PathDirectionMove = {
    command: 'move';
    target: Vector;
};

type PathDirectionLine = {
    command: 'line';
    target: Vector;
};

type PathDirectionQuadraticBezier = {
    command: 'quadraticBezier';
    control: Vector;
    target: Vector;
};

type PathDirectionSmoothQuadraticBezier = {
    command: 'smoothQuadraticBezier';
    target: Vector;
};

type PathDirectionCubicBezier = {
    command: 'cubicBezier';
    control1: Vector;
    control2: Vector;
    target: Vector;
};

export type PathDirection = PathDirectionMove | PathDirectionLine | PathDirectionQuadraticBezier | PathDirectionSmoothQuadraticBezier | PathDirectionCubicBezier;

export const pathDirectionsToString = (directions: PathDirection[]): string => {
    return directions
        .map((direction) => {
            switch (direction.command) {
                case 'move':
                    return `M${direction.target.x},${direction.target.y}`;
                case 'line':
                    return `L${direction.target.x},${direction.target.y}`;
                case 'quadraticBezier':
                    return `Q${direction.control.x},${direction.control.y} ${direction.target.x},${direction.target.y}`;
                case 'smoothQuadraticBezier':
                    return `T${direction.target.x},${direction.target.y}`;
                case 'cubicBezier':
                    return `C${direction.control1.x},${direction.control1.y} ${direction.control2.x},${direction.control2.y} ${direction.target.x},${direction.target.y}`;
                default:
                    throw new Error(`Unknown path direction: ${JSON.stringify(direction)}`);
            }
        })
        .join(' ');
};

export const smoothPath = (vectors: Vector[], smoothing = 0.3): PathDirection[] => {
    const controlVector = (current: Vector, previous: Vector | null, next: Vector | null, reverse: Boolean = false): Vector => {
        const connection = connectionVector(previous || current, next || current);
        const angle = reverse ? vectorAngleRad(reversedVector(connection)) : vectorAngleRad(connection);
        const length = vectorLength(connection) * smoothing;

        return {
            x: current.x + Math.cos(angle) * length,
            y: current.y + Math.sin(angle) * length,
        };
    };

    if (vectors.length === 0) {
        return [];
    }
    if (vectors.length === 1) {
        return [{ command: 'move', target: vectors[0] }];
    }
    if (vectors.length === 2) {
        return [
            { command: 'move', target: vectors[0] },
            { command: 'line', target: vectors[1] },
        ];
    }

    const directions: PathDirection[] = [];
    for (let i = 0; i < vectors.length - 1; i += 1) {
        if (i === 0) {
            directions.push({ command: 'move', target: vectors[i] });
        } else if (i === 1) {
            directions.push({
                command: 'cubicBezier',
                control1: controlVector(vectors[vectors.length - 2], vectors[vectors.length - 3], vectors[vectors.length - 1]),
                control2: controlVector(vectors[i], vectors[i - 1], vectors[i + 1], true),
                target: vectors[i],
            });
        } else {
            directions.push({
                command: 'cubicBezier',
                control1: controlVector(vectors[i - 1], vectors[i - 2], vectors[i]),
                control2: controlVector(vectors[i], vectors[i - 1], vectors[i + 1], true),
                target: vectors[i],
            });
        }
    }

    return directions;
};

export const areaPath = (vectors: Vector[], smoothing = 0.3): PathDirection[] => {
    if (vectors.length < 3) {
        return smoothPath(vectors, smoothing);
    }

    return smoothPath([...vectors, vectors[0], vectors[1]], smoothing);
};

export const bracePath = (vectorA: Vector, vectorB: Vector, orientation: Orientation, height: number = 25): PathDirection[] => {
    let start: Vector;
    let end: Vector;

    switch (orientation) {
        case 'top':
            end = vectorA.x > vectorB.x ? vectorB : vectorA;
            start = vectorA.x > vectorB.x ? vectorA : vectorB;
            break;
        case 'right':
            start = vectorA.y < vectorB.y ? vectorB : vectorA;
            end = vectorA.y < vectorB.y ? vectorA : vectorB;
            break;
        case 'bottom':
            end = vectorA.x > vectorB.x ? vectorA : vectorB;
            start = vectorA.x > vectorB.x ? vectorB : vectorA;
            break;
        case 'left':
            start = vectorA.y < vectorB.y ? vectorA : vectorB;
            end = vectorA.y < vectorB.y ? vectorB : vectorA;
            break;
        default:
            throw new Error(`Unknown orientation: ${orientation}`);
    }

    const { x: dx, y: dy } = normalizedVector(connectionVector(start, end));
    const { x: nx, y: ny } = normalizedVector(orthogonalVector(connectionVector(start, end)));

    const length = vectorLength(connectionVector(end, start));

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

    return [
        { command: 'move', target: start },
        { command: 'quadraticBezier', control: q1, target: p1 },
        { command: 'line', target: p2 },
        { command: 'quadraticBezier', control: q2, target: c },

        { command: 'move', target: end },
        { command: 'quadraticBezier', control: q4, target: p4 },
        { command: 'line', target: p3 },
        { command: 'quadraticBezier', control: q3, target: c },

        { command: 'move', target: c },
        { command: 'line', target: tip },
    ];
};

export const multiConnectorPath = (points: Vector[]): PathDirection[] => {
