import { runDB } from './utils';

const createDB = async (): Promise<void> => {
    await runDB(`
        CREATE TABLE IF NOT EXISTS images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uid TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            clean_content TEXT NOT NULL,
            annotated_content TEXT NULL,
            annotation_size TEXT NOT NULL,
            width INTEGER NOT NULL,
            height INTEGER NOT NULL
        )
    `);

    await runDB(`
        CREATE TABLE IF NOT EXISTS annotations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uid TEXT NOT NULL UNIQUE,
            type TEXT NOT NULL,
            label TEXT NOT NULL,
            label_position TEXT NOT NULL,
            image INTEGER NOT NULL,
            special_node INTEGER NULL,
            permanent BOOLEAN NOT NULL
        )
    `);

    await runDB(`
        CREATE TABLE IF NOT EXISTS nodes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            annotation INTEGER NOT NULL,
            x INTEGER NOT NULL,
            y INTEGER NOT NULL
        )
    `);
};

export default createDB;
