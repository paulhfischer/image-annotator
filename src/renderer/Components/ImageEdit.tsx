import {
    Button,
    Input,
    InputOnChangeData,
    Label,
    Slider,
    SliderOnChangeData,
    makeStyles,
    useId,
} from '@fluentui/react-components';

import { DeleteFilled, DeleteRegular, bundleIcon } from '@fluentui/react-icons';
import React, { ChangeEvent, ReactElement, useMemo } from 'react';
import { useAppContext } from '../Context';
import { getImageByID } from '../Context/reducer/image';

const DeleteIcon = bundleIcon(DeleteFilled, DeleteRegular);

const useStyles = makeStyles({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '10px',
        marginBottom: '10px',
        rowGap: '10px',
    },
    row: {
        marginRight: '5px',
        marginLeft: '5px',
        width: 'calc(100% - 10px)',
        display: 'flex',
        flexDirection: 'column',
    },
});

const toAnnotationSize = (size: number): 'small' | 'medium' | 'large' => {
    switch (size) {
        case 0:
            return 'small';
        case 1:
            return 'medium';
        case 2:
            return 'large';
        default:
            throw new Error(`unknwon annotation-size ${size}!`);
    }
};

const fromAnnotationSize = (size: 'small' | 'medium' | 'large'): number => {
    switch (size) {
        case 'small':
            return 0;
        case 'medium':
            return 1;
        case 'large':
            return 2;
        default:
            throw new Error();
    }
};

function ImageEdit(): ReactElement {
    const classes = useStyles();

    const {
        state: { images, selectedImageID },
        dispatch,
    } = useAppContext();

    const selectedImage = useMemo(
        () => (selectedImageID ? getImageByID(selectedImageID, images) : undefined),
        [selectedImageID, images],
    );

    const annotationSizeID = useId();

    if (!selectedImage) {
        return <></>; // eslint-disable-line react/jsx-no-useless-fragment
    }

    const handleUpdateCleanImage = async (): Promise<void> => {
        const imageMeta = await window.ContextBridge.openImage();
        if (!imageMeta) return;

        const updatedImage = {
            ...selectedImage,
            meta: {
                ...selectedImage.meta,
                cleanContent: imageMeta.content,
                width: imageMeta.width,
                height: imageMeta.height,
            },
        };

        dispatch({ type: 'UPDATE_IMAGE', payload: updatedImage });
    };

    const handleUpdateAnnotatedImage = async (): Promise<void> => {
        const imageMeta = await window.ContextBridge.openImage();
        if (!imageMeta) return;

        const updatedImage = {
            ...selectedImage,
            meta: {
                ...selectedImage.meta,
                annotatedContent: imageMeta.content,
            },
        };

        dispatch({ type: 'UPDATE_IMAGE', payload: updatedImage });
    };

    const handleUpdateName = (
        event: ChangeEvent<HTMLInputElement>,
        data: InputOnChangeData,
    ): void => {
        const updatedImage = {
            ...selectedImage,
            name: data.value,
        };

        dispatch({ type: 'UPDATE_IMAGE', payload: updatedImage });
    };

    const handleUpdateAnnotationSize = async (
        event: ChangeEvent<HTMLInputElement>,
        data: SliderOnChangeData,
    ): Promise<void> => {
        const updatedImage = {
            ...selectedImage,
            annotationSize: toAnnotationSize(data.value),
        };

        dispatch({ type: 'UPDATE_IMAGE', payload: updatedImage });
    };

    const handleDeleteImage = async (): Promise<void> => {
        await window.ContextBridge.deleteImageInDB(selectedImage);

        dispatch({ type: 'REMOVE_IMAGE', payload: selectedImage });
    };

    return (
        <div className={classes.root}>
            <div className={classes.row}>
                <Button size="small" onClick={handleUpdateCleanImage}>
                    update clean image
                </Button>
            </div>
            <div className={classes.row}>
                <Button size="small" onClick={handleUpdateAnnotatedImage}>
                    update annotated image
                </Button>
            </div>
            <div className={classes.row}>
                <Input size="small" value={selectedImage.name} onChange={handleUpdateName} />
            </div>
            <div className={classes.row}>
                <Label size="small" htmlFor={annotationSizeID}>
                    annotation size
                </Label>
                <Slider
                    size="small"
                    id={annotationSizeID}
                    step={1}
                    min={0}
                    max={2}
                    value={fromAnnotationSize(selectedImage.annotationSize)}
                    onChange={handleUpdateAnnotationSize}
                />
            </div>
            <div className={classes.row}>
                <Button size="small" onClick={handleDeleteImage} icon={<DeleteIcon />}>
                    delete
                </Button>
            </div>
        </div>
    );
}

export default ImageEdit;
