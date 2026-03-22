import {
    Field,
    Input,
    InputOnChangeData,
    Select,
    SelectOnChangeData,
    makeStyles,
} from '@fluentui/react-components';
import React, { ChangeEvent, ReactNode } from 'react';
import { AnnotationType } from 'src/io/annotations';
import { availableTypes, canHaveAngle, canHaveEndNode } from './utils';

const useStyles = makeStyles({
    form: {
        height: '100%',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: '0%',
        marginTop: '10px',
        marginBottom: '10px',
        display: 'flex',
        rowGap: '10px',
        flexDirection: 'column',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        columnGap: '10px',
        width: '100%',

        '> *': {
            flexGrow: 1,
        },
    },
});

interface FormProps {
    annotationIndex: number;
    annotations: AnnotationType[];
    setAnnotations: (annotations: AnnotationType[]) => void;
}

function Form({ annotationIndex, annotations, setAnnotations }: FormProps): ReactNode {
    const classes = useStyles();

    const selectedAnnotation = annotations[annotationIndex];

    const handleUpdateType = (event: ChangeEvent<HTMLSelectElement>, data: SelectOnChangeData) => {
        if (annotationIndex === undefined) throw new Error();

        const value = data.value as AnnotationType['type'];

        const newAnnotations = [...annotations];
        newAnnotations[annotationIndex].type = value;

        setAnnotations(newAnnotations);
    };

    const handleUpdateOrientation = (
        event: ChangeEvent<HTMLSelectElement>,
        data: SelectOnChangeData,
    ) => {
        if (annotationIndex === undefined) throw new Error();

        const value = data.value as AnnotationType['orientation'];

        const newAnnotations = [...annotations];
        newAnnotations[annotationIndex].orientation = value;

        setAnnotations(newAnnotations);
    };

    const handleUpdateAngle = (
        event: ChangeEvent<HTMLInputElement>,
        data: InputOnChangeData,
    ): void => {
        if (annotationIndex === undefined) throw new Error();

        const value = parseInt(data.value, 10) || 0;

        const newAnnotations = [...annotations];
        newAnnotations[annotationIndex].angle = value === 0 ? undefined : value;

        setAnnotations(newAnnotations);
    };

    const handleUpdateEndNodeX = (
        event: ChangeEvent<HTMLInputElement>,
        data: InputOnChangeData,
    ): void => {
        if (annotationIndex === undefined) throw new Error();

        const value = parseInt(data.value, 10) || 0;

        const newAnnotations = [...annotations];
        if (newAnnotations[annotationIndex].endNode) {
            newAnnotations[annotationIndex].endNode!.x = value;
        } else {
            newAnnotations[annotationIndex].endNode = {
                x: value,
                y: 0,
            };
        }

        setAnnotations(newAnnotations);
    };

    const handleUpdateEndNodeY = (
        event: ChangeEvent<HTMLInputElement>,
        data: InputOnChangeData,
    ): void => {
        if (annotationIndex === undefined) throw new Error();

        const value = parseInt(data.value, 10) || 0;

        const newAnnotations = [...annotations];
        if (newAnnotations[annotationIndex].endNode) {
            newAnnotations[annotationIndex].endNode!.y = value;
        } else {
            newAnnotations[annotationIndex].endNode = {
                x: 0,
                y: value,
            };
        }

        setAnnotations(newAnnotations);
    };

    const handleUpdateNodeX = (
        index: number,
        event: ChangeEvent<HTMLInputElement>,
        data: InputOnChangeData,
    ): void => {
        if (annotationIndex === undefined) throw new Error();

        const value = parseInt(data.value, 10) || 0;

        const newAnnotations = [...annotations];
        newAnnotations[annotationIndex].nodes[index].x = value;

        setAnnotations(newAnnotations);
    };

    const handleUpdateNodeY = (
        index: number,
        event: ChangeEvent<HTMLInputElement>,
        data: InputOnChangeData,
    ): void => {
        if (annotationIndex === undefined) throw new Error();

        const value = parseInt(data.value, 10) || 0;

        const newAnnotations = [...annotations];
        newAnnotations[annotationIndex].nodes[index].y = value;

        setAnnotations(newAnnotations);
    };

    return (
        <div className={classes.form}>
            <label>Type</label>
            <input type="text" />

            <label>Type</label>
            <select>
                {availableTypes(selectedAnnotation).map((type) => (
                    <option key={type}>{type}</option>
                ))}
            </select>

            <label>Orientation</label>
            <select>
                <option>top</option>
                <option>right</option>
                <option>bottom</option>
                <option>left</option>
            </select>

            <label>Angle</label>
            <input type="number" step={5} />

            <label>End Node</label>
            <div className={classes.row}>
                <input type="number" />
                <input type="number" />
            </div>

            <Field label="Type" orientation="horizontal">
                <Select value={selectedAnnotation.type} onChange={handleUpdateType}>
                    {availableTypes(selectedAnnotation).map((type) => (
                        <option key={type}>{type}</option>
                    ))}
                </Select>
            </Field>
            <Field label="Orientation" orientation="horizontal">
                <Select value={selectedAnnotation.orientation} onChange={handleUpdateOrientation}>
                    <option>top</option>
                    <option>right</option>
                    <option>bottom</option>
                    <option>left</option>
                </Select>
            </Field>
            <Field label="Angle" orientation="horizontal">
                <Input
                    type="number"
                    step={5}
                    disabled={!canHaveAngle(selectedAnnotation)}
                    value={(selectedAnnotation.angle || 0).toString()}
                    onChange={handleUpdateAngle}
                />
            </Field>
            <Field label="End Node" orientation="horizontal">
                <div className={classes.row}>
                    <Field label="x">
                        <Input
                            type="number"
                            disabled={!canHaveEndNode(selectedAnnotation)}
                            value={(selectedAnnotation.endNode?.x || 0).toString()}
                            onChange={handleUpdateEndNodeX}
                        />
                    </Field>
                    <Field label="y">
                        <Input
                            type="number"
                            disabled={!canHaveEndNode(selectedAnnotation)}
                            value={(selectedAnnotation.endNode?.y || 0).toString()}
                            onChange={handleUpdateEndNodeY}
                        />
                    </Field>
                </div>
            </Field>
            <Field label="Nodes" orientation="horizontal">
                {selectedAnnotation.nodes.map((node, index) => (
                    <div className={classes.row}>
                        <Field label="x">
                            <Input
                                type="number"
                                value={node.x.toString()}
                                onChange={(event, data) => handleUpdateNodeX(index, event, data)}
                            />
                        </Field>
                        <Field label="y">
                            <Input
                                type="number"
                                value={node.y.toString()}
                                onChange={(event, data) => handleUpdateNodeY(index, event, data)}
                            />
                        </Field>
                    </div>
                ))}
            </Field>
        </div>
    );
}

export default Form;
