<script lang="ts">
    import { type Orientation } from '../../types';
    import { getLineWidth, type Dimensions } from '../../utils/canvas';
    import { triangleVectors, vectorsToString, type Vector } from '../../utils/vectors';

    export let canvasDimensions: Dimensions;
    export let position: Vector;
    export let orientation: Orientation;
    export let fillColor: string;
    export let outlineColor: string;

    $: vectors = vectorsToString(triangleVectors(position, canvasDimensions, orientation));
    $: strokeWidth = getLineWidth(canvasDimensions) / 2;
</script>

<polygon points={vectors} fill={fillColor} stroke={outlineColor} stroke-width={strokeWidth} />
