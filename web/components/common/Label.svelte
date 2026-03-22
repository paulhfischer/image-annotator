<script lang="ts">
    import { type Orientation } from '../../types';
    import { getTextAnchor, getTextBaseline, getTextTransform, wrapText } from '../../utils/text';
    import { type Vector } from '../../utils/vectors';

    export let text: string;
    export let orientation: Orientation;
    export let position: Vector;
    export let color: string;
    export let fontSize: number;
    export let maxWidth: number;

    const fontFamily = 'Avenir Next Condensed';

    $: lines = wrapText(text, maxWidth, fontSize, fontFamily);
    $: textTransform = getTextTransform(position, orientation, lines.length, fontSize);
    $: textAnchor = getTextAnchor(orientation);
    $: textBaseline = getTextBaseline(orientation);
</script>

<text text-anchor={textAnchor} transform={textTransform} fill={color} font-size={fontSize} font-family={fontFamily}>
    {#each lines as line, index}
        <tspan x="0" dy={index === 0 ? '0' : '1em'} dominant-baseline={textBaseline}>
            {line || ' '}
        </tspan>
    {/each}
</text>
