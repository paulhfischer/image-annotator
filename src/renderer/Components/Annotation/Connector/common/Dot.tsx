import React, { ReactElement } from 'react';

interface DotProps {
    x: number;
    y: number;
    radius: number;
    color: string;
}
function Dot({ x, y, radius, color }: DotProps): ReactElement {
    return <circle cx={x} cy={y} r={radius} fill={color} />;
}

export default Dot;
