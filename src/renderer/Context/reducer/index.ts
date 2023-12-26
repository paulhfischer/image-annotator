import { AppContextActionType, AppContextStateType } from '../types';
import { addAnnotation, removeAnnotation, setAnnotation, updateAnnotation } from './annotation';
import { addImage, removeImage, setImage, updateImage } from './image';
import { addNode, removeNode, setNode, updateNode } from './node';
import setChanges from './setChanges';
import setShowAnnotatedImage from './setShowAnnotatedImage';
import setState from './setState';

const reducer = (state: AppContextStateType, action: AppContextActionType): AppContextStateType => {
    switch (action.type) {
        case 'SET_IMAGE': {
            return setImage(state, action);
        }
        case 'ADD_IMAGE': {
            return addImage(state, action);
        }
        case 'UPDATE_IMAGE': {
            return updateImage(state, action);
        }
        case 'REMOVE_IMAGE': {
            return removeImage(state, action);
        }
        case 'SET_ANNOTATION': {
            return setAnnotation(state, action);
        }
        case 'ADD_ANNOTATION': {
            return addAnnotation(state, action);
        }
        case 'UPDATE_ANNOTATION': {
            return updateAnnotation(state, action);
        }
        case 'REMOVE_ANNOTATION': {
            return removeAnnotation(state, action);
        }
        case 'SET_NODE': {
            return setNode(state, action);
        }
        case 'ADD_NODE': {
            return addNode(state, action);
        }
        case 'UPDATE_NODE': {
            return updateNode(state, action);
        }
        case 'REMOVE_NODE': {
            return removeNode(state, action);
        }
        case 'SET_CHANGES': {
            return setChanges(state, action);
        }
        case 'SET_SHOW_ANNOTATED_IMAGE': {
            return setShowAnnotatedImage(state, action);
        }
        case 'SET_STATE': {
            return setState(state, action);
        }
        default: {
            throw new Error();
        }
    }
};

export default reducer;
