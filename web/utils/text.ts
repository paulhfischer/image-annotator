import type { Orientation } from '../types';
import type { Vector } from './vectors';

export const getTextWidth = (text: string, fontSize: number, fontFamily: string): number => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) throw new Error();

    context.font = `${fontSize}px ${fontFamily}`;

    return context.measureText(text).width;
};

export const wrapText = (
    text: string,
    maxWidth: number,
    fontSize: number,
    fontFamily: string,
): string[] => {
    return text
        .split('\n')
        .map((line) => {
            const words = line.split(' ');

            const trimmedLine: string[][] = [[]];

            words.forEach((word) => {
                const currentLine = trimmedLine[trimmedLine.length - 1];

                if (
                    getTextWidth([...currentLine, word].join(' '), fontSize, fontFamily) >
                    maxWidth - fontSize / 2
                ) {
                    trimmedLine.push([word]);
                } else {
                    currentLine.push(word);
                }
            });

            return trimmedLine;
        })
        .flat()
        .map((line) => line.join(' '));
};

export const getTextTransform = (
    position: Vector,
    orientation: Orientation,
    numLines: number,
    fontSize: number,
): string => {
    switch (orientation) {
        case 'top':
            return `translate(${position.x}, ${position.y - (numLines - 1) * fontSize - fontSize / 2})`;
        case 'right':
            return `translate(${position.x + fontSize / 2}, ${position.y - ((numLines - 1) * fontSize) / 2})`;
        case 'bottom':
            return `translate(${position.x}, ${position.y + fontSize / 2})`;
        case 'left':
            return `translate(${position.x - fontSize / 2}, ${position.y - ((numLines - 1) * fontSize) / 2})`;
        default:
            throw new Error(`Unknown orientation: ${orientation}`);
    }
};

export const getTextAnchor = (orientation: Orientation): string => {
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
            throw new Error(`Unknown orientation: ${orientation}`);
    }
};

export const getTextBaseline = (orientation: Orientation): string => {
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
            throw new Error(`Unknown orientation: ${orientation}`);
    }
};
