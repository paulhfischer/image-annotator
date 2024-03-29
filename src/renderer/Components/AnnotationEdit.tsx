import {
    Button,
    Checkbox,
    CheckboxOnChangeData,
    Input,
    InputOnChangeData,
    Label,
    Select,
    SelectOnChangeData,
    Textarea,
    TextareaOnChangeData,
    makeStyles,
    tokens,
    useId,
} from '@fluentui/react-components';

import { AnnotationType } from '@common/types';
import { getEndNodes, getSpecialNode } from '@common/utils';
import { DeleteFilled, DeleteRegular, bundleIcon } from '@fluentui/react-icons';
import React, { ChangeEvent, useMemo } from 'react';
import { useAppContext } from '../Context';
import { getAnnotationByID } from '../Context/reducer/annotation';
import { getImageByID } from '../Context/reducer/image';
import { getNodeByID } from '../Context/reducer/node';

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
    checkboxSmall: {
        '& label': {
            fontSize: tokens.fontSizeBase200,
            lineHeight: tokens.lineHeightBase200,
            paddingTop: 0,
            paddingRight: tokens.spacingHorizontalXXS,
            paddingBottom: 0,
            paddingLeft: 0,
        },
        '& input': {
            width: `calc(${tokens.fontSizeBase200} + 2*${tokens.spacingHorizontalXXS})`,
            height: `calc(${tokens.fontSizeBase200} + 2*${tokens.spacingHorizontalXXS})`,
        },
        '& div': {
            marginTop: tokens.spacingHorizontalXXS,
            marginRight: tokens.spacingHorizontalXXS,
            marginBottom: tokens.spacingHorizontalXXS,
            marginLeft: tokens.spacingHorizontalXXS,
            width: tokens.fontSizeBase200,
            height: tokens.fontSizeBase200,
            fontSize: tokens.fontSizeBase200,
        },
    },
});

function AnnotationEdit() {
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

    const annotationTypeID = useId();
    const annotationUIDID = useId();
    const annotationLabelID = useId();
    const annotationLabelPositionID = useId();
    const annotationTipTypeID = useId();
    const nodeXID = useId();
    const nodeYID = useId();

    if (!selectedImage || !selectedAnnotation) {
        return <></>; // eslint-disable-line react/jsx-no-useless-fragment
    }

    const handleUpdateType = (
        event: ChangeEvent<HTMLSelectElement>,
        data: SelectOnChangeData,
    ): void => {
        const endNodes = getEndNodes(selectedAnnotation);
        const specialNode = getSpecialNode(selectedAnnotation);

        let updatedAnnotation: Partial<AnnotationType> = {
            id: selectedAnnotation.id,
            uid: selectedAnnotation.uid,
            label: selectedAnnotation.label,
            labelPosition: selectedAnnotation.labelPosition,
            permanent: selectedAnnotation.permanent,
            tipType: selectedAnnotation.tipType,
        };
        switch (data.value) {
            case 'line':
                updatedAnnotation = {
                    ...updatedAnnotation,
                    type: 'line',
                    endNodes,
                    connectionNode: specialNode,
                };
                break;
            case 'brace':
                if (endNodes.length !== 2) throw new Error();

                updatedAnnotation = {
                    ...updatedAnnotation,
                    type: 'brace',
                    nodeA: endNodes[0],
                    connectionNode: specialNode,
                    nodeB: endNodes[1],
                };
                break;
            default:
                throw new Error();
        }

        dispatch({ type: 'UPDATE_ANNOTATION', payload: updatedAnnotation as AnnotationType });
    };

    const handleUpdateUID = (
        event: ChangeEvent<HTMLInputElement>,
        data: InputOnChangeData,
    ): void => {
        const updatedAnnotation = {
            ...selectedAnnotation,
            uid: data.value,
        };

        dispatch({ type: 'UPDATE_ANNOTATION', payload: updatedAnnotation });
    };

    const handleUpdateLabel = (
        event: ChangeEvent<HTMLTextAreaElement>,
        data: TextareaOnChangeData,
    ): void => {
        const updatedAnnotation = {
            ...selectedAnnotation,
            label: data.value,
        };

        dispatch({ type: 'UPDATE_ANNOTATION', payload: updatedAnnotation });
    };

    const handleUpdateLabelPosition = async (
        event: ChangeEvent<HTMLSelectElement>,
        data: SelectOnChangeData,
    ): Promise<void> => {
        const updatedAnnotation = {
            ...selectedAnnotation,
            labelPosition: data.value as 'top' | 'right' | 'bottom' | 'left',
        };

        dispatch({ type: 'UPDATE_ANNOTATION', payload: updatedAnnotation });
    };

    const handleUpdateTipType = async (
        event: ChangeEvent<HTMLSelectElement>,
        data: SelectOnChangeData,
    ): Promise<void> => {
        const updatedAnnotation = {
            ...selectedAnnotation,
            tipType: data.value as 'circle' | 'arrow',
        };

        dispatch({ type: 'UPDATE_ANNOTATION', payload: updatedAnnotation });
    };

    const handleUpdatePermanent = async (
        event: ChangeEvent<HTMLInputElement>,
        data: CheckboxOnChangeData,
    ): Promise<void> => {
        const updatedAnnotation = {
            ...selectedAnnotation,
            permanent: !!data.checked,
        };

        dispatch({ type: 'UPDATE_ANNOTATION', payload: updatedAnnotation });
    };

    const handleDeleteAnnotation = async (): Promise<void> => {
        dispatch({ type: 'REMOVE_ANNOTATION', payload: selectedAnnotation });
    };

    const handleUpdateNodeX = (
        event: ChangeEvent<HTMLInputElement>,
        data: InputOnChangeData,
    ): void => {
        if (!selectedNode) throw new Error();

        const updatedNode = {
            ...selectedNode,
            x: parseInt(data.value, 10),
        };

        dispatch({ type: 'UPDATE_NODE', payload: updatedNode });
    };

    const handleUpdateNodeY = (
        event: ChangeEvent<HTMLInputElement>,
        data: InputOnChangeData,
    ): void => {
        if (!selectedNode) throw new Error();

        const updatedNode = {
            ...selectedNode,
            y: parseInt(data.value, 10),
        };

        dispatch({ type: 'UPDATE_NODE', payload: updatedNode });
    };

    const handleDeleteNode = async (): Promise<void> => {
        if (!selectedNode) throw new Error();

        dispatch({ type: 'REMOVE_NODE', payload: selectedNode });
    };

    return (
        <div className={classes.root}>
            <div className={classes.row}>
                <Label size="small" htmlFor={annotationUIDID}>
                    uid
                </Label>
                <Input
                    id={annotationUIDID}
                    size="small"
                    value={selectedAnnotation.uid}
                    onChange={handleUpdateUID}
                />
            </div>
            <div className={classes.row}>
                <Label size="small" htmlFor={annotationTypeID}>
                    type
                </Label>
                <Select
                    size="small"
                    id={annotationTypeID}
                    value={selectedAnnotation.type}
                    onChange={handleUpdateType}
                >
                    <option>line</option>
                    {getEndNodes(selectedAnnotation).length === 2 && <option>brace</option>}
                </Select>
            </div>
            <div className={classes.row}>
                <Label size="small" htmlFor={annotationLabelID}>
                    label
                </Label>
                <Textarea
                    id={annotationLabelID}
                    resize="vertical"
                    size="small"
                    value={selectedAnnotation.label}
                    onChange={handleUpdateLabel}
                />
            </div>
            <div className={classes.row}>
                <Label size="small" htmlFor={annotationLabelPositionID}>
                    label position
                </Label>
                <Select
                    size="small"
                    id={annotationLabelPositionID}
                    value={selectedAnnotation.labelPosition}
                    onChange={handleUpdateLabelPosition}
                >
                    <option>top</option>
                    <option>right</option>
                    <option>bottom</option>
                    <option>left</option>
                </Select>
            </div>
            <div className={classes.row} style={{ display: 'initial' }}>
                <Checkbox
                    className={classes.checkboxSmall}
                    label="permanent"
                    labelPosition="before"
                    checked={selectedAnnotation.permanent}
                    onChange={handleUpdatePermanent}
                />
            </div>
            <div className={classes.row}>
                <Label size="small" htmlFor={annotationTipTypeID}>
                    tip
                </Label>
                <Select
                    size="small"
                    id={annotationTipTypeID}
                    value={selectedAnnotation.tipType}
                    onChange={handleUpdateTipType}
                >
                    <option>circle</option>
                    <option>arrow</option>
                </Select>
            </div>
            <div className={classes.row}>
                <Button size="small" onClick={handleDeleteAnnotation} icon={<DeleteIcon />}>
                    delete annotation
                </Button>
            </div>
            {selectedNode && (
                <>
                    <div className={classes.row}>
                        <Label size="small" htmlFor={nodeXID}>
                            x
                        </Label>
                        <Input
                            id={nodeXID}
                            size="small"
                            type="number"
                            value={selectedNode.x.toString()}
                            onChange={handleUpdateNodeX}
                        />
                    </div>
                    <div className={classes.row}>
                        <Label size="small" htmlFor={nodeYID}>
                            y
                        </Label>
                        <Input
                            id={nodeYID}
                            size="small"
                            type="number"
                            value={selectedNode.y.toString()}
                            onChange={handleUpdateNodeY}
                        />
                    </div>
                    <div className={classes.row}>
                        <Button size="small" onClick={handleDeleteNode} icon={<DeleteIcon />}>
                            delete node
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

export default AnnotationEdit;
