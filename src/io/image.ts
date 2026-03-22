import sizeOf from 'image-size';
import { App, FileSystemAdapter, TFile, arrayBufferToBase64 } from 'obsidian';
import { parseMarkdownLink } from './utils';

export type ImageType = {
    width: number;
    height: number;
    content: string;
};

export const markdownLinkToImage = async (
    value: string,
    source: TFile,
    app: App,
): Promise<ImageType> => {
    const link = parseMarkdownLink(value);
    if (!link) throw new Error('could not parse markdown link!');

    const file = app.metadataCache.getFirstLinkpathDest(link, source.path);
    if (!file) throw new Error('could not find image!');

    if (!(app.vault.adapter instanceof FileSystemAdapter)) {
        throw new Error('could not get image path!');
    }
    const path = app.vault.adapter.getFullPath(file.path);

    const { width, height } = sizeOf(path);
    if (!width || !height) throw new Error('could not get image dimensions!');

    const content = arrayBufferToBase64(await file.vault.readBinary(file));

    return { width, height, content };
};
