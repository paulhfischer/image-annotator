import React, { ReactElement } from 'react';

interface DotProps {
    x: number;
    y: number;
    size: number;
    color: string;
    outline?: number;
}
function Dot({ x, y, size, color, outline }: DotProps): ReactElement {
    return (
        <circle
            cx={x}
            cy={y}
            r={size / 2}
            fill={color}
            stroke={outline ? color : undefined}
            strokeWidth={outline}
        />
    );
}
Dot.defaultProps = {
    outline: undefined,
};

export default Dot;
