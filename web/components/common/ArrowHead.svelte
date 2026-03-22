<script lang="ts">
    import { getLineWidth, getTipSize, type Dimensions } from '../../utils/canvas';
    import { arrowHeadVectors, vectorsToString, type Vector } from '../../utils/vectors';

    export let canvasDimensions: Dimensions;
    export let position: Vector;
    export let rotation: number;
    export let fillColor: string;
    export let outlineColor: string;

    $: size = getTipSize(canvasDimensions);
    $: lineWidth = getLineWidth(canvasDimensions);
    $: vectors = vectorsToString(arrowHeadVectors(position, size, rotation));
</script>

<polygon points={vectors} fill={fillColor} stroke={outlineColor} stroke-width={lineWidth / 4} />
