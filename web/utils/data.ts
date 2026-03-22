import type { Orientation, TipStyle } from '../types';
import type { Dimensions } from './canvas';
import type { Vector } from './vectors';

type SingleConnectorAnnotation = {
    type: 'single-connector';
    id: number;
    label: string;
    orientation: Orientation;
    tip: Vector;
    angle: number;
    style: TipStyle;
};
const isSingleConnectorAnnotation = (annotation: any): annotation is SingleConnectorAnnotation => {
    const objectKeys = Object.keys(annotation);
    const annotationKeys = ['type', 'id', 'label', 'orientation', 'tip', 'angle', 'style'];

    return (
        objectKeys.length === annotationKeys.length &&
        objectKeys.every((key) => annotationKeys.includes(key)) &&
        annotation.type === 'single-connector'
    );
};

type MultiConnectorAnnotation = {
    type: 'multi-connector';
    id: number;
    label: string;
    orientation: Orientation;
    tips: Vector[];
    connectionPoint: Vector;
    style: TipStyle;
};
const isMultiConnectorAnnotation = (annotation: any): annotation is MultiConnectorAnnotation => {
    const objectKeys = Object.keys(annotation);
    const annotationKeys = [
        'type',
        'id',
        'label',
        'orientation',
        'tips',
        'connectionPoint',
        'style',
    ];

    return (
        objectKeys.length === annotationKeys.length &&
        objectKeys.every((key) => annotationKeys.includes(key)) &&
        annotation.type === 'multi-connector'
    );
};

type BraceAnnotation = {
    type: 'brace';
    id: number;
    label: string;
    orientation: Orientation;
    tips: [Vector, Vector];
};
const isBraceAnnotation = (annotation: any): annotation is BraceAnnotation => {
    const objectKeys = Object.keys(annotation);
    const annotationKeys = ['type', 'id', 'label', 'orientation', 'tips'];

    return (
        objectKeys.length === annotationKeys.length &&
        objectKeys.every((key) => annotationKeys.includes(key)) &&
        annotation.type === 'brace'
    );
};

type AreaAnnotation = {
    type: 'area';
    id: number;
    label: string;
    orientation: Orientation;
    points: Vector[];
};
const isAreaAnnotation = (annotation: any): annotation is AreaAnnotation => {
    const objectKeys = Object.keys(annotation);
    const annotationKeys = ['type', 'id', 'label', 'orientation', 'points'];

    return (
        objectKeys.length === annotationKeys.length &&
        objectKeys.every((key) => annotationKeys.includes(key)) &&
        annotation.type === 'area'
    );
};

export type Annotation =
    | SingleConnectorAnnotation
    | MultiConnectorAnnotation
    | BraceAnnotation
    | AreaAnnotation;

export type Image = {
    path: string;
    dimensions: Dimensions;
};

const vectorFromString = (str: string): Vector => {
    const [x, y] = str.split(',').map((n) => parseInt(n, 10));
    return { x, y };
};

const vectorToString = ({ x, y }: Vector): string => {
    return `${x},${y}`;
};

export const annotationsFromString = (str: string): Annotation[] => {
    return Array.from(str.matchAll(/{{(.*?)}}/g), (match) => match[1]).map((cloze) => {
        const parts = cloze.split(':');

        if (parts.length < 4 || parts[1] !== '' || parts[2] !== 'image-annotation') {
            throw new Error(`Invalid annotation: ${cloze}`);
        }

        const id = parseInt(parts[0].substring(1), 10);

        const type = parts[3];

        const data = parts.slice(4).reduce((acc, part) => {
            let [key, value] = part.split('=');
            key = key.replace(/-([a-z])/g, (_, match) => match.toUpperCase());

            switch (key) {
                case 'label':
                    return { ...acc, [key]: value };
                case 'orientation':
                    return { ...acc, [key]: value as Orientation };
                case 'tip':
                    return { ...acc, [key]: vectorFromString(value) };
                case 'tips':
                    return { ...acc, [key]: value.split(' ').map(vectorFromString) };
                case 'connectionPoint':
                    return { ...acc, [key]: vectorFromString(value) };
                case 'points':
                    return { ...acc, [key]: value.split(' ').map(vectorFromString) };
                case 'angle':
                    return { ...acc, [key]: parseInt(value, 10) };
                case 'style':
                    return { ...acc, [key]: value as TipStyle };
                default:
                    throw new Error(`Invalid key: ${key}`);
            }
        }, {});

        const annotation = {
            type,
            id,
            ...data,
        };

        switch (type) {
            case 'single-connector':
                if (!isSingleConnectorAnnotation(annotation)) {
                    throw new Error(`Invalid annotation: ${cloze}`);
                }
                return annotation;
            case 'multi-connector':
                if (!isMultiConnectorAnnotation(annotation)) {
                    throw new Error(`Invalid annotation: ${cloze}`);
                }
                return annotation;
            case 'brace':
                if (!isBraceAnnotation(annotation)) {
                    throw new Error(`Invalid annotation: ${cloze}`);
                }
                return annotation;
            case 'area':
                if (!isAreaAnnotation(annotation)) {
                    throw new Error(`Invalid annotation: ${cloze}`);
                }
                return annotation;
            default:
                throw new Error(`Invalid annotation type: ${type}`);
        }
    });
};

export const annotationsToString = (annotations: Annotation[]): string => {
    return annotations
        .map((annotation) => {
            switch (annotation.type) {
                case 'single-connector':
                    return `{{c${annotation.id}::image-annotation:single-connector:label=${annotation.label}:orientation=${annotation.orientation}:tip=${vectorToString(annotation.tip)}:angle=${annotation.angle}:style=${annotation.style}}}`;
                case 'multi-connector':
                    return `{{c${annotation.id}::image-annotation:multi-connector:label=${annotation.label}:orientation=${annotation.orientation}:tips=${annotation.tips.map(vectorToString).join(' ')}:connection-point=${vectorToString(annotation.connectionPoint)}:style=${annotation.style}}}`;
                case 'brace':
                    return `{{c${annotation.id}::image-annotation:brace:label=${annotation.label}:orientation=${annotation.orientation}:tips=${annotation.tips.map(vectorToString).join(' ')}}}`;
                case 'area':
                    return `{{c${annotation.id}::image-annotation:area:label=${annotation.label}:orientation=${annotation.orientation}:points=${annotation.points.map(vectorToString).join(' ')}}}`;
            }
        })
        .join('');
};

const getImageDimensions = async (src: string): Promise<Dimensions> => {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.src = src;

        img.onload = () => {
            const dimensions = {
                width: img.naturalWidth,
                height: img.naturalHeight,
            };
            resolve(dimensions);
        };

        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };
    });
};

export const imageFromString = async (str: string): Promise<Image> => {
    const document = new DOMParser().parseFromString(str, 'text/html');

    const imgElement = document.querySelector('img');
    if (!imgElement) {
        throw new Error('Image element not found');
    }

    const path = imgElement.getAttribute('src');
    if (!path) {
        throw new Error('Image path not found');
    }

    const dimensions = await getImageDimensions(path);

    return { path, dimensions };
};
