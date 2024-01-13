import { getNodes, getSpecialNode } from '@common/utils';
import {
    FlatTree,
    FlatTreeItem,
    TreeItemLayout,
    TreeOpenChangeData,
    makeStyles,
    tokens,
} from '@fluentui/react-components';
import {
    ArrowFlowUpRightFilled,
    ArrowFlowUpRightRectangleMultipleFilled,
    ArrowFlowUpRightRectangleMultipleRegular,
    ArrowFlowUpRightRegular,
    bundleIcon,
} from '@fluentui/react-icons';
import React, { MouseEvent, ReactElement, useCallback, useEffect, useMemo } from 'react';
import { useAppContext } from '../Context';
import { getAnnotationByID } from '../Context/reducer/annotation';
import { getImageByID } from '../Context/reducer/image';
import { getNodeByID } from '../Context/reducer/node';
import { sortAnnotations } from './ImageViewer/utils';

const NodeIcon = bundleIcon(ArrowFlowUpRightFilled, ArrowFlowUpRightRegular);
const SpecialNodeIcon = bundleIcon(
    ArrowFlowUpRightRectangleMultipleFilled,
    ArrowFlowUpRightRectangleMultipleRegular,
);

export const useStyles = makeStyles({
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
});

function AnnotationList(): ReactElement {
    const classes = useStyles();

    const {
        state: { images, selectedImageID, selectedAnnotationID, selectedNodeID },
        dispatch,
    } = useAppContext();

    const selectedImage = useMemo(
        () => (selectedImageID ? getImageByID(selectedImageID, images) : undefined),
        [selectedImageID, images],
    );
    const selectedAnnotation = useMemo(
        () =>
            selectedAnnotationID && selectedImage
                ? getAnnotationByID(selectedAnnotationID, selectedImage)
                : undefined,
        [selectedAnnotationID, selectedImage],
    );
    const selectedNode = useMemo(
        () =>
            selectedNodeID && selectedAnnotation
                ? getNodeByID(selectedNodeID, selectedAnnotation)
                : undefined,
        [selectedNodeID, selectedAnnotation],
    );

    const annotations = useMemo(() => {
        if (!selectedImage) return [];

        return sortAnnotations(
            selectedImage.annotations,
            selectedImage.meta.width,
            selectedImage.meta.height,
        );
    }, [selectedImage]);

    const nodes = useMemo(() => {
        if (!selectedAnnotation) return [];

        return getNodes(selectedAnnotation);
    }, [selectedAnnotation]);

    const onSelectAnnotation = useCallback(
        (annotationID: number) => {
            if (selectedAnnotation && annotationID === selectedAnnotation.id) {
                dispatch({ type: 'SET_ANNOTATION', payload: undefined });
            } else {
                const newSelectedAnnotation = selectedImage?.annotations.find(
                    (annotation) => annotation.id === annotationID,
                );
                if (!newSelectedAnnotation) throw new Error();

                dispatch({ type: 'SET_ANNOTATION', payload: newSelectedAnnotation });
            }
        },
        [dispatch, selectedAnnotation, selectedImage?.annotations],
    );

    const onSelectNode = (nodeID: number) => {
        if (!selectedAnnotation) throw new Error();

        if (selectedNode && nodeID === selectedNode.id) {
            dispatch({ type: 'SET_NODE', payload: undefined });
        } else {
            const newSelectedNode = getNodes(selectedAnnotation).find(
                (node) => node && node.id === nodeID,
            );
            if (!newSelectedNode) throw new Error();

            dispatch({ type: 'SET_NODE', payload: newSelectedNode });
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
            case 'annotation':
                onSelectAnnotation(id);
                break;
            case 'node':
                onSelectNode(id);
                break;
            default:
                throw new Error();
        }
    };

    useEffect(() => {
        const handleKeyDown = async (event: KeyboardEvent) => {
            if (
                document.activeElement &&
                ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)
            ) {
                return;
            }

            switch (event.key) {
                case 'Tab': {
                    if (selectedImage) {
                        event.preventDefault();
                        const currentIndex =
                            annotations.findIndex(
                                (annotation) => annotation.id === selectedAnnotationID,
                            ) || 0;
                        onSelectAnnotation(annotations[(currentIndex + 1) % annotations.length].id);
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [annotations, selectedAnnotationID, selectedImage, onSelectAnnotation]);

    if (!selectedImage) {
        return <></>; // eslint-disable-line react/jsx-no-useless-fragment
    }

    return (
        <FlatTree
            className={classes.list}
            size="small"
            openItems={selectedAnnotationID ? [`annotation-${selectedAnnotationID}`] : undefined}
            onOpenChange={onSelect}
            aria-label="annotation-list"
        >
            {annotations.map((annotation, annotationIndex) => (
                <>
                    <FlatTreeItem
                        key={annotation.id}
                        value={`annotation-${annotation.id}`}
                        itemType="branch"
                        aria-level={1}
                        aria-setsize={annotations.length}
                        aria-posinset={annotationIndex + 1}
                        className={
                            annotation.id === selectedAnnotationID ? classes.activeTab : undefined
                        }
                    >
                        <TreeItemLayout>
                            {annotation.label
                                ? annotation.label.split('\n').map((line, index) => (
                                      <>
                                          {index > 0 && <br />}
                                          {line}
                                      </>
                                  ))
                                : `unnamed-${annotation.id}`}
                        </TreeItemLayout>
                    </FlatTreeItem>
                    {selectedAnnotation && selectedAnnotation.id === annotation.id && (
                        <>
                            {nodes.map((node, NodeIndex) => (
                                <FlatTreeItem
                                    key={node.id}
                                    parentValue={`annotation-${annotation.id}`}
                                    value={`node-${node.id}`}
                                    itemType="branch"
                                    aria-level={2}
                                    aria-setsize={nodes.length}
                                    aria-posinset={NodeIndex + 1}
                                    className={
                                        node.id === selectedNodeID ? classes.activeTab : undefined
                                    }
                                >
                                    <TreeItemLayout
                                        expandIcon={
                                            getSpecialNode(selectedAnnotation)?.id === node.id ? (
                                                <SpecialNodeIcon
                                                    className={
                                                        node.id === selectedNodeID
                                                            ? classes.activeIcon
                                                            : classes.inactiveIcon
                                                    }
                                                />
                                            ) : (
                                                <NodeIcon
                                                    className={
                                                        node.id === selectedNodeID
                                                            ? classes.activeIcon
                                                            : classes.inactiveIcon
                                                    }
                                                />
                                            )
                                        }
                                    >
                                        ({node.x} | {node.y})
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

export default AnnotationList;
