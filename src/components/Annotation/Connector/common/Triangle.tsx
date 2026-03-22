import React, { ReactElement, useMemo } from 'react';
import { rotateVector } from './utils';

interface TriangleProps {
    x: number;
    y: number;
    rotation: number;
    size: number;
    tipSize?: number;
    color: string;
    outline?: number;
}
function Triangle({ x, y, rotation, size, tipSize, color, outline }: TriangleProps): ReactElement {
    const points = useMemo(() => {
        return [
            // base
            { x: x - size / 2, y: y + size },
            { x: x + size / 2, y: y + size },
            // tip
            ...(tipSize && tipSize > 0
                ? [
                      { x: x + tipSize / 4, y },
                      { x: x - tipSize / 4, y },
                  ]
                : [{ x, y }]),
        ]
            .map((pt) => rotateVector(pt, { x, y }, rotation))
            .map((pt) => `${pt.x},${pt.y}`);
    }, [x, y, size, tipSize, rotation]);

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
    tipSize: 0,
};

export default Triangle;
