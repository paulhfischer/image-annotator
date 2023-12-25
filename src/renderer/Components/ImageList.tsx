import {
    FlatTree,
    FlatTreeItem,
    TreeItemLayout,
    TreeOpenChangeData,
    makeStyles,
    tokens,
} from '@fluentui/react-components';
import {
    DatabaseFilled,
    DatabaseRegular,
    DatabaseWarningFilled,
    DatabaseWarningRegular,
    bundleIcon,
} from '@fluentui/react-icons';
import React, { MouseEvent, ReactElement, useMemo } from 'react';
import { useAppContext } from '../Context';
import { getImageByID } from '../Context/reducer/image';

const SavedIcon = bundleIcon(DatabaseFilled, DatabaseRegular);
const UnsavedIcon = bundleIcon(DatabaseWarningFilled, DatabaseWarningRegular);

const useStyles = makeStyles({
    list: {
        width: '100%',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: '0%',
        overflowY: 'auto',
    },
    activeTab: {
        color: tokens.colorNeutralForeground2Hover,
        backgroundColor: tokens.colorSubtleBackgroundHover,
    },
    activeIcon: {
        color: tokens.colorNeutralForeground2Hover,
    },
    inactiveIcon: {},
    unsavedIcon: {
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

    const onSelectImage = (imageID: number) => {
        if (selectedImage && imageID === selectedImage.id) {
            dispatch({ type: 'SET_IMAGE', payload: undefined });
        } else {
            const newSelectedImage = images.find((image) => image.id === imageID);
            if (!newSelectedImage) throw new Error();

            dispatch({ type: 'SET_IMAGE', payload: newSelectedImage });
        }
    };

    const onSelect = (
        event: MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
        data: TreeOpenChangeData,
    ) => {
        const value = data.value as string;

        const type = value.split('-')[0];
        const id = parseInt(value.split('-')[1], 10);

        switch (type) {
            case 'image':
                onSelectImage(id);
                break;
            default:
                throw new Error();
        }
    };

    return (
        <FlatTree
            className={classes.list}
            size="small"
            onOpenChange={onSelect}
            aria-label="image-list"
        >
            {images
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((image, imageIndex) => {
                    return (
                        <FlatTreeItem
                            key={image.id}
                            value={`image-${image.id}`}
                            itemType="branch"
                            aria-level={1}
                            aria-setsize={images.length}
                            aria-posinset={imageIndex + 1}
                            className={image.id === selectedImageID ? classes.activeTab : undefined}
                        >
                            <TreeItemLayout
                                expandIcon={
                                    changes[image.id] ? (
                                        <UnsavedIcon className={classes.unsavedIcon} />
                                    ) : (
                                        <SavedIcon
                                            className={
                                                image.id === selectedImageID
                                                    ? classes.activeIcon
                                                    : classes.inactiveIcon
                                            }
                                        />
                                    )
                                }
                            >
                                {image.name}
                            </TreeItemLayout>
                        </FlatTreeItem>
                    );
                })}
        </FlatTree>
    );
}

export default ImageList;
