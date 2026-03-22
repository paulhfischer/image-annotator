import { App, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';
import { ObsidianImageAnnotatorView, VIEW_TYPE_IMAGE_ANNOTATOR } from './view';

interface PluginSettings {
    annotationSize: number;
}

const DEFAULT_SETTINGS: PluginSettings = {
    annotationSize: 0.3,
};

class SettingsTab extends PluginSettingTab {
    plugin: ImageAnnotator;

    constructor(app: App, plugin: ImageAnnotator) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Annotation Size')
            .setDesc('percentage of image size')
            .addSlider((slider) =>
                slider
                    .setDynamicTooltip()
                    .setLimits(0, 0.5, 0.01)
                    .setValue(this.plugin.settings.annotationSize)
                    .onChange(async (value) => {
                        this.plugin.settings.annotationSize = value;
                        await this.plugin.saveSettings();
                    }),
            );
    }
}

export default class ImageAnnotator extends Plugin {
    settings: PluginSettings;

    async onload() {
        await this.loadSettings();

        this.addSettingTab(new SettingsTab(this.app, this));

        this.registerView(
            VIEW_TYPE_IMAGE_ANNOTATOR,
            (leaf) => new ObsidianImageAnnotatorView(leaf),
        );

        this.addRibbonIcon('image', 'Open Image Annotator', () => {
            this.openImageAnnotator();
        });
    }

    async loadSettings() {
        this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) };
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async openImageAnnotator() {
        let leaf: WorkspaceLeaf | null = null;
        const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_IMAGE_ANNOTATOR);

        if (leaves.length > 0) {
            [leaf] = leaves;
        } else {
            leaf = this.app.workspace.getRightLeaf(false);
            await leaf.setViewState({
                type: VIEW_TYPE_IMAGE_ANNOTATOR,
                active: true,
            });
        }

        this.app.workspace.revealLeaf(leaf);
    }
}
