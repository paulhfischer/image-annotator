import React, { ReactElement } from 'react';

interface NodeProps {
    x: number;
    y: number;
    lineWidth: number;
    color: string;
    filled: boolean;
}

function Node({ x, y, lineWidth, color, filled }: NodeProps): ReactElement {
    return (
        <circle
            cx={x}
            cy={y}
            r={lineWidth * 5}
            stroke={color}
            strokeWidth={lineWidth}
            fill={filled ? color : 'none'}
        />
    );
}

export default Node;
