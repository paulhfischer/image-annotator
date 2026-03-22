import React, { ReactElement, useMemo } from 'react';
import { AnnotationType } from 'src/io/annotations';
import Arrow from './common/Arrow';
import Dot from './common/Dot';
import Path, { PathDirection } from './common/Path';
import Triangle from './common/Triangle';
import {
    Vector,
    angleDeg,
    braceVectors,
    connectionVector,
    normalizedVector,
    orientationToAngle,
    rotateVector,
} from './common/utils';

const getIntermediateVector = (
    annotation: AnnotationType,
    fontSize: number,
): Vector | undefined => {
    if (annotation.type === 'brace') return undefined;

    return annotation.angle
        ? rotateVector(
              { x: annotation.nodes[0].x, y: annotation.nodes[0].y + 2 * fontSize },
              annotation.nodes[0],
              annotation.angle + orientationToAngle(annotation.orientation),
          )
        : annotation.endNode;
};

export interface ConnectorProps {
    annotation: AnnotationType;
    labelPosition: Vector;
    lineWidth: number;
    fontSize: number;
    color: string;
    marker?: boolean;
}

function Connector({
    annotation,
    labelPosition,
    lineWidth,
    fontSize,
    color,
    marker,
}: ConnectorProps): ReactElement {
    const tipSize = useMemo(() => {
        switch (annotation.type) {
            case 'dot':
                return lineWidth * 2;
            case 'arrow':
                return lineWidth * 3;
            case 'brace':
                return lineWidth;
            default:
                throw new Error();
        }
    }, [annotation.type, lineWidth]);

    const outline = useMemo(() => lineWidth / 2, [lineWidth]);

    const labelVector: Vector = useMemo(() => labelPosition, [labelPosition]);

    const intermediateVector = getIntermediateVector(annotation, fontSize);

    const nodeVectors: Vector[] = annotation.nodes.map((node) => {
        const direction = normalizedVector(
            connectionVector(intermediateVector || labelVector, node),
        );

        if (annotation.type === 'arrow') {
            return {
                x: node.x - direction.x * (tipSize / 2),
                y: node.y - direction.y * (tipSize / 2),
            };
        }

        return node;
    });

    const pathDirections: PathDirection[] = useMemo(() => {
        let directions: PathDirection[] = [];

        if (annotation.type === 'dot' || annotation.type === 'arrow') {
            directions.push({ command: 'move', target: labelVector });

            if (intermediateVector) {
                directions.push({ command: 'line', target: intermediateVector });
            }

            nodeVectors.forEach((node, index) => {
                directions.push({ command: 'line', target: node });

                if (index !== nodeVectors.length - 1) {
                    if (intermediateVector) {
                        directions.push({ command: 'move', target: intermediateVector });
                    } else {
                        directions.push({ command: 'move', target: labelVector });
                    }
                }
            });
        } else if (annotation.type === 'brace') {
            const { start, tip, end, c, q1, q2, q3, q4, p1, p2, p3, p4 } = braceVectors(
                annotation.nodes[0],
                annotation.nodes[1],
                annotation.orientation,
            );

            directions = [
                { command: 'move', target: start },
                { command: 'quadraticBezier', start: q1, end: p1 },
                { command: 'line', target: p2 },
                { command: 'quadraticBezier', start: q2, end: c },

                { command: 'move', target: end },
                { command: 'quadraticBezier', start: q4, end: p4 },
                { command: 'line', target: p3 },
                { command: 'quadraticBezier', start: q3, end: c },

                { command: 'move', target: c },
                { command: 'line', target: tip },
            ];

            directions.push({ command: 'line', target: labelVector });
        } else {
            throw new Error();
        }

        return directions;
    }, [labelVector, intermediateVector, nodeVectors, annotation]);

    return (
        <>
            <Path directions={pathDirections} size={lineWidth} outline={outline} color="white" />
            {annotation.type === 'dot' &&
                annotation.nodes.map((node, index) => (
                    <Dot
                        key={`${annotation.id}-${index}`} // eslint-disable-line react/no-array-index-key
                        x={node.x}
                        y={node.y}
                        size={tipSize}
                        color="white"
                        outline={outline}
                    />
                ))}
            {annotation.type === 'arrow' &&
                annotation.nodes.map((node, index) => (
                    <Arrow
                        key={`${annotation.id}-${index}`} // eslint-disable-line react/no-array-index-key
                        x={node.x}
                        y={node.y}
                        rotation={angleDeg(intermediateVector || labelVector, node)}
                        size={tipSize}
                        color="white"
                        outline={outline}
                    />
                ))}
            {marker && (
                <Triangle
                    x={labelPosition.x}
                    y={labelPosition.y}
                    rotation={orientationToAngle(annotation.orientation)}
                    size={fontSize}
                    tipSize={lineWidth}
                    color="white"
                    outline={outline}
                />
            )}
            <Path directions={pathDirections} size={lineWidth} color={color} />
            {annotation.type === 'dot' &&
                annotation.nodes.map((node, index) => (
                    <Dot
                        key={`${annotation.id}-${index}`} // eslint-disable-line react/no-array-index-key
                        x={node.x}
                        y={node.y}
                        size={tipSize}
                        color={color}
                    />
                ))}
            {annotation.type === 'arrow' &&
                annotation.nodes.map((node, index) => (
                    <Arrow
                        key={`${annotation.id}-${index}`} // eslint-disable-line react/no-array-index-key
                        x={node.x}
                        y={node.y}
                        rotation={angleDeg(intermediateVector || labelVector, node)}
                        size={tipSize}
                        color={color}
                    />
                ))}
            {marker && (
                <Triangle
                    x={labelPosition.x}
                    y={labelPosition.y}
                    rotation={orientationToAngle(annotation.orientation)}
                    size={fontSize}
                    tipSize={lineWidth}
                    color={color}
                />
            )}
        </>
    );
}
Connector.defaultProps = {
    marker: false,
};

export default Connector;
