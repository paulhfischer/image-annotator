import React, { ReactElement, useMemo } from 'react';
import { rotateVector } from './utils';

interface ArrowProps {
    x: number;
    y: number;
    rotation: number;
    size: number;
    color: string;
    outline?: number;
}
function Arrow({ x, y, rotation, size, color, outline }: ArrowProps): ReactElement {
    const points = useMemo(() => {
        return [
            // base
            { x: x - size / 2, y: y + size },
            { x, y: y + 0.75 * size },
            { x: x + size / 2, y: y + size },
            // tip
            { x, y },
        ]
            .map((pt) => rotateVector(pt, { x, y }, rotation))
            .map((pt) => `${pt.x},${pt.y}`);
    }, [x, y, size, rotation]);

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
