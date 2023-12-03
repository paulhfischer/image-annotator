import React, { ReactElement, useMemo } from 'react';
import Path, { PathDirection } from './common/Path';
import Triangle from './common/Triangle';
import {
    Orientation,
    Vector,
    connectionVector,
    invertOrientation,
    normalizedVector,
    vectorLength,
} from './common/utils';

export interface BraceConnectorProps {
    pointA: Vector;
    tip: Vector | undefined;
    pointB: Vector;
    labelPosition: Vector;
    orientation: Orientation;
    lineWidth: number;
    color: string;
    labelOrientation: Orientation;
    fontSize: number;
    endMarker?: boolean;
}

function BraceConnector({
    pointA,
    tip,
    pointB,
    labelPosition,
    orientation,
    lineWidth,
    color,
    labelOrientation,
    fontSize,
    endMarker,
}: BraceConnectorProps): ReactElement {
    const pathDirections: PathDirection[] = useMemo(() => {
        let start: Vector;
        let end: Vector;

        switch (orientation) {
            case 'top':
                start = pointA.x > pointB.x ? pointA : pointB;
                end = pointA.x > pointB.x ? pointB : pointA;
                break;
            case 'right':
                start = pointA.y < pointB.y ? pointB : pointA;
                end = pointA.y < pointB.y ? pointA : pointB;
                break;
            case 'bottom':
                start = pointA.x > pointB.x ? pointB : pointA;
                end = pointA.x > pointB.x ? pointA : pointB;
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
        const width = 20 * lineWidth;

        const q1 = {
            x: start.x + stretch * width * dy,
            y: start.y - stretch * width * dx,
        };
        const q2 = {
            x: start.x - 0.25 * length * dx + (1 - stretch) * width * dy,
            y: start.y - 0.25 * length * dy - (1 - stretch) * width * dx,
        };
        const t = {
            x: start.x - 0.5 * length * dx + width * dy,
            y: start.y - 0.5 * length * dy - width * dx,
        };
        const q3 = {
            x: end.x + stretch * width * dy,
            y: end.y - stretch * width * dx,
        };
        const q4 = {
            x: start.x - 0.75 * length * dx + (1 - stretch) * width * dy,
            y: start.y - 0.75 * length * dy - (1 - stretch) * width * dx,
        };

        const directions: PathDirection[] = [
            { command: 'move', target: start },
            { command: 'quadraticBezier', start: q1, end: q2 },
            { command: 'smoothQuadraticBezier', target: t },
            { command: 'move', target: end },
            { command: 'quadraticBezier', start: q3, end: q4 },
            { command: 'smoothQuadraticBezier', target: t },
        ];

        if (tip) {
            directions.push({ command: 'line', target: tip });
        }

        directions.push({ command: 'line', target: labelPosition });

        return directions;
    }, [orientation, pointA, tip, pointB, lineWidth, labelPosition]);

    return (
        <>
            <Path directions={pathDirections} lineWidth={lineWidth + 2} color="white" />
            {endMarker && (
                <Triangle
                    x={labelPosition.x}
                    y={labelPosition.y}
                    orientation={invertOrientation(labelOrientation)}
                    size={fontSize}
                    lineWidth={lineWidth}
                    color="white"
                    outline={1}
                />
            )}
            <Path directions={pathDirections} lineWidth={lineWidth} color={color} />
            {endMarker && (
                <Triangle
                    x={labelPosition.x}
                    y={labelPosition.y}
                    orientation={invertOrientation(labelOrientation)}
                    size={fontSize}
                    lineWidth={lineWidth}
                    color={color}
                />
            )}
        </>
    );
}
BraceConnector.defaultProps = {
    endMarker: false,
};

export default BraceConnector;
