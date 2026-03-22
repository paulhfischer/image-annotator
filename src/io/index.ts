import { App, TFile } from 'obsidian';
import {
    AnnotationType,
    annotationsToMarkdownTable,
    markdownTableToAnnotations,
} from './annotations';
import { readAnnotations, readImage, writeAnnotations } from './file';
import { ImageType, markdownLinkToImage } from './image';

export const getImage = async (file: TFile, app: App): Promise<ImageType> => {
    return markdownLinkToImage(readImage(file, app), file, app);
};

export const getAnnotations = async (file: TFile): Promise<AnnotationType[]> => {
    return markdownTableToAnnotations(await readAnnotations(file));
};

export const setAnnotations = (annotations: AnnotationType[], file: TFile): void => {
    writeAnnotations(annotationsToMarkdownTable(annotations), file);
};
