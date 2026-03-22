<script lang="ts">
    import { modeStore, selectedAnnotationStore } from '../stores';
    import { type Orientation, type TipStyle } from '../types';
    import { getFontSize, getLineWidth, getMaxLabelWidth, type Dimensions } from '../utils/canvas';
    import type { Annotation } from '../utils/data';
    import { pathDirectionsToString, singleConnectorPath } from '../utils/paths';
    import {
        connectionVector,
        labelVector,
        tailBendVector,
        vectorAngleDeg,
        type Vector,
    } from '../utils/vectors';
    import ArrowHead from './common/ArrowHead.svelte';
    import Dot from './common/Dot.svelte';
    import Label from './common/Label.svelte';
    import Marker from './common/Marker.svelte';
    import Path from './common/Path.svelte';

    export let id: number;
    export let label: string;
    export let orientation: Orientation;
    export let tip: Vector;
    export let angle: number;
    export let style: TipStyle;
    export let canvasDimensions: Dimensions;

    let selectedAnnotation: Annotation | null;
    $: selectedAnnotation = $selectedAnnotationStore;

    let mode: Mode;
    $: mode = $modeStore;

    $: lineWidth = getLineWidth(canvasDimensions);
    $: fontSize = getFontSize(canvasDimensions);
    $: tailBendPosition = tailBendVector(tip, angle, canvasDimensions, orientation);
    $: labelPosition = labelVector(tailBendPosition, canvasDimensions, orientation);
    $: maxLabelWidth = getMaxLabelWidth(canvasDimensions, orientation);
    $: directions = pathDirectionsToString(
        singleConnectorPath(tip, angle, labelPosition, style, canvasDimensions, orientation),
    );
    $: color = selectedAnnotation && selectedAnnotation.id === id ? 'red' : 'black';
    $: cursor = mode === 'edit' ? 'pointer' : 'default';
</script>

<g id={id.toString()} on:click style="cursor: {cursor}">
    <Path path={directions} size={lineWidth * 2} color="white" />
    {#if style === 'dot'}
        <Dot {canvasDimensions} position={tip} fillColor={color} outlineColor="white" />
    {:else if style === 'arrow'}
        <ArrowHead
            {canvasDimensions}
            position={tip}
            rotation={vectorAngleDeg(connectionVector(tailBendPosition, tip))}
            fillColor={color}
            outlineColor="white"
        />
    {/if}
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
