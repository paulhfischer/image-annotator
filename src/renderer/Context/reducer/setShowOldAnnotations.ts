import { AppContextActionSetShowOldAnnotationsType, AppContextStateType } from '../types';

const setShowOldAnnotations = (
    state: AppContextStateType,
    { payload }: AppContextActionSetShowOldAnnotationsType,
): AppContextStateType => {
    return {
        ...state,
        showOldAnnotations: payload,
    };
};

export default setShowOldAnnotations;
