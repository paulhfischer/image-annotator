import { dialog } from 'electron';
import { basename } from 'path';
import sharp from 'sharp';

const IMAGE_SIZE = 2000;

export interface ImageMeta {
    path: string;
    filename: string;
    content: string;
    width: number;
    height: number;
}

const resizeImage = async (image: sharp.Sharp): Promise<sharp.Sharp> => {
    const { width, height } = await image.metadata();

    if (!width || !height) throw new Error();

    let resizedImage = image;
    if (width > IMAGE_SIZE || height > IMAGE_SIZE) {
        resizedImage = image.resize({
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            fit: sharp.fit.inside,
        });

        dialog.showMessageBox({
            message: `Image has been downsized!`,
            type: 'info',
        });
    }

    return sharp(await resizedImage.toBuffer());
};

export const openImage = async (): Promise<ImageMeta | undefined> => {
    const { filePaths, canceled } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'tiff'] }],
    });

    if (canceled) {
        return undefined;
    }
    const path = filePaths[0];
    const filename = basename(path);

    let image = sharp(path).jpeg({
        quality: 100,
        mozjpeg: true,
    });
    image = await resizeImage(image);
    const { width, height } = await sharp(await image.toBuffer()).metadata();
    const content = (await image.toBuffer()).toString('base64');

    if (!width || !height) throw new Error();

    return { path, filename, content, width, height };
};
