import React, { ReactElement, useMemo } from 'react';
import { Orientation } from './utils';

interface TriangleProps {
    x: number;
    y: number;
    orientation: Orientation;
    size: number;
    color: string;
}
function Triangle({ x, y, orientation, size, color }: TriangleProps): ReactElement {
    const angle = useMemo(() => {
        switch (orientation) {
            case 'top':
                return 30;
            case 'right':
                return 0;
            case 'bottom':
                return 90;
            case 'left':
                return 60;
            default:
                throw new Error();
        }
    }, [orientation]);

    const points = useMemo(() => {
        const pts: string[] = [];
        for (let i = 0; i < 3; i += 1) {
            const rad = (angle + 120 * i) * (Math.PI / 180);
            const px = x + (size / 2) * Math.cos(rad);
            const py = y + (size / 2) * Math.sin(rad);
            pts.push(`${Math.round(px)},${Math.round(py)}`);
        }

        return pts;
    }, [angle, x, y, size]);

    return <polygon points={points.join(' ')} fill={color} />;
}

export default Triangle;
