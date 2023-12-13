import { ImageType } from '@common/types';
import * as Papa from 'papaparse';
import { sortAnnotations } from './Components/ImageViewer/utils';

const createAnkiCSV = (images: ImageType[]): string => {
    return Papa.unparse(
        images.map((image) => {
            return {
                id: image.uid,
                title: image.name,
                labels: sortAnnotations(image.annotations, image.meta.width, image.meta.height)
                    .map((annotation, index) =>
                        annotation.permanent ? undefined : `{{c${index + 1}::${index + 1}}}`,
                    )
                    .filter((row) => row !== undefined)
                    .join(''),
                infos: '',
                image: `<img src="${image.uid}.svg">`,
            };
        }),
        { header: true },
    );
};

export default createAnkiCSV;
