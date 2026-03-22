<script lang="ts">
    import { modeStore, selectedAnnotationStore } from '../stores';
    import { type Orientation, type TipStyle } from '../types';
    import { getFontSize, getLineWidth, getMaxLabelWidth, type Dimensions } from '../utils/canvas';
    import type { Annotation } from '../utils/data';
    import { multiConnectorPath, pathDirectionsToString } from '../utils/paths';
    import { connectionVector, labelVector, vectorAngleDeg, type Vector } from '../utils/vectors';
    import ArrowHead from './common/ArrowHead.svelte';
    import Dot from './common/Dot.svelte';
    import Label from './common/Label.svelte';
    import Marker from './common/Marker.svelte';
    import Path from './common/Path.svelte';

    export let id: number;
    export let label: string;
    export let orientation: Orientation;
    export let tips: Vector[];
    export let connectionPoint: Vector;
    export let style: TipStyle;
    export let canvasDimensions: Dimensions;

    let selectedAnnotation: Annotation | null;
    $: selectedAnnotation = $selectedAnnotationStore;

    let mode: Mode;
    $: mode = $modeStore;

    $: lineWidth = getLineWidth(canvasDimensions);
    $: fontSize = getFontSize(canvasDimensions);
    $: labelPosition = labelVector(connectionPoint, canvasDimensions, orientation);
    $: maxLabelWidth = getMaxLabelWidth(canvasDimensions, orientation);
    $: directions = pathDirectionsToString(
        multiConnectorPath(tips, connectionPoint, labelPosition, style, canvasDimensions),
    );
    $: color = selectedAnnotation && selectedAnnotation.id === id ? 'red' : 'black';
    $: cursor = mode === 'edit' ? 'pointer' : 'default';
</script>

<g id={id.toString()} on:click style="cursor: {cursor}">
    <Path path={directions} size={lineWidth * 2} color="white" />
    {#each tips as tip}
        {#if style === 'dot'}
            <Dot {canvasDimensions} position={tip} fillColor={color} outlineColor="white" />
        {:else if style === 'arrow'}
            <ArrowHead
                {canvasDimensions}
                position={tip}
                rotation={vectorAngleDeg(connectionVector(connectionPoint, tip))}
                fillColor={color}
                outlineColor="white"
            />
        {/if}
    {/each}
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
