import React, { ReactElement, useMemo } from 'react';
import { Orientation } from './utils';

interface TriangleProps {
    x: number;
    y: number;
    orientation: Orientation;
    size: number;
    lineWidth: number;
    color: string;
    outline?: number;
}
function Triangle({
    x,
    y,
    orientation,
    size,
    lineWidth,
    color,
    outline,
}: TriangleProps): ReactElement {
    const points = useMemo(() => {
        const pts: string[] = [];

        switch (orientation) {
            case 'top':
                // base
                pts.push(`${x - size / 2},${y + size}`);
                pts.push(`${x + size / 2},${y + size}`);
                // tip
                pts.push(`${x + lineWidth / 2},${y}`);
                pts.push(`${x - lineWidth / 2},${y}`);
                break;
            case 'right':
                // base
                pts.push(`${x - size},${y - size / 2}`);
                pts.push(`${x - size},${y + size / 2}`);
                // tip
                pts.push(`${x},${y + lineWidth / 2}`);
                pts.push(`${x},${y - lineWidth / 2}`);
                break;
            case 'bottom':
                // base
                pts.push(`${x - size / 2},${y - size}`);
                pts.push(`${x + size / 2},${y - size}`);
                // tip
                pts.push(`${x + lineWidth / 2},${y}`);
                pts.push(`${x - lineWidth / 2},${y}`);
                break;
            case 'left':
                // base
                pts.push(`${x + size},${y - size / 2}`);
                pts.push(`${x + size},${y + size / 2}`);
                // tip
                pts.push(`${x},${y + lineWidth / 2}`);
                pts.push(`${x},${y - lineWidth / 2}`);
                break;
            default:
                throw new Error();
        }

        return pts;
    }, [orientation, x, y, size, lineWidth]);

    return (
        <polygon
            points={points.join(' ')}
            fill={color}
            stroke={outline ? color : undefined}
            strokeWidth={outline}
        />
    );
}
Triangle.defaultProps = {
    outline: undefined,
};

export default Triangle;
