import { AnnotationType, ImageType } from '@common/types';
import {
    AppContextActionAddAnnotationType,
    AppContextActionRemoveAnnotationType,
    AppContextActionSetAnnotationType,
    AppContextActionUpdateAnnotationType,
    AppContextStateType,
} from '../types';

export const getAnnotationByID = (annotationID: number, image: ImageType): AnnotationType => {
    const result = image.annotations.find((annotation) => annotation.id === annotationID);
    if (result === undefined) throw new Error();

    return result;
};

export const setAnnotation = (
    state: AppContextStateType,
    { payload }: AppContextActionSetAnnotationType,
): AppContextStateType => {
    if (state.selectedImageID === undefined) throw new Error();

    return {
        ...state,
        selectedAnnotationID: payload ? payload.id : undefined,
        selectedNodeID: undefined,
    };
};

export const addAnnotation = (
    state: AppContextStateType,
    { payload }: AppContextActionAddAnnotationType,
): AppContextStateType => {
    if (state.selectedImageID === undefined) throw new Error();

    return {
        ...state,
        images: state.images.map((image) =>
            image.id === state.selectedImageID
                ? {
                      ...image,
                      annotations: [...image.annotations, payload],
                  }
                : image,
        ),
    };
};

export const updateAnnotation = (
    state: AppContextStateType,
    { payload }: AppContextActionUpdateAnnotationType,
): AppContextStateType => {
    if (state.selectedImageID === undefined) throw new Error();

    return {
        ...state,
        images: state.images.map((image) =>
            image.id === state.selectedImageID
                ? {
                      ...image,
                      annotations: image.annotations.map((annotation) =>
                          annotation.id === payload.id ? payload : annotation,
                      ),
                  }
                : image,
        ),
        changes: {
            ...state.changes,
            [state.selectedImageID]: 'updated',
        },
    };
};

export const removeAnnotation = (
    state: AppContextStateType,
    { payload }: AppContextActionRemoveAnnotationType,
): AppContextStateType => {
    if (state.selectedImageID === undefined) throw new Error();

    return {
        ...state,
        ...(state.selectedAnnotationID === payload.id && {
            selectedAnnotationID: undefined,
            selectedNodeID: undefined,
        }),
        images: state.images.map((image) =>
            image.id === state.selectedImageID
                ? {
                      ...image,
                      annotations: image.annotations.filter(
                          (annotation) => annotation.id !== payload.id,
                      ),
                  }
                : image,
        ),
        changes: {
            ...state.changes,
            [state.selectedImageID]: 'updated',
        },
    };
};
