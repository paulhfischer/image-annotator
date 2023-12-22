import { app, BrowserWindow, ipcMain } from 'electron';
import unhandled from 'electron-unhandled';
import { join } from 'path';

import { ImageType, NewAnnotationType, NewImageType } from '@common/types';
import sharp from 'sharp';
import { createAnnotationInDB } from './database/annotations';
import createDB from './database/create';
import {
    createImageInDB,
    deleteImageInDB,
    fetchImageFromDB,
    fetchImagesFromDB,
    updateImageInDB,
} from './database/images';
import { openImage, resizeImage } from './openImage';
import saveFile from './saveFile';

const createBrowserWindow = (): BrowserWindow => {
    const preloadScriptFilePath = join(__dirname, '..', 'dist-preload', 'index.js');

    return new BrowserWindow({
        minWidth: 1000,
        width: 1000,
        minHeight: 400,
        height: 700,
        autoHideMenuBar: true,
        webPreferences: {
            preload: preloadScriptFilePath,
            nodeIntegration: true,
        },
    });
};

const loadUI = (browserWindow: BrowserWindow, isPackaged: boolean): void => {
    if (isPackaged) {
        browserWindow.loadFile(join(__dirname, '..', 'dist-renderer', 'index.html'));
    } else {
        browserWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    }
};

const registerIpcEventListeners = () => {
    ipcMain.handle('openImage', openImage);
    ipcMain.handle(
        'saveFile',
        async (
            _,
            {
                data,
            }: {
                data:
                    | { content: string; filename: string }
                    | { content: string; filename: string }[];
            },
        ) => saveFile(data),
    );

    ipcMain.handle('fetchImagesFromDB', fetchImagesFromDB);
    ipcMain.handle('fetchImageFromDB', async (_, { imageID }: { imageID: number }) =>
        fetchImageFromDB(imageID),
    );
    ipcMain.handle('createImageInDB', async (_, { image }: { image: NewImageType }) =>
        createImageInDB(image),
    );
    ipcMain.handle('updateImageInDB', async (_, { image }: { image: ImageType }) =>
        updateImageInDB(image),
    );
    ipcMain.handle('deleteImageInDB', async (_, { image }: { image: ImageType }) =>
        deleteImageInDB(image),
    );
    ipcMain.handle(
        'createAnnotationInDB',
        async (_, { annotation, imageID }: { annotation: NewAnnotationType; imageID: number }) =>
            createAnnotationInDB(annotation, imageID),
    );
};

const improveImages = async (): Promise<void> => {
    const images = await fetchImagesFromDB();

    images.forEach(async (image, index) => {
        console.log(`processing ${image.uid} (${index + 1}/${images.length})`);
        const cleanImg = await resizeImage(
            sharp(Buffer.from(image.meta.cleanContent, 'base64')).jpeg({
                quality: 100,
                mozjpeg: true,
            }),
        );
        const annotatedImage = image.meta.annotatedContent
            ? await resizeImage(
                  sharp(Buffer.from(image.meta.annotatedContent, 'base64')).jpeg({
                      quality: 100,
                      mozjpeg: true,
                  }),
              )
            : undefined;

        const oldLength = image.meta.cleanContent.length;
        const newLength = (await cleanImg.toBuffer()).toString('base64').length;

        await updateImageInDB({
            ...image,
            meta: {
                ...image.meta,
                cleanContent: (await cleanImg.toBuffer()).toString('base64'),
                annotatedContent: annotatedImage
                    ? (await annotatedImage.toBuffer()).toString('base64')
                    : undefined,
            },
        });
        console.log(
            `=> updated ${image.uid} (${index + 1}/${images.length}) | difference: ${
                ((oldLength - newLength) / oldLength) * 100
            }%`,
        );
    });
};

const main = async (): Promise<void> => {
    unhandled();

    await app.whenReady();
    await createDB();

    await improveImages();

    const mainWindow = createBrowserWindow();
    loadUI(mainWindow, app.isPackaged);
    registerIpcEventListeners();
};

main();
