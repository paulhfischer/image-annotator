<script lang="ts">
    import { modeStore, selectedAnnotationStore } from '../stores';
    import { type Orientation } from '../types';
    import { getFontSize, getLineWidth, getMaxLabelWidth, type Dimensions } from '../utils/canvas';
    import type { Annotation } from '../utils/data';
    import { areaPath, pathDirectionsToString } from '../utils/paths';
    import { centroidVector, labelVector, type Vector } from '../utils/vectors';
    import Dot from './common/Dot.svelte';
    import Label from './common/Label.svelte';
    import Marker from './common/Marker.svelte';
    import Path from './common/Path.svelte';

    export let id: number;
    export let label: string;
    export let orientation: Orientation;
    export let points: Vector[];
    export let canvasDimensions: Dimensions;

    let selectedAnnotation: Annotation | null;
    $: selectedAnnotation = $selectedAnnotationStore;

    let mode: Mode;
    $: mode = $modeStore;

    $: lineWidth = getLineWidth(canvasDimensions);
    $: fontSize = getFontSize(canvasDimensions);
    $: labelPosition = labelVector(centroidVector(points), canvasDimensions, orientation);
    $: maxLabelWidth = getMaxLabelWidth(canvasDimensions, orientation);
    $: areaDirections = pathDirectionsToString(areaPath(points));
    $: connectorDirections = pathDirectionsToString([
        { command: 'move', target: centroidVector(points) },
        { command: 'line', target: labelPosition },
    ]);
    $: color = selectedAnnotation && selectedAnnotation.id === id ? 'red' : 'black';
    $: cursor = mode === 'edit' ? 'pointer' : 'default';
</script>

<g id={id.toString()} on:click style="cursor: {cursor}">
    <mask id="mask-answer-{id}" maskUnits="userSpaceOnUse">
        <rect x="0" y="0" width="100%" height="100%" fill="white" />
        <path d={areaDirections} fill="black" />
    </mask>

    <Path path={areaDirections} size={lineWidth * 2} color="white" />
    <Path
        path={connectorDirections}
        size={lineWidth * 2}
        color="white"
        maskID={`mask-answer-${id}`}
    />
    {#if mode === 'question'}
        <Marker
            {canvasDimensions}
            position={labelPosition}
            {orientation}
            fillColor={color}
            outlineColor="white"
        />
    {:else}
        <Label
            text={label}
            {orientation}
            position={labelPosition}
            {color}
            {fontSize}
            maxWidth={maxLabelWidth}
        />
    {/if}
    <Path path={areaDirections} size={lineWidth} {color} />
    <Path path={connectorDirections} size={lineWidth} {color} maskID={`mask-answer-${id}`} />

    {#if mode === 'edit'}
        {#each points as point}
            <Dot {canvasDimensions} position={point} fillColor={color} outlineColor="white" />
        {/each}
    {/if}
</g>
