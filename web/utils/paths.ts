import { type Orientation, type TipStyle } from '../types';
import { getTipSize, type Dimensions } from './canvas';
import {
    connectionVector,
    normalizedVector,
    orthogonalVector,
    reversedVector,
    tailBendVector,
    vectorAngleRad,
    vectorLength,
    type Vector,
} from './vectors';

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

export type PathDirection =
    | PathDirectionMove
    | PathDirectionLine
    | PathDirectionQuadraticBezier
    | PathDirectionSmoothQuadraticBezier
    | PathDirectionCubicBezier;

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

export const smoothPath = (points: Vector[], smoothing = 0.3): PathDirection[] => {
    const controlPoint = (
        current: Vector,
        previous: Vector | null,
        next: Vector | null,
        reverse: Boolean = false,
    ): Vector => {
        const connection = connectionVector(previous || current, next || current);
        const angle = reverse
            ? vectorAngleRad(reversedVector(connection))
            : vectorAngleRad(connection);
        const length = vectorLength(connection) * smoothing;

        return {
            x: current.x + Math.cos(angle) * length,
            y: current.y + Math.sin(angle) * length,
        };
    };

    if (points.length === 0) {
        return [];
    }
    if (points.length === 1) {
        return [{ command: 'move', target: points[0] }];
    }
    if (points.length === 2) {
        return [
            { command: 'move', target: points[0] },
            { command: 'line', target: points[1] },
        ];
    }

    const directions: PathDirection[] = [];
    for (let i = 0; i < points.length - 1; i += 1) {
        if (i === 0) {
            directions.push({ command: 'move', target: points[i] });
        } else if (i === 1) {
            directions.push({
                command: 'cubicBezier',
                control1: controlPoint(
                    points[points.length - 2],
                    points[points.length - 3],
                    points[points.length - 1],
                ),
                control2: controlPoint(points[i], points[i - 1], points[i + 1], true),
                target: points[i],
            });
        } else {
            directions.push({
                command: 'cubicBezier',
                control1: controlPoint(points[i - 1], points[i - 2], points[i]),
                control2: controlPoint(points[i], points[i - 1], points[i + 1], true),
                target: points[i],
            });
        }
    }

    return directions;
};

export const areaPath = (points: Vector[], smoothing = 0.3): PathDirection[] => {
    if (points.length < 3) {
        return smoothPath(points, smoothing);
    }

    return smoothPath([...points, points[0], points[1]], smoothing);
};

export const bracePath = (
    pointA: Vector,
    pointB: Vector,
    orientation: Orientation,
    height: number = 25,
): PathDirection[] => {
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

export const singleConnectorPath = (
    tip: Vector,
    angleDeg: number,
    labelPosition: Vector,
    tipType: TipStyle,
    canvasDimensions: Dimensions,
    orientation: Orientation,
): PathDirection[] => {
    const directions: PathDirection[] = [];

    const tailBendPosition = tailBendVector(tip, angleDeg, canvasDimensions, orientation);
    const direction = normalizedVector(connectionVector(tailBendPosition, tip));

    directions.push({ command: 'move', target: labelPosition });
    directions.push({ command: 'line', target: tailBendPosition });

    switch (tipType) {
        case 'dot':
            directions.push({ command: 'line', target: tip });
            break;
        case 'arrow':
            directions.push({
                command: 'line',
                target: {
                    x: tip.x - direction.x * getTipSize(canvasDimensions),
                    y: tip.y - direction.y * getTipSize(canvasDimensions),
                },
            });
            break;
        default:
            throw new Error(`Unknown tip type: ${tipType}`);
    }

    return directions;
};

export const multiConnectorPath = (
    tips: Vector[],
    connectionPoint: Vector,
    labelPosition: Vector,
    tipType: TipStyle,
    canvasDimensions: Dimensions,
): PathDirection[] => {
    const directions: PathDirection[] = [];

    directions.push({ command: 'move', target: labelPosition });
    directions.push({ command: 'line', target: connectionPoint });
    directions.push({ command: 'move', target: connectionPoint });

    tips.forEach((tip, index) => {
        const direction = normalizedVector(connectionVector(connectionPoint, tip));

        switch (tipType) {
            case 'dot':
                directions.push({ command: 'line', target: tip });
                break;
            case 'arrow':
                directions.push({
                    command: 'line',
                    target: {
                        x: tip.x - direction.x * getTipSize(canvasDimensions),
                        y: tip.y - direction.y * getTipSize(canvasDimensions),
                    },
                });
                break;
            default:
                throw new Error(`Unknown tip type: ${tipType}`);
        }

        if (index !== tips.length - 1) {
            directions.push({
                command: 'move',
                target: connectionPoint,
            });
        }
    });

    return directions;
};
