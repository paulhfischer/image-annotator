<script lang="ts">
  import { onMount } from 'svelte';
  import { Dimensions, Orientation } from '../types';
  import { areaPath, pathDirectionsToString } from '../utils/paths';
  import { centroidVector, labelVector, Vector } from '../utils/vectors';
  import Path from './Path.svelte';

  export let id: number;
  export let lineWidth: number;

  export let canvasDimensions: Dimensions;
  export let label: string;
  export let orientation: Orientation;
  export let vectors: Vector[];

  let areaDirections: string = '';
  let connectorDirections: string = '';

  onMount(() => {
    areaDirections = pathDirectionsToString(areaPath(vectors));
    connectorDirections = pathDirectionsToString([
      { command: 'move', target: centroidVector(vectors) },
      { command: 'line', target: labelVector(centroidVector(vectors), canvasDimensions, orientation) },
    ]);
  });
</script>

<g id="{id.toString()}">
  <g class="question"></g>
  <g class="answer">
    <mask id="mask-answer-{id}">
      <rect x="0" y="0" width="100%" height="100%" fill="white" />
      <path d="{areaDirections}" fill="black" />
    </mask>
    <Path path="{areaDirections}" size="{lineWidth}" color="black" outline="{lineWidth / 2}" />
    <Path path="{connectorDirections}" size="{lineWidth}" color="black" outline="{lineWidth / 2}" maskID="mask-answer-{id}" />
  </g>
</g>
