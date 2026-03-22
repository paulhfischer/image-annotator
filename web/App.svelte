<script lang="ts">
    import AnnotationEditor from './components/AnnotationEditor.svelte';
    import AnnotationViewer from './components/AnnotationViewer.svelte';
    import { annotationsStore, modeStore } from './stores';
    import { annotationsToString, type Annotation } from './utils/data';

    let annotations: Annotation[];
    annotationsStore.subscribe((value) => {
        annotations = value;
    });

    let mode: Mode;
    modeStore.subscribe((value) => {
        mode = value;
    });
</script>

{#if mode === 'edit'}
    <div class="image-annotator">
        <AnnotationViewer />
        <AnnotationEditor />
    </div>
    {annotationsToString(annotations)}
{:else}
    <AnnotationViewer />
{/if}

<style>
    .image-annotator {
        display: flex;
        flex-direction: row;
        gap: 40px;
    }
</style>
