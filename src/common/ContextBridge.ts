import {
    AnnotationType,
    ImageType,
    NewAnnotationType,
    NewImageType,
    NewNodeType,
    NodeType,
} from '@common/types';
import { ImageMeta } from '../main/openImage';

export interface ContextBridge {
    openImage: () => Promise<ImageMeta | undefined>;
    saveFile: (
        data: { content: string; filename: string } | { content: string; filename: string }[],
    ) => Promise<void>;
    fetchImagesFromDB: () => Promise<ImageType[]>;
    fetchImageFromDB: (imgID: number) => Promise<ImageType>;
    createImageInDB: (img: NewImageType) => Promise<ImageType>;
    updateImageInDB: (img: ImageType) => Promise<ImageType>;
    deleteImageInDB: (img: ImageType) => Promise<void>;
    createAnnotationInDB: (ann: NewAnnotationType, imgID: number) => Promise<AnnotationType>;
    createNodeInDB: (node: NewNodeType, annotationID: number) => Promise<NodeType>;
}
