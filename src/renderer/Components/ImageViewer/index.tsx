import { NewNodeType } from '@common/types';
import { makeStyles, tokens } from '@fluentui/react-components';
import React, {
    MouseEvent,
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useAppContext } from '../../Context';
import { getImageByID } from '../../Context/reducer/image';
import { Orientation } from '../Annotation/Connector/common/utils';
import SVG from './SVG';

export const useStyles = makeStyles({
    root: {
        backgroundColor: tokens.colorNeutralBackgroundStatic,
        width: '100%',
        height: '100%',
        overflowX: 'auto',
        overflowY: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

function ImageViewer(): ReactElement {
    const classes = useStyles();

    const {
        state: { images, selectedImageID },
        dispatch,
    } = useAppContext();

    const selectedImage = useMemo(
        () => (selectedImageID ? getImageByID(selectedImageID, images) : undefined),
        [selectedImageID, images],
    );

    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [nodes, setNodes] = useState<NewNodeType[]>([]);
    const [specialNode, setSpecialNode] = useState<NewNodeType>();

    const SVGRef = useRef<SVGSVGElement>(null);

    const handleAddAnnotation = useCallback(
        async (position: Orientation): Promise<void> => {
            if (!selectedImage) return;
            if (!nodes.length) return;

            const newAnnotation = await window.ContextBridge.createAnnotationInDB(
                {
                    type: 'line',
                    labelPosition: position,
                    endNodes: nodes,
                    ...(specialNode && { connectionNode: specialNode }),
                },
                selectedImage.id,
            );

            dispatch({ type: 'ADD_ANNOTATION', payload: newAnnotation });

            setNodes([]);
            setSpecialNode(undefined);
        },
        [dispatch, nodes, selectedImage, specialNode],
    );

    useEffect(() => {
        const handleKeyDown = async (event: KeyboardEvent) => {
            if (
                document.activeElement &&
                ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)
            ) {
                return;
            }

            switch (event.key) {
                case 'ArrowUp':
                    await handleAddAnnotation('top');
                    break;
                case 'ArrowDown':
                    await handleAddAnnotation('bottom');
                    break;
                case 'ArrowLeft':
                    await handleAddAnnotation('left');
                    break;
                case 'ArrowRight':
                    await handleAddAnnotation('right');
                    break;
                case '+':
                    setZoomLevel((currentLevel) => currentLevel + 0.1);
                    break;
                case '-':
                    setZoomLevel((currentLevel) => Math.max(0.1, currentLevel - 0.1));
                    break;
                case '0':
                    setZoomLevel(1);
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedImage, handleAddAnnotation]);

    const handleClick = (event: MouseEvent<SVGSVGElement>) => {
        const svg = SVGRef.current;
        if (!svg) throw new Error();

        const svgBox = svg.viewBox.baseVal;
        const svgRect = svg.getBoundingClientRect();

        const scaleX = svgRect.width / svgBox.width;
        const scaleY = svgRect.height / svgBox.height;

        const x = (event.clientX - svgRect.left) / scaleX + svgBox.x;
        const y = (event.clientY - svgRect.top) / scaleY + svgBox.y;

        const node = { x: Math.round(x), y: Math.round(y) };

        if (event.shiftKey) {
            if (specialNode) {
                setNodes([...nodes, specialNode]);
            }

            setSpecialNode(node);
        } else {
            setNodes([...nodes, node]);
        }
    };

    return (
        <div className={classes.root}>
            <SVG
                nodes={nodes}
                specialNode={specialNode}
                handleClick={handleClick}
                ref={SVGRef}
                zoom={zoomLevel}
            />
        </div>
    );
}

export default ImageViewer;
