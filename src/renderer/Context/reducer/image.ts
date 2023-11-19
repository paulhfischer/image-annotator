import { ImageType } from '@common/types';
import {
    AppContextActionAddImageType,
    AppContextActionRemoveImageType,
    AppContextActionSetImageType,
    AppContextActionUpdateImageType,
    AppContextStateType,
} from '../types';

export const getImageByID = (imageID: number, images: ImageType[]): ImageType => {
    const result = images.find((image) => image.id === imageID);
    if (result === undefined) throw new Error();

    return result;
};

export const setImage = (
    state: AppContextStateType,
    { payload }: AppContextActionSetImageType,
): AppContextStateType => {
    if (payload !== undefined && !state.images.some((image) => image.id === payload.id)) {
        throw new Error();
    }

    return {
        ...state,
        selectedImageID: payload ? payload.id : undefined,
        selectedAnnotationID: undefined,
        selectedNodeID: undefined,
    };
};

export const addImage = (
    state: AppContextStateType,
    { payload }: AppContextActionAddImageType,
): AppContextStateType => {
    return {
        ...state,
        images: [...state.images, payload],
    };
};

export const updateImage = (
    state: AppContextStateType,
    { payload }: AppContextActionUpdateImageType,
): AppContextStateType => {
    return {
        ...state,
        images: state.images.map((image) => (image.id === payload.id ? payload : image)),
        changes: {
            ...state.changes,
            [payload.id]: 'updated',
        },
    };
};

export const removeImage = (
    state: AppContextStateType,
    { payload }: AppContextActionRemoveImageType,
): AppContextStateType => {
    return {
        ...state,
        ...(state.selectedImageID === payload.id && {
            selectedImageID: undefined,
            selectedAnnotationID: undefined,
            selectedNodeID: undefined,
        }),
        images: state.images.filter((image) => image.id !== payload.id),
        changes: {
            ...state.changes,
            [payload.id]: 'deleted',
        },
    };
};
