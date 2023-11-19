import {
    SelectTabData,
    SelectTabEvent,
    Tab,
    TabList,
    makeStyles,
    tokens,
} from '@fluentui/react-components';
import { DatabaseWarningFilled, DatabaseWarningRegular, bundleIcon } from '@fluentui/react-icons';
import React, { ReactElement, useMemo } from 'react';
import { useAppContext } from '../Context';
import { getImageByID } from '../Context/reducer/image';

const UnsavedIcon = bundleIcon(DatabaseWarningFilled, DatabaseWarningRegular);

const useStyles = makeStyles({
    list: {
        width: '100%',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: '0%',
        overflowY: 'auto',
    },
    tab: {
        textAlign: 'start',
    },
    icon: {
        marginRight: '5px',
        color: tokens.colorStatusWarningBorder1,
    },
});

function ImageList(): ReactElement {
    const classes = useStyles();

    const {
        state: { images, selectedImageID, changes },
        dispatch,
    } = useAppContext();

    const selectedImage = useMemo(
        () => (selectedImageID ? getImageByID(selectedImageID, images) : undefined),
        [selectedImageID, images],
    );

    const onSelectImage = (event: SelectTabEvent<HTMLElement>, data: SelectTabData) => {
        const imageID = data.value as number;

        if (selectedImage && imageID === selectedImage.id) {
            dispatch({ type: 'SET_IMAGE', payload: undefined });
        } else {
            const newSelectedImage = images.find((image) => image.id === imageID);
            if (!newSelectedImage) throw new Error();

            dispatch({ type: 'SET_IMAGE', payload: newSelectedImage });
        }
    };

    return (
        <TabList
            className={classes.list}
            size="medium"
            vertical
            selectedValue={selectedImage ? selectedImage.id : null}
            onTabSelect={onSelectImage}
        >
            {images
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((image) => {
                    return (
                        <Tab key={image.id} value={image.id} className={classes.tab}>
                            {changes[image.id] && <UnsavedIcon className={classes.icon} />}
                            {image.name}
                        </Tab>
                    );
                })}
        </TabList>
    );
}

export default ImageList;
