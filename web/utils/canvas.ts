import type { Orientation } from '../types';

export type Dimensions = {
    width: number;
    height: number;
};

export const getLineWidth = (canvasDimensions: Dimensions): number => {
    return Math.round(Math.max(canvasDimensions.width, canvasDimensions.height) * (0.6 / 100));
};

export const getFontSize = (canvasDimensions: Dimensions): number => {
    return getLineWidth(canvasDimensions) * 6;
};

export const getTipSize = (canvasDimensions: Dimensions): number => {
    return getLineWidth(canvasDimensions) * 2;
};

export const getTailSize = (canvasDimensions: Dimensions): number => {
    return getLineWidth(canvasDimensions) * 10;
};

export const getBorder = (canvasDimensions: Dimensions): { lr: number; tb: number } => {
    return {
        lr: 14 * getFontSize(canvasDimensions),
        tb: 4 * getFontSize(canvasDimensions),
    };
};

export const getViewBox = (canvasDimensions: Dimensions): string => {
    return [
        -getBorder(canvasDimensions).lr,
        -getBorder(canvasDimensions).tb,
        canvasDimensions.width + 2 * getBorder(canvasDimensions).lr,
        canvasDimensions.height + 2 * getBorder(canvasDimensions).tb,
    ].join(' ');
};

export const getMaxLabelWidth = (
    canvasDimensions: Dimensions,
    orientation: Orientation,
): number => {
    switch (orientation) {
        case 'top':
        case 'bottom':
            return canvasDimensions.width + 2 * getBorder(canvasDimensions).lr;
        case 'left':
        case 'right':
            return getBorder(canvasDimensions).lr;
        default:
            throw new Error(`Unknown orientation: ${orientation}`);
    }
};
