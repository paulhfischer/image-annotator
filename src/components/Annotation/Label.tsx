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
    alignment: Orientation;
    value: string;
    color: string;
    fontSize: number;
    maxWidth: number;
}

function Label({
    position,
    alignment,
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
        switch (alignment) {
            case 'bottom':
                return {
                    x: position.x,
                    y: position.y - (lines.length - 1) * fontSize - padding,
                };
            case 'left':
                return {
                    x: position.x + padding,
                    y: position.y - ((lines.length - 1) * fontSize) / 2,
                };
            case 'top':
                return { x: position.x, y: position.y + padding };
            case 'right':
                return {
                    x: position.x - padding,
                    y: position.y - ((lines.length - 1) * fontSize) / 2,
                };
            default:
                throw new Error();
        }
    }, [lines, alignment, position, fontSize, padding]);

    const textAnchor: string = useMemo(() => {
        switch (alignment) {
            case 'bottom':
                return 'middle';
            case 'left':
                return 'start';
            case 'top':
                return 'middle';
            case 'right':
                return 'end';
            default:
                throw new Error();
        }
    }, [alignment]);

    const dominantBaseline: string = useMemo(() => {
        switch (alignment) {
            case 'bottom':
                return 'alphabetic';
            case 'left':
                return 'middle';
            case 'top':
                return 'hanging';
            case 'right':
                return 'middle';
            default:
                throw new Error();
        }
    }, [alignment]);

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
