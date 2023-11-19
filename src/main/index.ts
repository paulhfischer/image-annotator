import { app, BrowserWindow, ipcMain } from 'electron';
import unhandled from 'electron-unhandled';
import { join } from 'path';

import { ImageType, NewAnnotationType, NewImageType } from '@common/types';
import { createAnnotationInDB } from './database/annotations';
import createDB from './database/create';
import {
    createImageInDB,
    deleteImageInDB,
    fetchImageFromDB,
    fetchImagesFromDB,
    updateImageInDB,
} from './database/images';
import { openImage } from './openImage';
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

const main = async (): Promise<void> => {
    unhandled();

    await app.whenReady();
    await createDB();

    const mainWindow = createBrowserWindow();
    loadUI(mainWindow, app.isPackaged);
    registerIpcEventListeners();
};

main();
