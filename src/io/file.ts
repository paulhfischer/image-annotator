import { App, FrontMatterCache, TFile, parseFrontMatterEntry } from 'obsidian';

const getFrontMatter = (file: TFile, app: App): FrontMatterCache => {
    const metaData = app.metadataCache.getFileCache(file);
    if (!metaData) throw new Error('could not find metadata!');

    const frontMatter = metaData.frontmatter;
    if (!frontMatter) throw new Error('could not find frontmatter!');

    return frontMatter;
};

export const readImage = (file: TFile, app: App): string => {
    const frontMatter = getFrontMatter(file, app);

    const value = parseFrontMatterEntry(frontMatter, 'image-annotator-source');
    if (value === null) throw new Error('could not parse frontmatter!');

    return value.toString().trim();
};

export const readAnnotations = async (file: TFile): Promise<string> => {
    const content = await file.vault.cachedRead(file);

    const regex = /# Annotations\n([^#]*)/s.exec(content);
    if (!regex) throw new Error('could not parse annotations!');

    return regex[1].trim();
};

export const writeAnnotations = (value: string, file: TFile): void => {
    file.vault.process(file, (data) => {
        return data.replace(/# Annotations\n([^#]*)/s, `# Annotations\n${value.trim()}\n\n`);
    });
};
