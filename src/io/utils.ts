import { Vector } from 'src/components/Annotation/Connector/common/utils';
import { AnnotationOrientationType, AnnotationTypeType } from 'src/types';

export const parseString = (value: string): string | undefined => {
    if (value === '') return undefined;

    return value;
};

export const parseMarkdownLink = (value: string): string | undefined => {
    if (value === '' || value === '[[]]') return undefined;

    const regex = /^\[\[([^\]]+)\]\]$/.exec(value);
    if (!regex) throw new Error(`invalid markdown link: ${value}`);

    return regex[1];
};

export const parseVector = (value: string): Vector | undefined => {
    if (value === '') return undefined;

    const regex = /^\((\d+), (\d+)\)$/.exec(value);
    if (!regex) throw new Error(`invalid vector: ${value}`);

    const x = parseInt(regex[1], 10);
    if (Number.isNaN(x)) throw new Error(`invalid vector: ${value}`);

    const y = parseInt(regex[2], 10);
    if (Number.isNaN(y)) throw new Error(`invalid vector: ${value}`);

    return { x, y };
};

export const parseAngle = (value: string): number | undefined => {
    if (value === '') return undefined;

    const angle = parseInt(value, 10);
    if (Number.isNaN(angle)) throw new Error(`invalid angle: ${value}`);

    if (angle === 0) return undefined;

    return angle;
};

export const parseOrientation = (value: string): AnnotationOrientationType => {
    if (value !== 'top' && value !== 'right' && value !== 'bottom' && value !== 'left')
        throw new Error(`invalid orientation: ${value}`);

    return value;
};

export const parseType = (value: string): AnnotationTypeType => {
    if (value !== 'dot' && value !== 'arrow' && value !== 'brace')
        throw new Error(`invalid type: ${value}`);

    return value;
};
