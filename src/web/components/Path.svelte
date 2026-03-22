<script lang="ts">
    export let path: string;
    export let size: number;
    export let color: string;
    export let outline: number = 0;
    export let maskID: string | null = null;
</script>

<path d="{path}" fill="none" stroke="{color}" stroke-width="{size / 2 + outline}" stroke-linecap="round" stroke-linejoin="round" mask="{maskID ? `url(#${maskID})` : ''}" />
