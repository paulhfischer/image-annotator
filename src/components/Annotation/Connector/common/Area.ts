type Vector = { x: number; y: number };

type PathDirectionMove = {
    command: 'move';
    target: Vector;
};

type PathDirectionLine = {
    command: 'line';
    target: Vector;
};

type PathDirectionQuadraticBezier = {
    command: 'quadraticBezier';
    start: Vector;
    end: Vector;
};

type PathDirectionSmoothQuadraticBezier = {
    command: 'smoothQuadraticBezier';
    target: Vector;
};

type PathDirectionCubicBezier = {
    command: 'cubicBezier';
    controlStart: Vector;
    controlEnd: Vector;
    end: Vector;
};

type PathDirection =
    | PathDirectionMove
    | PathDirectionLine
    | PathDirectionQuadraticBezier
    | PathDirectionSmoothQuadraticBezier
    | PathDirectionCubicBezier;

const connectionVector = (pointA: Vector, pointB: Vector): Vector => {
    return {
        x: pointB.x - pointA.x,
        y: pointB.y - pointA.y,
    };
};

const angleRad = (vectorA: Vector, vectorB: Vector): number => {
    const dy = vectorB.y - vectorA.y;
    const dx = vectorB.x - vectorA.x;

    return Math.atan2(dy, dx);
};

const vectorLength = (vector: Vector): number => {
    return Math.sqrt(vector.x ** 2 + vector.y ** 2);
};

const centroid = (vectors: Vector[]): Vector => {
    let xSum = 0;
    let ySum = 0;
    let areaSum = 0;
    const n = vectors.length;

    for (let i = 0; i < n; i += 1) {
        const { x: x0, y: y0 } = vectors[i];
        const { x: x1, y: y1 } = vectors[(i + 1) % n];
        const area = x0 * y1 - x1 * y0;
        xSum += (x0 + x1) * area;
        ySum += (y0 + y1) * area;
        areaSum += area;
    }

    const area = areaSum / 2;
    return {
        x: xSum / (6 * area),
        y: ySum / (6 * area),
    };
};

const smoothPath = (vectors: Vector[], smoothing = 0.3): PathDirection[] => {
    const controlVector = (
        current: Vector,
        previous: Vector | null,
        next: Vector | null,
        reverse: Boolean = false,
    ): Vector => {
        const p = previous || current;
        const n = next || current;

        const angle = reverse ? angleRad(n, p) : angleRad(p, n);
        const length = vectorLength(connectionVector(p, n)) * smoothing;

        return { x: current.x + Math.cos(angle) * length, y: current.y + Math.sin(angle) * length };
    };

    if (vectors.length === 0) {
        return [];
    }
    if (vectors.length === 1) {
        return [{ command: 'move', target: vectors[0] }];
    }
    if (vectors.length === 2) {
        return [
            { command: 'move', target: vectors[0] },
            { command: 'line', target: vectors[1] },
        ];
    }

    const directions: PathDirection[] = [];
    for (let i = 0; i < vectors.length - 1; i += 1) {
        if (i === 0) {
            directions.push({ command: 'move', target: vectors[i] });
        } else if (i === 1) {
            directions.push({
                command: 'cubicBezier',
                controlStart: controlVector(
                    vectors[vectors.length - 2],
                    vectors[vectors.length - 3],
                    vectors[vectors.length - 1],
                ),
                controlEnd: controlVector(vectors[i], vectors[i - 1], vectors[i + 1], true),
                end: vectors[i],
            });
        } else {
            directions.push({
                command: 'cubicBezier',
                controlStart: controlVector(vectors[i - 1], vectors[i - 2], vectors[i]),
                controlEnd: controlVector(vectors[i], vectors[i - 1], vectors[i + 1], true),
                end: vectors[i],
            });
        }
    }

    return directions;
};

const closedSmoothPath = (vectors: Vector[], smoothing = 0.3): PathDirection[] => {
    if (vectors.length < 3) {
        return smoothPath(vectors, smoothing);
    }

    return smoothPath([...vectors, vectors[0], vectors[1]], smoothing);
};

const directionsToString = (directions: PathDirection[]): string => {
    return directions
        .map((direction) => {
            switch (direction.command) {
                case 'move':
                    return `M ${direction.target.x} ${direction.target.y}`;
                case 'line':
                    return `L ${direction.target.x} ${direction.target.y}`;
                case 'quadraticBezier':
                    return `Q ${direction.start.x},${direction.start.y} ${direction.end.x},${direction.end.y}`;
                case 'smoothQuadraticBezier':
                    return `T ${direction.target.x},${direction.target.y}`;
                case 'cubicBezier':
                    return `C ${direction.controlStart.x},${direction.controlStart.y} ${direction.controlEnd.x},${direction.controlEnd.y} ${direction.end.x},${direction.end.y}`;
                default:
                    throw new Error();
            }
        })
        .join(' ');
};

const points: Vector[] = [
    { x: 344, y: 186 },
    { x: 458, y: 276 },
    { x: 370, y: 339 },
    { x: 203, y: 270 },
    { x: 170, y: 188 },
];

console.log(directionsToString(closedSmoothPath(points)));

/*
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000">
  <mask id="area">
    <rect x="0" y="0" width="100%" height="100%" fill="white" />
    <path d="M 344 186 C 430.4,212.4 450.2,230.1 458,276 C 465.8,321.9 446.5,340.8 370,339 C 293.5,337.2 263,315.3 203,270 C 143,224.7 127.7,213.2 170,188 C 212.3,162.8 257.6,159.60000000000002 344,186" fill="black" />
  </mask>
  <path d="M 344 186 C 430.4,212.4 450.2,230.1 458,276 C 465.8,321.9 446.5,340.8 370,339 C 293.5,337.2 263,315.3 203,270 C 143,224.7 127.7,213.2 170,188 C 212.3,162.8 257.6,159.60000000000002 344,186" stroke="red" fill="none"/>
  <line x1="0" y1="0" x2="1000" y2="1000" stroke="green" mask="url(#area)"/>
</svg>
*/
