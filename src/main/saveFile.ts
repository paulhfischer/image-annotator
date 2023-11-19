import { dialog } from 'electron';
import { writeFileSync } from 'fs';
import { join } from 'path';

const saveFile = async (
    data: { content: string; filename: string } | { content: string; filename: string }[],
): Promise<void> => {
    if (Array.isArray(data)) {
        const { filePaths, canceled } = await dialog.showOpenDialog({
            properties: ['openDirectory'],
        });

        if (canceled) {
            return;
        }

        const folderPath = filePaths[0];

        data.forEach(({ content, filename }) => {
            writeFileSync(join(folderPath, filename), content);
        });
    } else {
        const { content, filename } = data;

        const { filePath, canceled } = await dialog.showSaveDialog({
            title: 'Save File',
            defaultPath: filename,
        });

        if (canceled) {
            return;
        }

        writeFileSync(filePath, content);
    }
};

export default saveFile;
