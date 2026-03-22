import React, { ReactNode } from 'react';
import { AnnotationType } from 'src/io/annotations';
import Form from './Form';
import List from './List';

interface EditorProps {
    annotations: AnnotationType[];
    setAnnotations: (annotations: AnnotationType[]) => void;
}

function Editor({ annotations, setAnnotations }: EditorProps): ReactNode {
    const [selectedAnnotationIndex, setSelectedAnnotationIndex] = React.useState<number>();

    return (
        <>
            <List
                annotations={annotations}
                annotationIndex={selectedAnnotationIndex}
                setAnnotationIndex={setSelectedAnnotationIndex}
            />
            {selectedAnnotationIndex !== undefined && (
                <Form
                    annotationIndex={selectedAnnotationIndex}
                    annotations={annotations}
                    setAnnotations={setAnnotations}
                />
            )}
        </>
    );
}

export default Editor;
