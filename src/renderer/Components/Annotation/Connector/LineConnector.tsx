import { NodeType } from '@common/types';
import React, { ReactElement, useMemo } from 'react';
import Dot from './common/Dot';
import Path, { PathDirection } from './common/Path';
import Triangle from './common/Triangle';
import { Orientation, Vector, invertOrientation } from './common/utils';

export interface LineConnectorProps {
    endNodes: NodeType[];
    connectionNode: Vector | undefined;
    labelPosition: Vector;
    lineWidth: number;
    color: string;
    labelOrientation: Orientation;
    fontSize: number;
    startMarker?: boolean;
    endMarker?: boolean;
}

function LineConnector({
    endNodes,
    connectionNode,
    labelPosition,
    lineWidth,
    color,
    labelOrientation,
    fontSize,
    startMarker,
    endMarker,
}: LineConnectorProps): ReactElement {
    const tipSize = useMemo(() => lineWidth * 2, [lineWidth]);

    const outline = useMemo(() => lineWidth / 2, [lineWidth]);

    const pathDirections: PathDirection[] = useMemo(() => {
        const directions: PathDirection[] = [];

        directions.push({ command: 'move', target: labelPosition });

        if (connectionNode) {
            directions.push({ command: 'line', target: connectionNode });
            directions.push({ command: 'move', target: connectionNode });
        }

        endNodes.forEach((node, index) => {
            directions.push({ command: 'line', target: node });

            if (index !== endNodes.length - 1) {
                if (connectionNode) {
                    directions.push({ command: 'move', target: connectionNode });
                } else {
                    directions.push({ command: 'move', target: labelPosition });
                }
            }
        });

        return directions;
    }, [endNodes, connectionNode, labelPosition]);

    return (
        <>
            <Path directions={pathDirections} size={lineWidth} outline={outline} color="white" />
            {startMarker &&
                endNodes.map((node) => (
                    <Dot
                        key={node.id}
                        x={node.x}
                        y={node.y}
                        size={tipSize}
                        color="white"
                        outline={outline}
                    />
                ))}
            {endMarker && (
                <Triangle
                    x={labelPosition.x}
                    y={labelPosition.y}
                    orientation={invertOrientation(labelOrientation)}
                    size={fontSize}
                    lineWidth={lineWidth}
                    color="white"
                    outline={outline}
                />
            )}
            <Path directions={pathDirections} size={lineWidth} color={color} />
            {startMarker &&
                endNodes.map((node) => (
                    <Dot key={node.id} x={node.x} y={node.y} size={tipSize} color={color} />
                ))}
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
LineConnector.defaultProps = {
    startMarker: false,
    endMarker: false,
};

export default LineConnector;
