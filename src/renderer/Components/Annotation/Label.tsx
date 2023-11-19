import React, { ReactElement, useMemo } from 'react';
import { Orientation, Vector } from './Connector/common/utils';

interface LabelProps {
    position: Vector;
    orientation: Orientation;
    value: string;
    color: string;
    fontSize: number;
}

function Label({ position, orientation, value, color, fontSize }: LabelProps): ReactElement {
    const lines: string[] = useMemo(() => value.split('\n'), [value]);

    const transform: Vector = useMemo(() => {
        switch (orientation) {
            case 'top':
                return {
                    x: position.x,
                    y: position.y - (lines.length - 1) * fontSize - fontSize / 2,
                };
            case 'right':
                return {
                    x: position.x + fontSize / 2,
                    y: position.y - ((lines.length - 1) * fontSize) / 2,
                };
            case 'bottom':
                return { x: position.x, y: position.y + fontSize / 2 };
            case 'left':
                return {
                    x: position.x - fontSize / 2,
                    y: position.y - ((lines.length - 1) * fontSize) / 2,
                };
            default:
                throw new Error();
        }
    }, [lines, orientation, position, fontSize]);

    const textAnchor: string = useMemo(() => {
        switch (orientation) {
            case 'top':
                return 'middle';
            case 'right':
                return 'start';
            case 'bottom':
                return 'middle';
            case 'left':
                return 'end';
            default:
                throw new Error();
        }
    }, [orientation]);

    const dominantBaseline: string = useMemo(() => {
        switch (orientation) {
            case 'top':
                return 'alphabetic';
            case 'right':
                return 'middle';
            case 'bottom':
                return 'hanging';
            case 'left':
                return 'middle';
            default:
                throw new Error();
        }
    }, [orientation]);

    return (
        <text
            textAnchor={textAnchor}
            transform={`translate(${transform.x}, ${transform.y})`}
            fontFamily="Avenir Next Condensed"
            fill={color}
            fontSize={fontSize}
        >
            {lines.map((line, index) => (
                <tspan
                    key={index} // eslint-disable-line react/no-array-index-key
                    x={0}
                    dy={index === 0 ? '0' : '1em'}
                    dominantBaseline={dominantBaseline}
                >
                    {line || ' '}
                </tspan>
            ))}
        </text>
    );
}

export default Label;
