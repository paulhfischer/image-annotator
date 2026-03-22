import { AnnotationType } from 'src/io/annotations';
import { AnnotationTypeType } from 'src/types';

export const availableTypes = (annotation: AnnotationType): AnnotationTypeType[] => {
    const types: AnnotationTypeType[] = ['dot', 'arrow'];

    if (annotation.nodes.length === 2 && !annotation.endNode) {
        types.push('brace');
    }

    return types;
};

export const canHaveAngle = (annotation: AnnotationType): boolean => {
    if (annotation.type === 'brace') return false;
    if (annotation.nodes.length > 1) return false;

    return true;
};

export const canHaveEndNode = (annotation: AnnotationType): boolean => {
    if (annotation.type === 'brace') return false;
    if (annotation.angle) return false;

    return true;
};
