import { AppContextActionSetChangesType, AppContextStateType } from '../types';

const setChanges = (
    state: AppContextStateType,
    { payload }: AppContextActionSetChangesType,
): AppContextStateType => {
    const updatedChanges = { ...state.changes };

    if (payload.changes === undefined) {
        delete updatedChanges[payload.imageID];
    } else {
        updatedChanges[payload.imageID] = payload.changes;
    }

    return {
        ...state,
        changes: updatedChanges,
    };
};

export default setChanges;
