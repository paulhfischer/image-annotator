import React, { ReactElement, useMemo } from 'react';
import Path, { PathDirection } from './common/Path';
import Triangle from './common/Triangle';
import { Orientation, Vector, angleDeg, braceVectors, orientationToAngle } from './common/utils';

export interface BraceConnectorProps {
    pointA: Vector;
    connectionNode: Vector | undefined;
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
    connectionNode,
    pointB,
    labelPosition,
    orientation,
    lineWidth,
    color,
    labelOrientation,
    fontSize,
    endMarker,
}: BraceConnectorProps): ReactElement {
    const outline = useMemo(() => lineWidth / 2, [lineWidth]);

    const pathDirections: PathDirection[] = useMemo(() => {
        const { start, tip, end, s, q1, q2, c, q3, q4, e } = braceVectors(
            pointA,
            pointB,
            orientation,
        );

        const directions: PathDirection[] = [
            { command: 'move', target: start },
            { command: 'line', target: s },
            { command: 'quadraticBezier', start: q1, end: q2 },
            { command: 'smoothQuadraticBezier', target: c },

            { command: 'move', target: end },
            { command: 'line', target: e },
            { command: 'quadraticBezier', start: q3, end: q4 },
            { command: 'smoothQuadraticBezier', target: c },

            { command: 'move', target: c },
            { command: 'line', target: tip },
        ];

        if (connectionNode) {
            directions.push({ command: 'line', target: connectionNode });
        }

        directions.push({ command: 'line', target: labelPosition });

        return directions;
    }, [orientation, pointA, connectionNode, pointB, labelPosition]);

    return (
        <>
            <Path directions={pathDirections} size={lineWidth} outline={outline} color="white" />
            {endMarker && (
                <Triangle
                    x={labelPosition.x}
                    y={labelPosition.y}
                    rotation={
                        connectionNode
                            ? angleDeg(labelPosition, connectionNode)
                            : orientationToAngle(labelOrientation)
                    }
                    size={fontSize}
                    tipSize={lineWidth}
                    color="white"
                    outline={outline}
                />
            )}
            <Path directions={pathDirections} size={lineWidth} color={color} />
            {endMarker && (
                <Triangle
                    x={labelPosition.x}
                    y={labelPosition.y}
                    rotation={
                        connectionNode
                            ? angleDeg(labelPosition, connectionNode)
                            : orientationToAngle(labelOrientation)
                    }
                    size={fontSize}
                    tipSize={lineWidth}
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
