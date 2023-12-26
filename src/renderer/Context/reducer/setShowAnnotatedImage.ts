import { AppContextActionSetShowAnnotatedImageType, AppContextStateType } from '../types';

const setShowAnnotatedImage = (
    state: AppContextStateType,
    { payload }: AppContextActionSetShowAnnotatedImageType,
): AppContextStateType => {
    return {
        ...state,
        showAnnotatedImage: payload,
    };
};

export default setShowAnnotatedImage;
