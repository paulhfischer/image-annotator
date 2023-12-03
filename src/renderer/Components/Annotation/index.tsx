import { AnnotationType } from '@common/types';
import React, { ReactElement, useMemo } from 'react';
import Connector from './Connector';
import { braceVectors, centerVector } from './Connector/common/utils';
import Label from './Label';

export const getLabelVector = (
    annotation: AnnotationType,
    imageWidth: number,
    imageHeight: number,
): { x: number; y: number } => {
    let lastPos;
    switch (annotation.type) {
        case 'line':
            lastPos = annotation.connectionNode || centerVector(annotation.endNodes);
            break;
        case 'brace':
            lastPos =
                annotation.connectionNode ||
                braceVectors(annotation.nodeA, annotation.nodeB, annotation.labelPosition).tip;
            break;
        default:
            throw new Error();
    }

    switch (annotation.labelPosition) {
        case 'top':
            return { x: lastPos.x, y: 0 };
        case 'bottom':
            return { x: lastPos.x, y: imageHeight };
        case 'left':
            return { x: 0, y: lastPos.y };
        case 'right':
            return { x: imageWidth, y: lastPos.y };
        default:
            throw new Error();
    }
};
interface AnnotationProps {
    id: number;
    annotation: AnnotationType;
    lineWidth: number;
    fontSize: number;
    color: string;
    imageWidth: number;
    imageHeight: number;
    maxLabelWidth: number;
    render: boolean;
}

function Annotation({
    id,
    annotation,
    lineWidth,
    fontSize,
    color,
    imageWidth,
    imageHeight,
    maxLabelWidth,
    render,
}: AnnotationProps): ReactElement {
    const labelPosition = useMemo(
        () => getLabelVector(annotation, imageWidth, imageHeight),
        [annotation, imageWidth, imageHeight],
    );

    switch (annotation.type) {
        case 'line':
            return (
                <g id={id.toString()} className={annotation.permanent ? 'permanent' : undefined}>
                    {!annotation.permanent && (
                        <g className="marker" style={render ? undefined : { display: 'none' }}>
                            <Connector
                                type="line"
                                endNodes={annotation.endNodes}
                                connectionNode={annotation.connectionNode}
                                labelPosition={labelPosition}
                                lineWidth={lineWidth}
                                color="red"
                                labelOrientation={annotation.labelPosition}
                                fontSize={fontSize}
                                startMarker
                                endMarker
                            />
                        </g>
                    )}
                    <g className="label">
                        <Label
                            position={labelPosition}
                            orientation={annotation.labelPosition}
                            value={annotation.label || `unnamed-${annotation.id}`}
                            fontSize={fontSize}
                            color={color}
                            maxWidth={maxLabelWidth}
                        />
                        <Connector
                            type="line"
                            endNodes={annotation.endNodes}
                            connectionNode={annotation.connectionNode}
                            labelPosition={labelPosition}
                            lineWidth={lineWidth}
                            color={color}
                            labelOrientation={annotation.labelPosition}
                            fontSize={fontSize}
                            startMarker
                        />
                    </g>
                </g>
            );
        case 'brace':
            return (
                <g id={id.toString()}>
                    {!annotation.permanent && (
                        <g className="marker" style={render ? undefined : { display: 'none' }}>
                            <Connector
                                type="brace"
                                pointA={annotation.nodeA}
                                connectionNode={annotation.connectionNode}
                                pointB={annotation.nodeB}
                                labelPosition={labelPosition}
                                orientation={annotation.labelPosition}
                                lineWidth={lineWidth}
                                color="red"
                                labelOrientation={annotation.labelPosition}
                                fontSize={fontSize}
                                endMarker
                            />
                        </g>
                    )}
                    <g className="label">
                        <Label
                            position={labelPosition}
                            orientation={annotation.labelPosition}
                            value={annotation.label || `unnamed-${annotation.id}`}
                            fontSize={fontSize}
                            color={color}
                            maxWidth={maxLabelWidth}
                        />
                        <Connector
                            type="brace"
                            pointA={annotation.nodeA}
                            connectionNode={annotation.connectionNode}
                            pointB={annotation.nodeB}
                            labelPosition={labelPosition}
                            orientation={annotation.labelPosition}
                            lineWidth={lineWidth}
                            color={color}
                            labelOrientation={annotation.labelPosition}
                            fontSize={fontSize}
                        />
                    </g>
                </g>
            );
        default:
            throw new Error();
    }
}

export default Annotation;
