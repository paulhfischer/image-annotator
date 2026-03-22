<script lang="ts">
    export let path: string;
    export let size: number;
    export let color: string;
    export let maskID: string | null = null;

    $: strokeWidth = size / 2;
</script>

<path d={path} fill="none" stroke={color} stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round" mask={maskID ? `url(#${maskID})` : ''} />
