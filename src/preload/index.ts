import type { ContextBridge } from '@common/ContextBridge';
import { ImageType, NewAnnotationType, NewImageType } from '@common/types';
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('ContextBridge', <ContextBridge>{
    openImage: () => ipcRenderer.invoke('openImage'),
    saveFile: (
        data: { content: string; filename: string } | { content: string; filename: string }[],
    ) => ipcRenderer.invoke('saveFile', { data }),
    fetchImagesFromDB: () => ipcRenderer.invoke('fetchImagesFromDB'),
    fetchImageFromDB: (imageID: number) => ipcRenderer.invoke('fetchImageFromDB', { imageID }),
    createImageInDB: (image: NewImageType) => ipcRenderer.invoke('createImageInDB', { image }),
    updateImageInDB: (image: ImageType) => ipcRenderer.invoke('updateImageInDB', { image }),
    deleteImageInDB: (image: ImageType) => ipcRenderer.invoke('deleteImageInDB', { image }),
    createAnnotationInDB: (annotation: NewAnnotationType, imageID: number) =>
        ipcRenderer.invoke('createAnnotationInDB', { annotation, imageID }),
});
