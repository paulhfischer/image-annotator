// eslint-disable
import { Toolbar, ToolbarButton, ToolbarDivider } from '@fluentui/react-components';
import {
    DeleteFilled,
    DeleteRegular,
    EyeFilled,
    EyeOffFilled,
    EyeOffRegular,
    EyeRegular,
    ImageAddFilled,
    ImageAddRegular,
    SaveFilled,
    SaveRegular,
    bundleIcon,
} from '@fluentui/react-icons';
import React, { ReactElement, useMemo } from 'react';
import { renderToString } from 'react-dom/server';
import { ContextProvider, useAppContext } from '../Context';
import { getImageByID } from '../Context/reducer/image';
import createAnkiCSV from '../anki';
import SVG from './ImageViewer/SVG';

const AddImageIcon = bundleIcon(ImageAddFilled, ImageAddRegular);
const ExportSVGIcon = bundleIcon(SaveFilled, SaveRegular);
const SaveChangesIcon = bundleIcon(SaveFilled, SaveRegular);
const DiscardChangesIcon = bundleIcon(DeleteFilled, DeleteRegular);
const ShowOldAnnotationsIcon = bundleIcon(EyeFilled, EyeRegular);
const HideOldAnnotationsIcon = bundleIcon(EyeOffFilled, EyeOffRegular);

function Menu(): ReactElement {
    const { state, dispatch } = useAppContext();

    const selectedImage = useMemo(
        () =>
            state.selectedImageID ? getImageByID(state.selectedImageID, state.images) : undefined,
        [state.selectedImageID, state.images],
    );

    const handleAddImage = async (): Promise<void> => {
        const imageMeta = await window.ContextBridge.openImage();
        if (!imageMeta) return;

        const newImage = await window.ContextBridge.createImageInDB({
            name: imageMeta.filename,
            cleanContent: imageMeta.content,
            width: imageMeta.width,
            height: imageMeta.height,
        });

        dispatch({ type: 'ADD_IMAGE', payload: newImage });
        dispatch({ type: 'SET_IMAGE', payload: newImage });
    };

    const handleExportSVG = async (): Promise<void> => {
        if (!selectedImage) throw new Error();

        await window.ContextBridge.saveFile({
            content: renderToString(
                <ContextProvider state={state} dispatch={dispatch}>
                    <SVG render />
                </ContextProvider>,
            ),
            filename: `${selectedImage.name}.svg`,
        });
    };

    const handleExportAll = async (): Promise<void> => {
        await window.ContextBridge.saveFile([
            ...state.images.map((image) => {
                return {
                    content: renderToString(
                        <ContextProvider
                            state={{ ...state, selectedImageID: image.id }}
                            dispatch={dispatch}
                        >
                            <SVG render />
                        </ContextProvider>,
                    ),
                    filename: `${image.uid}.svg`,
                };
            }),
            {
                content: createAnkiCSV(state.images),
                filename: 'anki.csv',
            },
        ]);
    };

    const handleSaveChanges = async (): Promise<void> => {
        if (!selectedImage) throw new Error();

        await window.ContextBridge.updateImageInDB(selectedImage);

        dispatch({
            type: 'SET_CHANGES',
            payload: { imageID: selectedImage.id, changes: undefined },
        });
    };

    const handleDiscardChanges = async (): Promise<void> => {
        if (!selectedImage) throw new Error();

        const original = await window.ContextBridge.fetchImageFromDB(selectedImage.id);

        dispatch({ type: 'UPDATE_IMAGE', payload: original });

        dispatch({
            type: 'SET_CHANGES',
            payload: { imageID: selectedImage.id, changes: undefined },
        });
    };

    const handleToggleShowOldAnnotations = () => {
        dispatch({ type: 'SET_SHOW_OLD_ANNOTATIONS', payload: !state.showOldAnnotations });
    };

    return (
        <Toolbar>
            <ToolbarButton icon={<AddImageIcon />} onClick={handleAddImage}>
                add image
            </ToolbarButton>
            {selectedImage && (
                <ToolbarButton icon={<ExportSVGIcon />} onClick={handleExportSVG}>
                    export
                </ToolbarButton>
            )}
            <ToolbarButton icon={<ExportSVGIcon />} onClick={handleExportAll}>
                export all
            </ToolbarButton>
            {selectedImage && state.changes[selectedImage.id] && (
                <>
                    <ToolbarButton icon={<SaveChangesIcon />} onClick={handleSaveChanges}>
                        save
                    </ToolbarButton>
                    <ToolbarButton icon={<DiscardChangesIcon />} onClick={handleDiscardChanges}>
                        discard
                    </ToolbarButton>
                </>
            )}
            <ToolbarDivider />
            <ToolbarButton
                icon={
                    state.showOldAnnotations ? (
                        <ShowOldAnnotationsIcon />
                    ) : (
                        <HideOldAnnotationsIcon />
                    )
                }
                onClick={handleToggleShowOldAnnotations}
            />
        </Toolbar>
    );
}

export default Menu;
