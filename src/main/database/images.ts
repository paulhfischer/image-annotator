import { ImageType, NewImageType } from '@common/types';
import {
    deleteAnnotationInDB,
    fetchAnnotationsFromDB as getAnnotationsFromDB,
    updateAnnotationInDB,
} from './annotations';
import { queryDB, runDB } from './utils';

type ImageDBType = {
    id: number;
    uid: string;
    name: string;
    content: string;
    width: number;
    height: number;
    group_name: string;
};

const generateUniqueImageID = async (): Promise<string> => {
    const id = Math.random().toString(36).slice(-8);

    const result = await queryDB<{ count: number }>(
        `SELECT COUNT(*) as count FROM images WHERE id = ?`,
        [id],
    );

    if (result[0].count === 0) {
        return id;
    }
    return generateUniqueImageID();
};

const entryToType = async (entry: ImageDBType): Promise<ImageType> => {
    return {
        id: entry.id,
        uid: entry.uid,
        meta: {
            width: entry.width,
            height: entry.height,
            content: entry.content,
        },
        name: entry.name,
        annotations: await getAnnotationsFromDB(entry.id),
        group: entry.group_name,
    };
};

export const getImageFromDB = async (id: number): Promise<ImageType> => {
    const result = await queryDB<ImageDBType>(`SELECT * FROM images WHERE id = ?`, [id]);

    if (result.length !== 1) throw new Error();

    return entryToType(result[0]);
};

export const getImagesFromDB = async (): Promise<ImageType[]> => {
    const imagesResult = await queryDB<ImageDBType>(`SELECT * FROM images`);

    return Promise.all(imagesResult.map((entry) => entryToType(entry)));
};

export const createImageInDB = async (image: NewImageType): Promise<ImageType> => {
    const result = await runDB(
        `
        INSERT INTO images (uid, name, content, width, height, group)
        VALUES (?, ?, ?, ?)
    `,
        [await generateUniqueImageID(), image.name, image.content, image.width, image.height, ''],
    );

    return getImageFromDB(result.lastID);
};

export const updateImageInDB = async (image: ImageType): Promise<ImageType> => {
    const oldAnnotations = await getAnnotationsFromDB(image.id);
    const newAnnotations = image.annotations;

    const removedAnnotations = oldAnnotations.filter(
        (existingAnnotation) =>
            !newAnnotations.some((newAnnotation) => existingAnnotation.id === newAnnotation.id),
    );

    await Promise.all(newAnnotations.map((annotation) => updateAnnotationInDB(annotation)));
    await Promise.all(removedAnnotations.map((annotation) => deleteAnnotationInDB(annotation)));

    await runDB(
        `UPDATE images SET uid = ?, name = ?, clean_content = ?, annotated_content = ?, annotation_size = ?, width = ?, height = ?, group_name = ? WHERE id = ?`,
        [
            image.uid,
            image.name,
            image.meta.cleanContent,
            image.meta.annotatedContent,
            image.annotationSize,
            image.meta.width,
            image.meta.height,
            image.group,
            image.id,
        ],
    );

    return fetchImageFromDB(image.id);
};

export const deleteImageInDB = async (image: ImageType): Promise<void> => {
    await runDB(`DELETE FROM images WHERE id = ?`, [image.id]);

    await Promise.all(image.annotations.map((annotation) => deleteAnnotationInDB(annotation)));
};
