import { runDB } from './utils';

const createDB = async (): Promise<void> => {
    await runDB(`
        CREATE TABLE IF NOT EXISTS images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uid TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            content TEXT NOT NULL,
            width INTEGER NOT NULL,
            height INTEGER NOT NULL,
            group TEXT NOT NULL
        );
    `);

    await runDB(`
        CREATE TABLE IF NOT EXISTS annotations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_id TEXT NOT NULL,
            annotation_type TEXT NOT NULL,
            text TEXT NOT NULL,
            disabled INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY(image_id) REFERENCES images(id)
        );
    `);

    await runDB(`
        CREATE TABLE IF NOT EXISTS brace_annotations (
            id INTEGER PRIMARY KEY,
            annotation_id INTEGER,
            tips TEXT NOT NULL,
            FOREIGN KEY(annotation_id) REFERENCES annotations(id)
        );
    `);

    await runDB(`
        CREATE TABLE IF NOT EXISTS single_connector_annotations (
            id INTEGER PRIMARY KEY,
            annotation_id INTEGER,
            tip TEXT NOT NULL,
            angle REAL NOT NULL,
            style TEXT NOT NULL CHECK (style IN ('arrow', 'circle')),
            FOREIGN KEY(annotation_id) REFERENCES annotations(id)
        );
    `);

    await runDB(`
        CREATE TABLE IF NOT EXISTS multi_connector_annotations (
            id INTEGER PRIMARY KEY,
            annotation_id INTEGER,
            tips TEXT NOT NULL,
            connection TEXT NOT NULL,
            style TEXT NOT NULL CHECK (style IN ('arrow', 'circle')),
            FOREIGN KEY(annotation_id) REFERENCES annotations(id)
        );
    `);
};

export default createDB;
