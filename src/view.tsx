import { FluentProvider, webDarkTheme } from '@fluentui/react-components';
import { ItemView } from 'obsidian';
import React, { StrictMode } from 'react';
import { Root, createRoot } from 'react-dom/client';
import ImageAnnotator from './components';
import { getAnnotations, getImage, setAnnotations } from './io';

export const VIEW_TYPE_IMAGE_ANNOTATOR = 'image-annotator';

export class ObsidianImageAnnotatorView extends ItemView {
    root: Root | null = null;

    // eslint-disable-next-line class-methods-use-this
    getViewType(): string {
        return VIEW_TYPE_IMAGE_ANNOTATOR;
    }

    // eslint-disable-next-line class-methods-use-this
    getDisplayText(): string {
        return 'Image Annotator';
    }

    // eslint-disable-next-line class-methods-use-this
    getIcon(): string {
        return 'image';
    }

    async onOpen() {
        this.render();

        this.registerEvent(this.app.workspace.on('active-leaf-change', () => this.render()));
    }

    async onClose() {
        this.root?.unmount();
    }

    async render() {
        if (!this.root) {
            this.root = createRoot(this.containerEl.children[1]);
        }

        const file = this.app.workspace.getActiveFile();

        if (!file) {
            this.root.render(<div>open a file to use image annotator</div>);
        } else {
            this.root.render(
                <StrictMode>
                    <FluentProvider
                        theme={webDarkTheme}
                        style={{ height: '100%', minWidth: '100%', background: 'none' }}
                    >
                        <ImageAnnotator
                            image={await getImage(file, this.app)}
                            readAnnotations={async () => getAnnotations(file)}
                            writeAnnotations={(annotations) => setAnnotations(annotations, file)}
                        />
                    </FluentProvider>
                </StrictMode>,
            );
        }
    }
}
