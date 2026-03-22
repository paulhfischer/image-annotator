<script lang="ts">
    import { annotationsStore, imageStore, selectedAnnotationStore } from '../stores';
    import { type Annotation, type Image } from '../utils/data';

    let selectedAnnotation: Annotation | null;
    $: selectedAnnotation = $selectedAnnotationStore;

    let image: Image;
    $: image = $imageStore;

    const onDeleteAnnotation = () => {
        if (selectedAnnotation) {
            annotationsStore.update((annotations) =>
                annotations.filter((annotation) => annotation.id !== selectedAnnotation!.id),
            );
            selectedAnnotationStore.set(null);
        }
    };

    $: {
        if (selectedAnnotation) {
            selectedAnnotationStore.update((current) => {
                if (current && current.id === selectedAnnotation.id) {
                    annotationsStore.update((annotations) =>
                        annotations.map((annotation) =>
                            annotation.id === current.id ? current : annotation,
                        ),
                    );
                }
                return current;
            });
        }
    }

    $: {
        if (selectedAnnotation) {
            switch (selectedAnnotation.type) {
                case 'multi-connector':
                    selectedAnnotation.tips = selectedAnnotation.tips.filter(
                        ({ x, y }) => x !== null || y !== null,
                    );
                    break;
                case 'area':
                    selectedAnnotation.points = selectedAnnotation.points.filter(
                        ({ x, y }) => (x !== 0 && x !== null) || (y !== 0 && y !== null),
                    );
                    break;
            }
        }
    }
</script>

<div>
    {#if selectedAnnotation}
        <label>
            Label
            <textarea rows={3} bind:value={selectedAnnotation.label} style="resize: vertical;"
            ></textarea>
        </label>

        <label>
            Orientation
            <select bind:value={selectedAnnotation.orientation}>
                <option value="top">Top</option>
                <option value="right">Right</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
            </select>
        </label>

        {#if selectedAnnotation.type === 'single-connector'}
            <label>
                Angle
                <input
                    type="number"
                    step={15}
                    min={0}
                    max={359}
                    bind:value={selectedAnnotation.angle}
                    on:wheel|nonpassive
                />
            </label>

            <label>
                Style
                <select bind:value={selectedAnnotation.style}>
                    <option value="dot">Dot</option>
                    <option value="arrow">Arrow</option>
                </select>
            </label>

            <label>
                Tip
                <div class="input-group">
                    <input
                        type="number"
                        min={0}
                        max={image.dimensions.width}
                        bind:value={selectedAnnotation.tip.x}
                        on:wheel|nonpassive
                    />
                    <input
                        type="number"
                        min={0}
                        max={image.dimensions.height}
                        bind:value={selectedAnnotation.tip.y}
                        on:wheel|nonpassive
                    />
                </div>
            </label>
        {:else if selectedAnnotation.type === 'multi-connector'}
            <label>
                Style
                <select bind:value={selectedAnnotation.style}>
                    <option value="dot">Dot</option>
                    <option value="arrow">Arrow</option>
                </select>
            </label>

            <label>
                Connection Point
                <div class="input-group">
                    <input
                        type="number"
                        min={0}
                        max={image.dimensions.width}
                        bind:value={selectedAnnotation.connectionPoint.x}
                        on:wheel|nonpassive
                    />
                    <input
                        type="number"
                        min={0}
                        max={image.dimensions.height}
                        bind:value={selectedAnnotation.connectionPoint.y}
                        on:wheel|nonpassive
                    />
                </div>
            </label>

            <label>
                Tips
                {#each selectedAnnotation.tips as tip}
                    <div class="input-group">
                        <input
                            type="number"
                            min={0}
                            max={image.dimensions.width}
                            bind:value={tip.x}
                            on:wheel|nonpassive
                        />
                        <input
                            type="number"
                            min={0}
                            max={image.dimensions.height}
                            bind:value={tip.y}
                            on:wheel|nonpassive
                        />
                    </div>
                {/each}
            </label>
        {:else if selectedAnnotation.type === 'brace'}
            <label>
                Tips
                {#each selectedAnnotation.tips as tip}
                    <div class="input-group">
                        <input
                            type="number"
                            min={0}
                            max={image.dimensions.width}
                            bind:value={tip.x}
                            on:wheel|nonpassive
                        />
                        <input
                            type="number"
                            min={0}
                            max={image.dimensions.height}
                            bind:value={tip.y}
                            on:wheel|nonpassive
                        />
                    </div>
                {/each}
            </label>
        {:else if selectedAnnotation.type === 'area'}
            <label>
                Points
                {#each selectedAnnotation.points as point}
                    <div class="input-group">
                        <input
                            type="number"
                            min={0}
                            max={image.dimensions.width}
                            bind:value={point.x}
                            on:wheel|nonpassive
                        />
                        <input
                            type="number"
                            min={0}
                            max={image.dimensions.height}
                            bind:value={point.y}
                            on:wheel|nonpassive
                        />
                    </div>
                {/each}
            </label>
        {/if}

        <button on:click={onDeleteAnnotation}>Delete</button>
    {:else}
        <p>No annotation selected</p>
    {/if}
</div>

<style>
    div {
        width: 300px;
    }

    p {
        width: 300px;
    }

    label {
        display: block;
        margin-bottom: 5px;
    }

    input,
    select,
    textarea,
    button {
        box-sizing: border-box;
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        transition: border-color 0.3s;
        margin-bottom: 5px;
    }

    input:focus,
    select:focus,
    textarea:focus,
    button:focus {
        border-color: #666;
        outline: none;
    }

    button {
        cursor: pointer;
    }

    .input-group {
        display: flex;
        gap: 10px;
    }

    .input-group input {
        flex: 1;
    }
</style>
