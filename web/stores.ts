import { writable } from 'svelte/store';
import { annotationsFromString, imageFromString, type Annotation, type Image } from './utils/data';

export const annotationsStore = writable<Annotation[]>([]);
export const selectedAnnotationStore = writable<Annotation | null>(null);
export const imageStore = writable<Image>({ path: '', dimensions: { width: 100, height: 100 } });
export const modeStore = writable<Mode>();

export const setStores = async (
    annotationString: string,
    imageString: string,
    mode: Mode,
    selectedAnnotation: number | null,
) => {
    const annotations = annotationsFromString(annotationString);
    const image = await imageFromString(imageString);

    annotationsStore.set(annotations);
    if (selectedAnnotation) {
        selectedAnnotationStore.set(
            annotations.find((annotation) => annotation.id === selectedAnnotation)!,
        );
    }

    imageStore.set(image);

    modeStore.set(mode);
};
