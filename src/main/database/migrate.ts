/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { AnnotationType, ImageType } from '@common/types';
import { join } from 'path';
import { createAnnotationInDB, updateAnnotationInDB } from './annotations';
import { createImageInDB, fetchImagesFromDB, updateImageInDB } from './images';

const migrate = async () => {
    const images = await fetchImagesFromDB(join(__dirname, '..', 'database.db'));

    const newImages: ImageType[] = [];
    for (const image of images) {
        let newImage = await createImageInDB({
            name: image.name,
            cleanContent: image.meta.cleanContent,
            width: image.meta.width,
            height: image.meta.height,
        });
        // console.log(image);

        const newAnnotations: AnnotationType[] = [];
        for (const annotation of image.annotations) {
            if (annotation.type !== 'line') throw new Error();

            let newAnnotation = await createAnnotationInDB(
                {
                    type: annotation.type,
                    labelPosition: annotation.labelPosition,
                    endNodes: annotation.endNodes,
                    connectionNode: annotation.connectionNode,
                },
                newImage.id,
            );

            newAnnotation = await updateAnnotationInDB({
                ...newAnnotation,
                label: annotation.label,
                permanent: annotation.permanent,
            });

            newAnnotations.push(newAnnotation);
        }

        newImage = await updateImageInDB({
            ...newImage,
            meta: {
                ...newImage.meta,
                annotatedContent: image.meta.annotatedContent,
            },
            annotationSize: image.annotationSize,
            annotations: newAnnotations,
        });

        newImages.push(newImage);
    }

    console.log('MIGRATED!');
};

export default migrate;
