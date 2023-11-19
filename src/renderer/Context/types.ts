import { AnnotationType, ImageType, NodeType } from '@common/types';
import { Dispatch } from 'react';

export type AppContextStateType = {
    images: ImageType[];
    selectedImageID: number | undefined;
    selectedAnnotationID: number | undefined;
    selectedNodeID: number | undefined;
    changes: Record<number, 'updated' | 'deleted'>;
    showOldAnnotations: boolean;
};

export type AppContextActionSetImageType = {
    type: 'SET_IMAGE';
    payload: ImageType | undefined;
};
export type AppContextActionAddImageType = {
    type: 'ADD_IMAGE';
    payload: ImageType;
};
export type AppContextActionUpdateImageType = {
    type: 'UPDATE_IMAGE';
    payload: ImageType;
};
export type AppContextActionRemoveImageType = {
    type: 'REMOVE_IMAGE';
    payload: ImageType;
};
export type AppContextActionSetAnnotationType = {
    type: 'SET_ANNOTATION';
    payload: AnnotationType | undefined;
};
export type AppContextActionAddAnnotationType = {
    type: 'ADD_ANNOTATION';
    payload: AnnotationType;
};
export type AppContextActionUpdateAnnotationType = {
    type: 'UPDATE_ANNOTATION';
    payload: AnnotationType;
};
export type AppContextActionRemoveAnnotationType = {
    type: 'REMOVE_ANNOTATION';
    payload: AnnotationType;
};
export type AppContextActionSetNodeType = {
    type: 'SET_NODE';
    payload: NodeType | undefined;
};
export type AppContextActionAddNodeType = {
    type: 'ADD_NODE';
    payload: NodeType;
};
export type AppContextActionUpdateNodeType = {
    type: 'UPDATE_NODE';
    payload: NodeType;
};
export type AppContextActionRemoveNodeType = {
    type: 'REMOVE_NODE';
    payload: NodeType;
};
export type AppContextActionSetChangesType = {
    type: 'SET_CHANGES';
    payload: { imageID: number; changes: 'updated' | 'deleted' | undefined };
};
export type AppContextActionSetShowOldAnnotationsType = {
    type: 'SET_SHOW_OLD_ANNOTATIONS';
    payload: boolean;
};
export type AppContextActionSetStateType = {
    type: 'SET_STATE';
    payload: AppContextStateType;
};
export type AppContextActionType =
    | AppContextActionSetImageType
    | AppContextActionAddImageType
    | AppContextActionUpdateImageType
    | AppContextActionRemoveImageType
    | AppContextActionSetAnnotationType
    | AppContextActionAddAnnotationType
    | AppContextActionUpdateAnnotationType
    | AppContextActionRemoveAnnotationType
    | AppContextActionSetNodeType
    | AppContextActionAddNodeType
    | AppContextActionUpdateNodeType
    | AppContextActionRemoveNodeType
    | AppContextActionSetChangesType
    | AppContextActionSetShowOldAnnotationsType
    | AppContextActionSetStateType;

export type AppContextType = {
    state: AppContextStateType;
    dispatch: Dispatch<AppContextActionType>;
};
