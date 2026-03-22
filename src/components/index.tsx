import {
    Spinner,
    Toolbar,
    ToolbarButton,
    Tooltip,
    makeStyles,
    tokens,
} from '@fluentui/react-components';
import {
    ArrowCurveDownRightFilled,
    ArrowCurveDownRightRegular,
    ArrowCurveUpLeftFilled,
    ArrowCurveUpLeftRegular,
    bundleIcon,
} from '@fluentui/react-icons';
import React, { ReactElement, useCallback } from 'react';
import Editor from 'src/components/Editor';
import SVG from 'src/components/SVG';
import { AnnotationType } from 'src/io/annotations';
import { ImageType } from 'src/io/image';

const ReadAnnotationsIcon = bundleIcon(ArrowCurveDownRightFilled, ArrowCurveDownRightRegular);
const WriteAnnotationsIcon = bundleIcon(ArrowCurveUpLeftFilled, ArrowCurveUpLeftRegular);

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
    },
    image: {
        width: '100%',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: '0%',
        backgroundColor: tokens.colorBrandBackgroundInvertedHover,
    },
    editor: {
        width: '100%',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: '250px',
        display: 'flex',
        flexDirection: 'row',
    },
});

interface ImageAnnotatorProps {
    image: ImageType;
    readAnnotations: () => Promise<AnnotationType[]>;
    writeAnnotations: (annotations: AnnotationType[]) => void;
}

function ImageAnnotator({
    image,
    readAnnotations,
    writeAnnotations,
}: ImageAnnotatorProps): ReactElement {
    const classes = useStyles();

    const [annotations, setAnnotations] = React.useState<AnnotationType[]>();

    const handleReadAnnotations = useCallback(async () => {
        setAnnotations(await readAnnotations());
    }, [readAnnotations]);

    const handleWriteAnnotations = useCallback(async () => {
        if (!annotations) throw new Error();

        writeAnnotations(annotations);
    }, [writeAnnotations, annotations]);

    React.useEffect(() => {
        handleReadAnnotations();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!annotations) {
        return <Spinner />;
    }

    return (
        <div className={classes.root}>
            <Toolbar>
                <Tooltip content="read annotations" relationship="label" withArrow>
                    <ToolbarButton icon={<ReadAnnotationsIcon />} onClick={handleReadAnnotations} />
                </Tooltip>
                <Tooltip content="write annotations" relationship="label" withArrow>
                    <ToolbarButton
                        icon={<WriteAnnotationsIcon />}
                        onClick={handleWriteAnnotations}
                    />
                </Tooltip>
            </Toolbar>
            <div className={classes.image}>
                <SVG image={image} annotations={annotations} />
            </div>
            <div className={classes.editor}>
                <Editor annotations={annotations} setAnnotations={setAnnotations} />
            </div>
        </div>
    );
}

export default ImageAnnotator;
