import React, { ReactElement, useMemo } from 'react';
import { Orientation, Vector } from './Connector/common/utils';

const getTextWidth = (text: string, fontSize: number, fontFamily: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) throw new Error();

    context.font = `${fontSize}px ${fontFamily}`;

    return context.measureText(text).width;
};

interface LabelProps {
    position: Vector;
    orientation: Orientation;
    value: string;
    color: string;
    fontSize: number;
    maxWidth: number;
}

function Label({
    position,
    orientation,
    value,
    color,
    fontSize,
    maxWidth,
}: LabelProps): ReactElement {
    const fontFamily = 'Avenir Next Condensed';

    const padding = useMemo(() => fontSize / 2, [fontSize]);

    const lines: string[] = useMemo(
        () =>
            value
                .split('\n')
                .map((line) => {
                    const words = line.split(' ');

                    const trimmedLine: string[][] = [[]];

                    words.forEach((word) => {
                        const currentLine = trimmedLine[trimmedLine.length - 1];

                        if (
                            getTextWidth([...currentLine, word].join(' '), fontSize, fontFamily) >
                            maxWidth - padding
                        ) {
                            trimmedLine.push([word]);
                        } else {
                            trimmedLine[trimmedLine.length - 1].push(word);
                        }
                    });

                    return trimmedLine;
                })
                .flat()
                .map((line) => line.join(' ')),
        [value, fontSize, maxWidth, padding],
    );

    const transform: Vector = useMemo(() => {
        switch (orientation) {
            case 'top':
                return {
                    x: position.x,
                    y: position.y - (lines.length - 1) * fontSize - padding,
                };
            case 'right':
                return {
                    x: position.x + padding,
                    y: position.y - ((lines.length - 1) * fontSize) / 2,
                };
            case 'bottom':
                return { x: position.x, y: position.y + padding };
            case 'left':
                return {
                    x: position.x - padding,
                    y: position.y - ((lines.length - 1) * fontSize) / 2,
                };
            default:
                throw new Error();
        }
    }, [lines, orientation, position, fontSize, padding]);

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
            fontFamily={fontFamily}
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
