<script lang="ts">
    import { modeStore, selectedAnnotationStore } from '../stores';
    import { type Orientation } from '../types';
    import { getFontSize, getLineWidth, getMaxLabelWidth, type Dimensions } from '../utils/canvas';
    import type { Annotation } from '../utils/data';
    import { bracePath, pathDirectionsToString } from '../utils/paths';
    import { centroidVector, labelVector, type Vector } from '../utils/vectors';
    import Label from './common/Label.svelte';
    import Marker from './common/Marker.svelte';
    import Path from './common/Path.svelte';

    export let id: number;
    export let label: string;
    export let orientation: Orientation;
    export let tips: [Vector, Vector];
    export let canvasDimensions: Dimensions;

    let selectedAnnotation: Annotation | null;
    $: selectedAnnotation = $selectedAnnotationStore;

    let mode: Mode;
    $: mode = $modeStore;

    $: lineWidth = getLineWidth(canvasDimensions);
    $: fontSize = getFontSize(canvasDimensions);
    $: labelPosition = labelVector(centroidVector(tips), canvasDimensions, orientation);
    $: maxLabelWidth = getMaxLabelWidth(canvasDimensions, orientation);
    $: directions = pathDirectionsToString([
        ...bracePath(tips[0], tips[1], orientation),
        { command: 'line', target: labelPosition },
    ]);
    $: color = selectedAnnotation && selectedAnnotation.id === id ? 'red' : 'black';
    $: cursor = mode === 'edit' ? 'pointer' : 'default';
</script>

<g id={id.toString()} on:click style="cursor: {cursor}">
    <Path path={directions} size={lineWidth * 2} color="white" />
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
    <Path path={directions} size={lineWidth} {color} />
</g>
