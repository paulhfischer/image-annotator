<script lang="ts">
    import { annotationsStore, imageStore, modeStore, selectedAnnotationStore } from '../stores';
    import { getViewBox } from '../utils/canvas';
    import { type Annotation, type Image } from '../utils/data';
    import type { Vector } from '../utils/vectors';
    import Area from './Area.svelte';
    import Brace from './Brace.svelte';
    import MultiConnector from './MultiConnector.svelte';
    import SingleConnector from './SingleConnector.svelte';
    import Dot from './common/Dot.svelte';

    let zoom: number = 1.0;
    let vectors: Vector[] = [];

    let annotations: Annotation[];
    $: annotations = $annotationsStore;

    let selectedAnnotation: Annotation | null;
    $: selectedAnnotation = $selectedAnnotationStore;

    let image: Image;
    $: image = $imageStore;

    let mode: Mode;
    $: mode = $modeStore;

    const onSelect = (annotation: Annotation) => {
        if (mode !== 'edit') return;

        vectors = [];

        if (selectedAnnotation && selectedAnnotation.id === annotation.id) {
            selectedAnnotationStore.set(null);
        } else {
            selectedAnnotationStore.set(annotation);
        }
    };

    const onClick = (event: MouseEvent) => {
        if (mode !== 'edit') return;
        if (!(event.target instanceof SVGImageElement)) return;

        const svg = event.currentTarget as SVGSVGElement;
        const { width, height, x, y } = svg.viewBox.baseVal;
        const { left, top, width: rectWidth, height: rectHeight } = svg.getBoundingClientRect();

        const svgX = ((event.clientX - left) / rectWidth) * width + x;
        const svgY = ((event.clientY - top) / rectHeight) * height + y;

        const vector = { x: Math.round(svgX / zoom), y: Math.round(svgY / zoom) };

        if (selectedAnnotation) {
            selectedAnnotationStore.update((current) => {
                if (!current) return current;

                switch (current.type) {
                    case 'multi-connector':
                        current.tips = [...current.tips, vector];
                        return current;
                    case 'area':
                        current.points = [...current.points, vector];
                        return current;
                }

                return current;
            });
        } else {
            vectors = [...vectors, vector];
        }
    };

    const onKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'Escape':
                event.preventDefault();
                selectedAnnotationStore.set(null);
                break;
            case '+':
                event.preventDefault();
                zoom *= 1.1;
                break;
            case '-':
                event.preventDefault();
                zoom *= 0.9;
                break;
            case '0':
                event.preventDefault();
                zoom = 1.0;
                break;
        }
    };

    $: visibleAnnotations = annotations.filter(
        (annotation) => mode !== 'question' || annotation.id === selectedAnnotation?.id,
    );
</script>

<div>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        style={`transform: scale(${mode === 'edit' ? zoom : 1});`}
        viewBox={getViewBox(image.dimensions)}
        on:click={onClick}
    >
        <image
            x="0"
            y="0"
            width={image.dimensions.width}
            height={image.dimensions.height}
            href={image.path}
        />
        {#each visibleAnnotations as annotation}
            {#if annotation.type === 'single-connector'}
                <SingleConnector
                    id={annotation.id}
                    label={annotation.label || '𑑛'}
                    orientation={annotation.orientation}
                    tip={annotation.tip}
                    angle={annotation.angle}
                    style={annotation.style}
                    canvasDimensions={image.dimensions}
                    on:click={() => onSelect(annotation)}
                />
            {:else if annotation.type === 'multi-connector'}
                <MultiConnector
                    id={annotation.id}
                    label={annotation.label || '𑑛'}
                    orientation={annotation.orientation}
                    tips={annotation.tips}
                    connectionPoint={annotation.connectionPoint}
                    style={annotation.style}
                    canvasDimensions={image.dimensions}
                    on:click={() => onSelect(annotation)}
                />
            {:else if annotation.type === 'brace'}
                <Brace
                    id={annotation.id}
                    label={annotation.label || '𑑛'}
                    orientation={annotation.orientation}
                    tips={annotation.tips}
                    canvasDimensions={image.dimensions}
                    on:click={() => onSelect(annotation)}
                />
            {:else if annotation.type === 'area'}
                <Area
                    id={annotation.id}
                    label={annotation.label || '𑑛'}
                    orientation={annotation.orientation}
                    points={annotation.points}
                    canvasDimensions={image.dimensions}
                    on:click={() => onSelect(annotation)}
                />
            {/if}
        {/each}
        {#each vectors as vector}
            <Dot
                canvasDimensions={image.dimensions}
                position={vector}
                fillColor="red"
                outlineColor="white"
            />
        {/each}
    </svg>
</div>

<svelte:window on:keydown={onKeyDown} />

<style>
    div {
        width: 100%;
        height: 100%;
        overflow-x: auto;
        overflow-y: auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    svg {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        transform-origin: top left;
    }
</style>
