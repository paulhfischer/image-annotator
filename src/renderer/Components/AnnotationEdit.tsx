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
    useId,
} from '@fluentui/react-components';

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

    const annotationUIDID = useId();
    const annotationLabelID = useId();
    const annotationLabelPositionID = useId();
    const annotationTipTypeID = useId();
    const nodeXID = useId();
    const nodeYID = useId();

    if (!selectedImage || !selectedAnnotation) {
        return <></>; // eslint-disable-line react/jsx-no-useless-fragment
    }

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
            <div className={classes.row}>
                <Checkbox
                    label="permanent"
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
