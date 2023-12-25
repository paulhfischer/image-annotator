import { AnnotationType, NodeType } from '@common/types';
import { getNodes } from '@common/utils';
import {
    AppContextActionAddNodeType,
    AppContextActionRemoveNodeType,
    AppContextActionSetNodeType,
    AppContextActionUpdateNodeType,
    AppContextStateType,
} from '../types';

export const getNodeByID = (nodeID: number, annotation: AnnotationType): NodeType => {
    const result = getNodes(annotation).find((node) => node.id === nodeID);
    if (result === undefined) throw new Error();

    return result;
};

export const setNode = (
    state: AppContextStateType,
    { payload }: AppContextActionSetNodeType,
): AppContextStateType => {
    if (state.selectedImageID === undefined) throw new Error();
    if (state.selectedAnnotationID === undefined) throw new Error();

    return {
        ...state,
        selectedNodeID: payload ? payload.id : undefined,
    };
};

export const addNode = (
    state: AppContextStateType, // eslint-disable-line @typescript-eslint/no-unused-vars
    { payload }: AppContextActionAddNodeType, // eslint-disable-line @typescript-eslint/no-unused-vars
): AppContextStateType => {
    throw new Error('not implemented');
};

export const updateNode = (
    state: AppContextStateType,
    { payload }: AppContextActionUpdateNodeType,
): AppContextStateType => {
    if (state.selectedImageID === undefined) throw new Error();
    if (state.selectedAnnotationID === undefined) throw new Error();

    return {
        ...state,
        images: state.images.map((image) =>
            image.id === state.selectedImageID
                ? {
                      ...image,
                      annotations: image.annotations.map((annotation) => {
                          if (annotation.id !== state.selectedAnnotationID) return annotation;

                          switch (annotation.type) {
                              case 'line':
                                  return {
                                      ...annotation,
                                      ...(annotation.connectionNode?.id === payload.id
                                          ? { connectionNode: payload }
                                          : {
                                                endNodes: annotation.endNodes.map((node) =>
                                                    node.id === payload.id ? payload : node,
                                                ),
                                            }),
                                  };
                              case 'brace':
                                  return {
                                      ...annotation,
                                      ...(annotation.connectionNode?.id === payload.id
                                          ? { connectionNode: payload }
                                          : {}),
                                      ...(annotation.nodeA.id === payload.id
                                          ? { nodeA: payload }
                                          : {}),
                                      ...(annotation.nodeB.id === payload.id
                                          ? { nodeB: payload }
                                          : {}),
                                  };
                              default:
                                  throw new Error();
                          }
                      }),
                  }
                : image,
        ),
        changes: {
            ...state.changes,
            [state.selectedImageID]: 'updated',
        },
    };
};

export const removeNode = (
    state: AppContextStateType,
    { payload }: AppContextActionRemoveNodeType,
): AppContextStateType => {
    if (state.selectedImageID === undefined) throw new Error();
    if (state.selectedAnnotationID === undefined) throw new Error();

    return {
        ...state,
        ...(state.selectedNodeID === payload.id && {
            selectedNodeID: undefined,
        }),
        images: state.images.map((image) =>
            image.id === state.selectedImageID
                ? {
                      ...image,
                      annotations: image.annotations.map((annotation) => {
                          if (annotation.id !== state.selectedAnnotationID) return annotation;

                          switch (annotation.type) {
                              case 'line':
                                  return {
                                      ...annotation,
                                      ...(annotation.connectionNode?.id === payload.id
                                          ? { connectionNode: undefined }
                                          : {
                                                endNodes: annotation.endNodes.filter(
                                                    (node) => node.id !== payload.id,
                                                ),
                                            }),
                                  };
                              case 'brace':
                                  return {
                                      ...annotation,
                                      ...(annotation.connectionNode?.id === payload.id
                                          ? { connectionNode: undefined }
                                          : {
                                                type: 'line',
                                                endNodes: [
                                                    annotation.nodeA,
                                                    annotation.nodeB,
                                                ].filter((node) => node.id !== payload.id),
                                            }),
                                  };
                              default:
                                  throw new Error();
                          }
                      }),
                  }
                : image,
        ),
        changes: {
            ...state.changes,
            [state.selectedImageID]: 'updated',
        },
    };
};
