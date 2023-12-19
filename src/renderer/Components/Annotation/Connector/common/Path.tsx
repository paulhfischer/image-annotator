import React, { ReactElement } from 'react';
import { Vector } from './utils';

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
    start: Vector;
    end: Vector;
};

type PathDirectionSmoothQuadraticBezier = {
    command: 'smoothQuadraticBezier';
    target: Vector;
};

export type PathDirection =
    | PathDirectionMove
    | PathDirectionLine
    | PathDirectionQuadraticBezier
    | PathDirectionSmoothQuadraticBezier;

interface PathProps {
    directions: PathDirection[];
    size: number;
    color: string;
    outline?: number;
}
function Path({ directions, size, color, outline }: PathProps): ReactElement {
    return (
        <path
            d={directions
                .map((direction) => {
                    switch (direction.command) {
                        case 'move':
                            return `M ${direction.target.x} ${direction.target.y}`;
                        case 'line':
                            return `L ${direction.target.x} ${direction.target.y}`;
                        case 'quadraticBezier':
                            return `Q ${direction.start.x},${direction.start.y} ${direction.end.x},${direction.end.y}`;
                        case 'smoothQuadraticBezier':
                            return `T ${direction.target.x},${direction.target.y}`;
                        default:
                            throw new Error();
                    }
                })
                .join(' ')}
            fill="none"
            stroke={color}
            strokeWidth={size / 2 + (outline || 0)}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    );
}
Path.defaultProps = {
    outline: undefined,
};

export default Path;
