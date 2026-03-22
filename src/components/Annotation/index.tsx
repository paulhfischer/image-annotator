import React, { ReactElement } from 'react';
import { AnnotationType } from 'src/io/annotations';
import Connector from './Connector';
import {
    braceVectors,
    centerVector,
    invertOrientation,
    orientationToAngle,
    rotateVector,
} from './Connector/common/utils';
import Label from './Label';

export const getLabelVector = (
    annotation: AnnotationType,
    fontSize: number,
    imageWidth: number,
    imageHeight: number,
): { x: number; y: number } => {
    let lastPos;
    if (annotation.type === 'brace') {
        lastPos = braceVectors(
            annotation.nodes[0],
            annotation.nodes[1],
            annotation.orientation,
        ).tip;
    } else if (annotation.angle) {
        lastPos = rotateVector(
            { x: annotation.nodes[0].x, y: annotation.nodes[0].y + 2 * fontSize },
            annotation.nodes[0],
            annotation.angle + orientationToAngle(annotation.orientation),
        );
    } else {
        lastPos = annotation.endNode || centerVector(annotation.nodes);
    }

    switch (annotation.orientation) {
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
    markers: boolean;
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
    markers,
}: AnnotationProps): ReactElement {
    const labelPosition = getLabelVector(annotation, fontSize, imageWidth, imageHeight);

    return (
        <g id={id.toString()}>
            {markers && (
                <g className="marker">
                    <Connector
                        annotation={annotation}
                        labelPosition={labelPosition}
                        lineWidth={lineWidth}
                        fontSize={fontSize}
                        color="red"
                        marker
                    />
                </g>
            )}
            <g className="label">
                <Label
                    position={labelPosition}
                    alignment={invertOrientation(annotation.orientation)}
                    value={annotation.label || annotation.id || 'unnamed'}
                    fontSize={fontSize}
                    color={color}
                    maxWidth={maxLabelWidth}
                />
                <Connector
                    annotation={annotation}
                    labelPosition={labelPosition}
                    lineWidth={lineWidth}
                    fontSize={fontSize}
                    color={color}
                />
            </g>
        </g>
    );
}

export default Annotation;
