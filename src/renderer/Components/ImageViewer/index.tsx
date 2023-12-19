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
        // display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'center',
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

    const [pos, setPos] = useState<{ x: number; y: number; scale: number }>({
        x: 0,
        y: 0,
        scale: 1,
    });
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

    const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
        const xs = (event.clientX - pos.x) / pos.scale;
        const ys = (event.clientY - pos.y) / pos.scale;
        const delta = -event.deltaY;
        const newScale = delta > 0 ? pos.scale * 1.1 : pos.scale / 1.1;
        const pointX = event.clientX - xs * newScale;
        const pointY = event.clientY - ys * newScale;
        setPos({
            x: pointX,
            y: pointY,
            scale: newScale,
        });

        // const newScale = Math.min(Math.max(pos.scale + event.deltaY * 0.01, 0.1), 3);

        // const ratio = 1 - newScale / pos.scale;

        // setPos({
        //     x: pos.x + (event.clientX - pos.x) * ratio,
        //     y: pos.y + (event.clientY - pos.y) * ratio,
        //     scale: newScale,
        // });

        // const boundingRect = event.currentTarget.getBoundingClientRect();
        // const offsetX = event.clientX - boundingRect.left;
        // const offsetY = event.clientY - boundingRect.top;

        // // Calculate the new mouse position relative to the SVG coordinates after zooming
        // // const x = (offsetX - mousePosition.x) / zoom;
        // // const y = (offsetY - mousePosition.y) / zoom;

        // setPos({
        //     x: offsetX,
        //     y: offsetY,
        //     scale: newZoom,
        // });
    };

    useEffect(() => {
        const handleKeyDown = async (event: KeyboardEvent) => {
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
        <div className={classes.root} onWheelCapture={handleScroll}>
            <SVG
                nodes={nodes}
                specialNode={specialNode}
                handleClick={handleClick}
                ref={SVGRef}
                pos={pos}
            />
        </div>
    );
}

export default ImageViewer;
