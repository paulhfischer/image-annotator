import { ImageType } from 'src/io/image';

export const getLineWidth = (image: ImageType) => {
    return Math.round(Math.max(image.width, image.height) * (0.3 / 100)); // TODO load from settings
};

export const getFontSize = (image: ImageType) => {
    return getLineWidth(image) * 6;
};

export const getBorder = (image: ImageType) => {
    return {
        x: 14 * getFontSize(image),
        y: 4 * getFontSize(image),
    };
};

export const getViewBox = (image: ImageType) => {
    return [
        -getBorder(image).x,
        -getBorder(image).y,
        image.width + 2 * getBorder(image).x,
        image.height + 2 * getBorder(image).y,
    ].join(' ');
};

export const getImageURL = (image: ImageType) => {
    return `data:image/jpg;base64,${image.content}`;
};
