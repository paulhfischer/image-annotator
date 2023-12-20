import React, { ReactElement, useMemo } from 'react';
import { rotateVector } from './utils';

interface TriangleProps {
    x: number;
    y: number;
    rotation: number;
    size: number;
    lineWidth: number;
    color: string;
    outline?: number;
}
function Triangle({
    x,
    y,
    rotation,
    size,
    lineWidth,
    color,
    outline,
}: TriangleProps): ReactElement {
    const points = useMemo(() => {
        return [
            // base
            { x: x - size / 2, y: y + size },
            { x: x + size / 2, y: y + size },
            // tip
            { x: x + lineWidth / 2, y },
            { x: x - lineWidth / 2, y },
        ]
            .map((pt) => rotateVector(pt, { x, y }, rotation))
            .map((pt) => `${pt.x},${pt.y}`);
    }, [x, y, size, lineWidth, rotation]);

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
