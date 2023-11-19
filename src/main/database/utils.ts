import { app } from 'electron';
import { join } from 'path';
import { Database, RunResult } from 'sqlite3';

const databasePath = app.isPackaged
    ? join(app.getPath('userData'), 'database.db')
    : join(__dirname, '..', 'app.db');

export const runDB = (sql: string, params?: any[]): Promise<RunResult> => {
    return new Promise((resolve, reject) => {
        const db = new Database(databasePath, (connectionError) => {
            if (connectionError) {
                reject(connectionError);
            }

            db.run(sql, params, function callback(runError) {
                if (runError) {
                    reject(runError);
                }

                resolve(this);
            });
        });
    });
};

export const queryDB = <T>(sql: string, params?: any[]): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        const db = new Database(databasePath, (connectionError) => {
            if (connectionError) {
                reject(connectionError);
            }

            db.all(sql, params, (runError, rows) => {
                if (runError) {
                    reject(runError);
                }

                resolve(rows as T[]);
            });
        });
    });
};
