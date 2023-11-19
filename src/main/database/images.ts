import { ImageType, NewImageType } from '@common/types';
import { deleteAnnotationInDB, fetchAnnotationsFromDB, updateAnnotationInDB } from './annotations';
import { queryDB, runDB } from './utils';

type ImageDBType = {
    id: number;
    uid: string;
    name: string;
    clean_content: string;
    annotated_content: string | null;
    annotation_size: string;
    width: number;
    height: number;
};

const getUniqueImageID = async (): Promise<string> => {
    const id = Math.random().toString(36).slice(-8);

    const result = await queryDB<{ count: number }>(
        `SELECT COUNT(*) as count FROM images WHERE uid = ?`,
        [id],
    );

    if (result[0].count === 0) {
        return id;
    }
    return getUniqueImageID();
};

const entryToType = async (entry: ImageDBType): Promise<ImageType> => {
    if (
        entry.annotation_size !== 'small' &&
        entry.annotation_size !== 'medium' &&
        entry.annotation_size !== 'large'
    ) {
        throw new Error();
    }

    return {
        id: entry.id,
        uid: entry.uid,
        meta: {
            width: entry.width,
            height: entry.height,
            cleanContent: entry.clean_content,
            ...(entry.annotated_content !== null && {
                annotatedContent: entry.annotated_content,
            }),
        },
        name: entry.name,
        annotationSize: entry.annotation_size,
        annotations: await fetchAnnotationsFromDB(entry.id),
    };
};

export const fetchImageFromDB = async (imageID: number): Promise<ImageType> => {
    const imagesResult = await queryDB<ImageDBType>(`SELECT * FROM images WHERE id = ?`, [imageID]);

    if (imagesResult.length !== 1) throw new Error();

    return entryToType(imagesResult[0]);
};

export const fetchImagesFromDB = async (): Promise<ImageType[]> => {
    const imagesResult = await queryDB<ImageDBType>(`SELECT * FROM images`);

    return Promise.all(imagesResult.map((entry) => entryToType(entry)));
};

export const createImageInDB = async (image: NewImageType): Promise<ImageType> => {
    const result = await runDB(
        `INSERT INTO images (uid, name, clean_content, annotated_content, annotation_size, width, height) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            await getUniqueImageID(),
            image.name,
            image.cleanContent,
            null,
            'medium',
            image.width,
            image.height,
        ],
    );

    return fetchImageFromDB(result.lastID);
};

export const updateImageInDB = async (image: ImageType): Promise<ImageType> => {
    const oldAnnotations = await fetchAnnotationsFromDB(image.id);
    const newAnnotations = image.annotations;

    const removedAnnotations = oldAnnotations.filter(
        (existingAnnotation) =>
            !newAnnotations.some((newAnnotation) => existingAnnotation.id === newAnnotation.id),
    );

    await Promise.all(newAnnotations.map((annotation) => updateAnnotationInDB(annotation)));
    await Promise.all(removedAnnotations.map((annotation) => deleteAnnotationInDB(annotation)));

    await runDB(
        `UPDATE images SET uid = ?, name = ?, clean_content = ?, annotated_content = ?, annotation_size = ?, width = ?, height = ? WHERE id = ?`,
        [
            image.uid,
            image.name,
            image.meta.cleanContent,
            image.meta.annotatedContent,
            image.annotationSize,
            image.meta.width,
            image.meta.height,
            image.id,
        ],
    );

    return fetchImageFromDB(image.id);
};

export const deleteImageInDB = async (image: ImageType): Promise<void> => {
    await runDB(`DELETE FROM images WHERE id = ?`, [image.id]);

    await Promise.all(image.annotations.map((annotation) => deleteAnnotationInDB(annotation)));
};
