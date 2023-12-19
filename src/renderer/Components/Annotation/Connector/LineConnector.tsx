import { NodeType } from '@common/types';
import React, { ReactElement, useMemo } from 'react';
import Arrow from './common/Arrow';
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
    tipType: 'circle' | 'arrow';
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
    tipType,
    startMarker,
    endMarker,
}: LineConnectorProps): ReactElement {
    const tipSize = useMemo(() => {
        switch (tipType) {
            case 'circle':
                return lineWidth * 2;
            case 'arrow':
                return lineWidth * 3;
            default:
                throw new Error();
        }
    }, [lineWidth, tipType]);

    const outline = useMemo(() => lineWidth / 2, [lineWidth]);

    const pathDirections: PathDirection[] = useMemo(() => {
        const directions: PathDirection[] = [];

        directions.push({ command: 'move', target: labelPosition });

        if (connectionNode) {
            directions.push({ command: 'line', target: connectionNode });
            directions.push({ command: 'move', target: connectionNode });
        }

        endNodes.forEach((node, index) => {
            switch (tipType) {
                case 'circle':
                    directions.push({ command: 'line', target: node });
                    break;
                case 'arrow':
                    switch (labelOrientation) {
                        case 'top':
                            directions.push({
                                command: 'line',
                                target: { x: node.x, y: node.y - tipSize / 2 },
                            });
                            break;
                        case 'right':
                            directions.push({
                                command: 'line',
                                target: { x: node.x + tipSize / 2, y: node.y },
                            });
                            break;
                        case 'bottom':
                            directions.push({
                                command: 'line',
                                target: { x: node.x, y: node.y + tipSize / 2 },
                            });
                            break;
                        case 'left':
                            directions.push({
                                command: 'line',
                                target: { x: node.x - tipSize / 2, y: node.y },
                            });
                            break;
                        default:
                            throw new Error();
                    }
                    break;
                default:
                    throw new Error();
            }

            if (index !== endNodes.length - 1) {
                if (connectionNode) {
                    directions.push({ command: 'move', target: connectionNode });
                } else {
                    directions.push({ command: 'move', target: labelPosition });
                }
            }
        });

        return directions;
    }, [endNodes, connectionNode, labelPosition, labelOrientation, tipSize, tipType]);

    return (
        <>
            <Path directions={pathDirections} size={lineWidth} outline={outline} color="white" />
            {startMarker &&
                endNodes.map((node) => {
                    switch (tipType) {
                        case 'circle':
                            return (
                                <Dot
                                    key={node.id}
                                    x={node.x}
                                    y={node.y}
                                    size={tipSize}
                                    color="white"
                                    outline={outline}
                                />
                            );
                        case 'arrow':
                            return (
                                <Arrow
                                    key={node.id}
                                    x={node.x}
                                    y={node.y}
                                    orientation={invertOrientation(labelOrientation)}
                                    size={tipSize}
                                    color="white"
                                    outline={outline}
                                />
                            );
                        default:
                            throw new Error();
                    }
                })}
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
                endNodes.map((node) => {
                    switch (tipType) {
                        case 'circle':
                            return (
                                <Dot
                                    key={node.id}
                                    x={node.x}
                                    y={node.y}
                                    size={tipSize}
                                    color={color}
                                />
                            );
                        case 'arrow':
                            return (
                                <Arrow
                                    key={node.id}
                                    x={node.x}
                                    y={node.y}
                                    orientation={invertOrientation(labelOrientation)}
                                    size={tipSize}
                                    color={color}
                                />
                            );
                        default:
                            throw new Error();
                    }
                })}
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
