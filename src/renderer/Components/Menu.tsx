// eslint-disable
import {
    Popover,
    PopoverSurface,
    PopoverTrigger,
    Toolbar,
    ToolbarButton,
    ToolbarDivider,
    Tooltip,
} from '@fluentui/react-components';
import {
    DeleteFilled,
    DeleteRegular,
    EyeFilled,
    EyeOffFilled,
    EyeOffRegular,
    EyeRegular,
    ImageAddFilled,
    ImageAddRegular,
    ImageFilled,
    ImageOffFilled,
    ImageOffRegular,
    ImageRegular,
    SaveEditFilled,
    SaveEditRegular,
    SaveFilled,
    SaveMultipleFilled,
    SaveMultipleRegular,
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
const ExportIcon = bundleIcon(SaveFilled, SaveRegular);
const ExportAllIcon = bundleIcon(SaveMultipleFilled, SaveMultipleRegular);
const ImageWithMarkersIcon = bundleIcon(ImageFilled, ImageRegular);
const ImageWithoutMarkersIcon = bundleIcon(ImageOffFilled, ImageOffRegular);
const SaveChangesIcon = bundleIcon(SaveEditFilled, SaveEditRegular);
const DiscardChangesIcon = bundleIcon(DeleteFilled, DeleteRegular);
const ShowAnnotatedImageIcon = bundleIcon(EyeFilled, EyeRegular);
const HideAnnotatedImageIcon = bundleIcon(EyeOffFilled, EyeOffRegular);

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

    const handleExport = async (markers: boolean): Promise<void> => {
        if (!selectedImage) throw new Error();

        await window.ContextBridge.saveFile({
            content: renderToString(
                <ContextProvider state={state} dispatch={dispatch}>
                    <SVG render markers={markers} />
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
                            <SVG render markers />
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

    const handleToggleAnnotatedImage = () => {
        dispatch({ type: 'SET_SHOW_ANNOTATED_IMAGE', payload: !state.showAnnotatedImage });
    };

    return (
        <Toolbar>
            <Tooltip content="add image" relationship="label" withArrow>
                <ToolbarButton icon={<AddImageIcon />} onClick={handleAddImage} />
            </Tooltip>
            <ToolbarDivider />
            {selectedImage && (
                <Popover withArrow trapFocus size="small">
                    <PopoverTrigger disableButtonEnhancement>
                        <Tooltip content="export current image" relationship="label" withArrow>
                            <ToolbarButton icon={<ExportIcon />} />
                        </Tooltip>
                    </PopoverTrigger>
                    <PopoverSurface>
                        <Toolbar size="small">
                            <Tooltip content="with markers" relationship="label" withArrow>
                                <ToolbarButton
                                    icon={<ImageWithMarkersIcon />}
                                    onClick={() => handleExport(true)}
                                />
                            </Tooltip>
                            <Tooltip content="without markers" relationship="label" withArrow>
                                <ToolbarButton
                                    icon={<ImageWithoutMarkersIcon />}
                                    onClick={() => handleExport(false)}
                                />
                            </Tooltip>
                        </Toolbar>
                    </PopoverSurface>
                </Popover>
            )}
            <Tooltip content="export all images" relationship="label" withArrow>
                <ToolbarButton icon={<ExportAllIcon />} onClick={handleExportAll} />
            </Tooltip>
            {selectedImage && state.changes[selectedImage.id] && (
                <>
                    <ToolbarDivider />
                    <Tooltip content="save changes" relationship="label" withArrow>
                        <ToolbarButton icon={<SaveChangesIcon />} onClick={handleSaveChanges} />
                    </Tooltip>
                    <Tooltip content="discard changes" relationship="label" withArrow>
                        <ToolbarButton
                            icon={<DiscardChangesIcon />}
                            onClick={handleDiscardChanges}
                        />
                    </Tooltip>
                </>
            )}
            {selectedImage && (
                <>
                    <ToolbarDivider />
                    <Tooltip content="toggle annotated image" relationship="label" withArrow>
                        <ToolbarButton
                            icon={
                                state.showAnnotatedImage ? (
                                    <HideAnnotatedImageIcon />
                                ) : (
                                    <ShowAnnotatedImageIcon />
                                )
                            }
                            onClick={handleToggleAnnotatedImage}
                        />
                    </Tooltip>
                </>
            )}
        </Toolbar>
    );
}

export default Menu;
