import { NewNodeType, NodeType } from '@common/types';

export const getEndNodes = <T extends NodeType | NewNodeType>(
    annotation: { type: 'line'; endNodes: T[] } | { type: 'brace'; nodeA: T; nodeB: T },
): T[] => {
    switch (annotation.type) {
        case 'line': {
            return annotation.endNodes;
        }
        case 'brace': {
            return [annotation.nodeA, annotation.nodeB];
        }
        default: {
            throw new Error();
        }
    }
};

export const getSpecialNode = <T extends NodeType | NewNodeType>(
    annotation: { type: 'line'; connectionNode?: T } | { type: 'brace'; connectionNode?: T },
): T | undefined => {
    switch (annotation.type) {
        case 'line': {
            return annotation.connectionNode;
        }
        case 'brace': {
            return annotation.connectionNode;
        }
        default: {
            throw new Error();
        }
    }
};

export const getNodes = <T extends NodeType | NewNodeType>(
    annotation:
        | { type: 'line'; endNodes: T[]; connectionNode?: T }
        | { type: 'brace'; nodeA: T; tip?: T; nodeB: T },
): T[] => {
    const specialNode = getSpecialNode(annotation);

    return [...getEndNodes(annotation), ...(specialNode ? [specialNode] : [])];
};
