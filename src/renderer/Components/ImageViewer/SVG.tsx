import { NewNodeType } from '@common/types';
import { makeStyles, tokens } from '@fluentui/react-components';
import React, { MouseEvent, ReactElement, useMemo } from 'react';
import { useAppContext } from '../../Context';
import { getAnnotationByID } from '../../Context/reducer/annotation';
import { getImageByID } from '../../Context/reducer/image';
import Annotation from '../Annotation';
import Node from './Node';
import {
    getAnnotationColor,
    getBorder,
    getFontSize,
    getImageURL,
    getLineWidth,
    getViewBox,
    sortAnnotations,
} from './utils';

export const useStyles = makeStyles({
    root: {
        backgroundColor: tokens.colorBrandBackgroundInvertedHover,
        maxWidth: '100%',
        maxHeight: '100%',
        width: 'auto',
        height: 'auto',
    },
});

type SVGProps =
    | {
          render?: false;
          nodes: NewNodeType[];
          specialNode: NewNodeType | undefined;
          handleClick: (event: MouseEvent<SVGSVGElement>) => void;
          pos: { x: number; y: number; scale: number };
      }
    | {
          render: true;
          nodes?: undefined;
          specialNode?: undefined;
          handleClick?: undefined;
          pos?: undefined;
      };

const SVG = React.forwardRef<SVGSVGElement, SVGProps>(
    ({ render, nodes, specialNode, handleClick, pos }, ref): ReactElement => {
        const classes = useStyles();

        const {
            state: { images, selectedImageID, selectedAnnotationID, showOldAnnotations },
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

        const annotations = useMemo(() => {
            if (!selectedImage) return [];

            return sortAnnotations(
                selectedImage.annotations,
                selectedImage.meta.width,
                selectedImage.meta.height,
            );
        }, [selectedImage]);

        const maxLabelWidth = useMemo(() => {
            if (!selectedImage) return { lr: 0, tb: 0 };

            return {
                lr: getBorder(selectedImage).x,
                tb: selectedImage.meta.width + 2 * getBorder(selectedImage).x,
            };
        }, [selectedImage]);

        if (!selectedImage) {
            return <>no image selected</>;
        }

        return (
            <svg
                ref={ref}
                style={
                    render
                        ? undefined
                        : {
                              transformOrigin: '0px 0px',
                              transform: `scale(${pos.scale}) translate(${pos.x}px, ${pos.y}px)`,
                          }
                }
                onClick={handleClick}
                className={render ? undefined : classes.root}
                viewBox={getViewBox(selectedImage)}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlSpace="preserve"
            >
                <image
                    x={0}
                    y={0}
                    width={selectedImage.meta.width}
                    height={selectedImage.meta.height}
                    href={getImageURL(selectedImage, showOldAnnotations, render)}
                />
                {annotations.map((annotation, index) => (
                    <Annotation
                        key={annotation.id}
                        id={index + 1}
                        annotation={annotation}
                        lineWidth={getLineWidth(selectedImage)}
                        fontSize={getFontSize(selectedImage)}
                        color={getAnnotationColor(annotation, selectedAnnotation, render)}
                        imageWidth={selectedImage.meta.width}
                        imageHeight={selectedImage.meta.height}
                        maxLabelWidth={
                            annotation.labelPosition === 'top' ||
                            annotation.labelPosition === 'bottom'
                                ? maxLabelWidth.tb
                                : maxLabelWidth.lr
                        }
                        render={!!render}
                    />
                ))}
                {nodes &&
                    nodes.map((node) => (
                        <Node
                            key={`${node.x}-${node.y}`}
                            x={node.x}
                            y={node.y}
                            lineWidth={getLineWidth(selectedImage)}
                            color={tokens.colorPaletteGreenBorderActive}
                            filled={false}
                        />
                    ))}
                {specialNode && (
                    <Node
                        key={`${specialNode.x}-${specialNode.y}`}
                        x={specialNode.x}
                        y={specialNode.y}
                        lineWidth={getLineWidth(selectedImage)}
                        color={tokens.colorPaletteGreenBorderActive}
                        filled
                    />
                )}
            </svg>
        );
    },
);

export default SVG;
