import { AppContextActionSetStateType, AppContextStateType } from '../types';

const setState = (
    state: AppContextStateType,
    { payload }: AppContextActionSetStateType,
): AppContextStateType => {
    return payload;
};

export default setState;
