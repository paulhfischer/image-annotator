import { Spinner } from '@fluentui/react-components';
import React, {
    Dispatch,
    ReactElement,
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useState,
} from 'react';
import reducer from './reducer';
import { AppContextActionType, AppContextStateType, AppContextType } from './types';

const AppContext = createContext<AppContextType | undefined>(undefined);

interface ContextProviderProps {
    state: AppContextStateType;
    dispatch: Dispatch<AppContextActionType>;
    children: ReactNode;
}
export function ContextProvider({ children, state, dispatch }: ContextProviderProps): ReactElement {
    const providerValue: AppContextType = useMemo(() => ({ state, dispatch }), [state, dispatch]);

    return <AppContext.Provider value={providerValue}>{children}</AppContext.Provider>;
}

interface AppContextProviderProps {
    children: ReactNode;
}

export function AppContextProvider({ children }: AppContextProviderProps): ReactElement {
    const [loading, setLoading] = useState<Boolean>(true);

    const [state, dispatch] = useReducer(reducer, {
        images: [],
        selectedImageID: undefined,
        selectedAnnotationID: undefined,
        selectedNodeID: undefined,
        changes: {},
        showOldAnnotations: false,
    });

    useEffect(() => {
        const fetchDatabase = async (): Promise<void> => {
            const images = await window.ContextBridge.fetchImagesFromDB();

            dispatch({
                type: 'SET_STATE',
                payload: {
                    images,
                    selectedImageID: undefined,
                    selectedAnnotationID: undefined,
                    selectedNodeID: undefined,
                    changes: {},
                    showOldAnnotations: false,
                },
            });

            setLoading(false);
        };

        fetchDatabase();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <ContextProvider state={state} dispatch={dispatch}>
            {children}
        </ContextProvider>
    );
}

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);

    if (context === undefined) {
        throw new Error();
    }

    return context;
};
