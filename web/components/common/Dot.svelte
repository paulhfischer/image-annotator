<script lang="ts">
    import { getLineWidth, getTipSize, type Dimensions } from '../../utils/canvas';
    import type { Vector } from '../../utils/vectors';

    export let canvasDimensions: Dimensions;
    export let position: Vector;
    export let fillColor: string;
    export let outlineColor: string;

    $: size = getTipSize(canvasDimensions);
    $: lineWidth = getLineWidth(canvasDimensions);
</script>

<circle
    cx={position.x}
    cy={position.y}
    r={size / 2}
    fill={fillColor}
    stroke={outlineColor}
    stroke-width={lineWidth / 4}
/>
