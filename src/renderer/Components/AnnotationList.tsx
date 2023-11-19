import { getNodes, getSpecialNode } from '@common/utils';
import {
    SelectTabData,
    SelectTabEvent,
    Tab,
    TabList,
    makeStyles,
} from '@fluentui/react-components';
import {
    ArrowFlowUpRightFilled,
    ArrowFlowUpRightRectangleMultipleFilled,
    ArrowFlowUpRightRectangleMultipleRegular,
    ArrowFlowUpRightRegular,
    bundleIcon,
} from '@fluentui/react-icons';
import React, { ReactElement, useMemo } from 'react';
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
    tab: {
        textAlign: 'start',
    },
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

    const onSelectAnnotation = (event: SelectTabEvent<HTMLElement>, data: SelectTabData) => {
        const annotationID = data.value as number;

        if (selectedAnnotation && annotationID === selectedAnnotation.id) {
            dispatch({ type: 'SET_ANNOTATION', payload: undefined });
        } else {
            const newSelectedAnnotation = selectedImage?.annotations.find(
                (annotation) => annotation.id === annotationID,
            );
            if (!newSelectedAnnotation) throw new Error();

            dispatch({ type: 'SET_ANNOTATION', payload: newSelectedAnnotation });
        }
    };

    const onSelectNode = (event: SelectTabEvent<HTMLElement>, data: SelectTabData) => {
        if (!selectedAnnotation) throw new Error();

        const nodeID = data.value as number;

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

    if (!selectedImage) {
        return <></>; // eslint-disable-line react/jsx-no-useless-fragment
    }

    return (
        <TabList
            className={classes.list}
            size="medium"
            vertical
            selectedValue={selectedAnnotation ? selectedAnnotation.id : null}
            onTabSelect={onSelectAnnotation}
        >
            {annotations.map((annotation) => (
                <>
                    <Tab key={annotation.id} value={annotation.id} className={classes.tab}>
                        {annotation.label
                            ? annotation.label.split('\n').map((line, index) => (
                                  <>
                                      {index > 0 && <br />}
                                      {line}
                                  </>
                              ))
                            : `unnamed-${annotation.id}`}
                    </Tab>
                    {selectedAnnotation && selectedAnnotation.id === annotation.id && (
                        <TabList
                            size="small"
                            vertical
                            selectedValue={selectedNode ? selectedNode.id : null}
                            onTabSelect={onSelectNode}
                        >
                            {nodes.map((node) => (
                                <Tab
                                    key={node.id}
                                    value={node.id}
                                    icon={
                                        getSpecialNode(selectedAnnotation)?.id === node.id ? (
                                            <SpecialNodeIcon />
                                        ) : (
                                            <NodeIcon />
                                        )
                                    }
                                    className={classes.tab}
                                >
                                    ({node.x} | {node.y})
                                </Tab>
                            ))}
                        </TabList>
                    )}
                </>
            ))}
        </TabList>
    );
}

export default AnnotationList;
