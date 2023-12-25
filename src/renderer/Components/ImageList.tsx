import { ImageType } from '@common/types';
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
import React, { MouseEvent, ReactElement, useMemo, useState } from 'react';
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

    const [selectedGroupName, setSelectedGroupName] = useState<string>();

    const selectedImage = useMemo(
        () => (selectedImageID ? getImageByID(selectedImageID, images) : undefined),
        [selectedImageID, images],
    );

    const groupedImages = useMemo(
        () =>
            Object.entries(
                images.reduce<Record<string, ImageType[]>>((acc, image) => {
                    const groupName = image.group || 'ungrouped';
                    acc[groupName] = acc[groupName] || [];
                    acc[groupName].push(image);
                    return acc;
                }, {}),
            ).sort(([a], [b]) => {
                if (a === 'ungrouped') return 1;
                if (b === 'ungrouped') return -1;

                return a.localeCompare(b);
            }),
        [images],
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
        const id = value.split('-')[1];

        switch (type) {
            case 'group':
                setSelectedGroupName(selectedGroupName === id ? undefined : id);
                break;
            case 'image':
                onSelectImage(parseInt(id, 10));
                break;
            default:
                throw new Error();
        }
    };

    return (
        <FlatTree
            className={classes.list}
            size="small"
            openItems={selectedGroupName ? [`group-${selectedGroupName}`] : undefined}
            onOpenChange={onSelect}
            aria-label="image-list"
        >
            {groupedImages.map(([groupName, groupImages], groupIndex) => (
                <>
                    <FlatTreeItem
                        key={groupName}
                        value={`group-${groupName}`}
                        itemType="branch"
                        aria-level={1}
                        aria-setsize={groupedImages.length}
                        aria-posinset={groupIndex + 1}
                        className={groupName === selectedGroupName ? classes.activeTab : undefined}
                    >
                        <TreeItemLayout>{groupName}</TreeItemLayout>
                    </FlatTreeItem>
                    {selectedGroupName && selectedGroupName === groupName && (
                        <>
                            {groupImages.map((image, imageIndex) => (
                                <FlatTreeItem
                                    key={image.id}
                                    parentValue={`group-${groupName}`}
                                    value={`image-${image.id}`}
                                    itemType="branch"
                                    aria-level={2}
                                    aria-setsize={images.length}
                                    aria-posinset={imageIndex + 1}
                                    className={
                                        image.id === selectedImageID ? classes.activeTab : undefined
                                    }
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
                            ))}
                        </>
                    )}
                </>
            ))}
        </FlatTree>
    );
}

export default ImageList;
