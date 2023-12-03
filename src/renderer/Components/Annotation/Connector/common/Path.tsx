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
    lineWidth: number;
    color: string;
}
function Path({ directions, lineWidth, color }: PathProps): ReactElement {
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
            strokeWidth={lineWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    );
}

export default Path;
