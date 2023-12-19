import React, { ReactElement, useMemo } from 'react';
import { Orientation } from './utils';

interface ArrowProps {
    x: number;
    y: number;
    orientation: Orientation;
    size: number;
    color: string;
    outline?: number;
}
function Arrow({ x, y, orientation, size, color, outline }: ArrowProps): ReactElement {
    const points = useMemo(() => {
        const pts: string[] = [];

        switch (orientation) {
            case 'top':
                // base
                pts.push(`${x - size / 2},${y + size}`);
                pts.push(`${x},${y + 0.75 * size}`);
                pts.push(`${x + size / 2},${y + size}`);
                // tip
                pts.push(`${x},${y}`);
                break;
            case 'right':
                // base
                pts.push(`${x - size},${y - size / 2}`);
                pts.push(`${x - 0.75 * size},${y}`);
                pts.push(`${x - size},${y + size / 2}`);
                // tip
                pts.push(`${x},${y}`);
                break;
            case 'bottom':
                // base
                pts.push(`${x - size / 2},${y - size}`);
                pts.push(`${x},${y - 0.75 * size}`);
                pts.push(`${x + size / 2},${y - size}`);
                // tip
                pts.push(`${x},${y}`);
                break;
            case 'left':
                // base
                pts.push(`${x + size},${y - size / 2}`);
                pts.push(`${x + 0.75 * size},${y}`);
                pts.push(`${x + size},${y + size / 2}`);
                // tip
                pts.push(`${x},${y}`);
                break;
            default:
                throw new Error();
        }

        return pts;
    }, [orientation, x, y, size]);

    return (
        <polygon
            points={points.join(' ')}
            fill={color}
            stroke={outline ? color : undefined}
            strokeWidth={outline}
        />
    );
}
Arrow.defaultProps = {
    outline: undefined,
};

export default Arrow;
