import { NodeType } from '@common/types';
import React, { ReactElement, useMemo } from 'react';
import Dot from './common/Dot';
import Path, { PathDirection } from './common/Path';
import { Vector } from './common/utils';

export interface LineConnectorProps {
    endNodes: NodeType[];
    connectionNode: Vector | undefined;
    labelPosition: Vector;
    lineWidth: number;
    color: string;
}

function LineConnector({
    endNodes,
    connectionNode,
    labelPosition,
    lineWidth,
    color,
}: LineConnectorProps): ReactElement {
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
            <Path directions={pathDirections} lineWidth={lineWidth + 2} color="white" />
            {endNodes.map((node) => (
                <Dot key={node.id} x={node.x} y={node.y} radius={lineWidth * 2 + 1} color="white" />
            ))}
            <Path directions={pathDirections} lineWidth={lineWidth} color={color} />
            {endNodes.map((node) => (
                <Dot key={node.id} x={node.x} y={node.y} radius={lineWidth * 2} color={color} />
            ))}
        </>
    );
}

export default LineConnector;
