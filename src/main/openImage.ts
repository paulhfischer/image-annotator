import { dialog } from 'electron';
import { readFileSync } from 'fs';
import sizeOf from 'image-size';
import { basename } from 'path';

export interface ImageMeta {
    path: string;
    filename: string;
    content: string;
    width: number;
    height: number;
}

export const openImage = async (): Promise<ImageMeta | undefined> => {
    const { filePaths, canceled } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Images', extensions: ['jpg', 'jpeg'] }],
    });

    if (canceled) {
        return undefined;
    }
    const path = filePaths[0];
    const filename = basename(path);
    const content = readFileSync(path, { encoding: 'base64' });
    const { width, height } = sizeOf(path);

    if (!width || !height) throw new Error();

    return { path, filename, content, width, height };
};
