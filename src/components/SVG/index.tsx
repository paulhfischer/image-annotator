import React, { MouseEvent, ReactElement, useMemo } from 'react';
import { AnnotationType } from 'src/io/annotations';
import { ImageType } from 'src/io/image';
import Annotation from '../Annotation';
import { getBorder, getFontSize, getImageURL, getLineWidth, getViewBox } from './utils';

type SVGProps =
    | {
          image: ImageType;
          annotations: AnnotationType[];
          markers?: boolean;
          handleClick: (event: MouseEvent<SVGSVGElement>) => void;
      }
    | {
          image: ImageType;
          annotations: AnnotationType[];
          markers?: boolean;
          handleClick?: undefined;
      };

const SVG = React.forwardRef<SVGSVGElement, SVGProps>(
    ({ image, annotations, markers, handleClick }, ref): ReactElement => {
        const maxLabelWidth = useMemo(() => {
            return {
                lr: getBorder(image).x,
                tb: image.width + 2 * getBorder(image).x,
            };
        }, [image]);

        return (
            <svg
                ref={ref}
                onClick={handleClick}
                viewBox={getViewBox(image)}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlSpace="preserve"
            >
                <image
                    x={0}
                    y={0}
                    width={image.width}
                    height={image.height}
                    href={getImageURL(image)}
                />
                {annotations.map((annotation, index) => (
                    <Annotation
                        key={annotation.id}
                        id={index + 1}
                        annotation={annotation}
                        lineWidth={getLineWidth(image)}
                        fontSize={getFontSize(image)}
                        color="black"
                        imageWidth={image.width}
                        imageHeight={image.height}
                        maxLabelWidth={
                            annotation.orientation === 'top' || annotation.orientation === 'bottom'
                                ? maxLabelWidth.tb
                                : maxLabelWidth.lr
                        }
                        markers={!!markers}
                    />
                ))}
            </svg>
        );
    },
);

SVG.defaultProps = {
    markers: false,
};

export default SVG;
