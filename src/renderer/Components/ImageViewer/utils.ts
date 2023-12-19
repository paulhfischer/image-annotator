import { AnnotationType, ImageType } from '@common/types';
import { tokens } from '@fluentui/react-components';
import { getLabelVector } from '../Annotation';

export const getFontSize = (image: ImageType) => {
    switch (image.annotationSize) {
        case 'small':
            return 15;
        case 'medium':
            return 25;
        case 'large':
            return 35;
        default:
            throw new Error();
    }
};

export const getBorder = (image: ImageType) => {
    return {
        x: 14 * getFontSize(image),
        y: 4 * getFontSize(image),
    };
};

export const getViewBox = (image: ImageType) => {
    return [
        -getBorder(image).x,
        -getBorder(image).y,
        image.meta.width + 2 * getBorder(image).x,
        image.meta.height + 2 * getBorder(image).y,
    ].join(' ');
};

export const getImageURL = (image: ImageType, showOldAnnotations: boolean, render?: boolean) => {
    if (render || !showOldAnnotations) {
        return `data:image/jpg;base64,${image.meta.cleanContent}`;
    }

    return `data:image/jpg;base64,${image.meta.annotatedContent || image.meta.cleanContent}`;
};

export const getLineWidth = (image: ImageType) => {
    switch (image.annotationSize) {
        case 'small':
            return 2;
        case 'medium':
            return 4;
        case 'large':
            return 6;
        default:
            throw new Error();
    }
};

export const getAnnotationColor = (
    annotation: AnnotationType,
    selectedAnnotation: AnnotationType | undefined,
    render?: boolean,
): string => {
    if (annotation === selectedAnnotation && !render) {
        return tokens.colorPaletteRedBorderActive;
    }

    return annotation.permanent ? 'gray' : 'black';
};

export const sortAnnotations = (
    annotations: AnnotationType[],
    imageWidth: number,
    imageHeight: number,
): AnnotationType[] => {
    return annotations.sort((a, b) => {
        const sides = ['top', 'right', 'bottom', 'left'];
        const sidesComparison = sides.indexOf(a.labelPosition) - sides.indexOf(b.labelPosition);

        if (sidesComparison !== 0) {
            return sidesComparison;
        }

        const labelAVector = getLabelVector(a, imageWidth, imageHeight);
        const labelBVector = getLabelVector(b, imageWidth, imageHeight);

        switch (a.labelPosition) {
            case 'top':
                return labelAVector.x - labelBVector.x;
            case 'right':
                return labelAVector.y - labelBVector.y;
            case 'bottom':
                return labelBVector.x - labelAVector.x;
            case 'left':
                return labelBVector.y - labelAVector.y;
            default:
                throw new Error();
        }
    });
};
