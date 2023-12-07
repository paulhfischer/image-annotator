import { join } from 'path';
import { Database, RunResult } from 'sqlite3';

export const runDB = (sql: string, params?: any[], path?: string): Promise<RunResult> => {
    return new Promise((resolve, reject) => {
        const db = new Database(path || join(__dirname, '..', 'app.db'), (connectionError) => {
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

export const queryDB = <T>(sql: string, params?: any[], path?: string): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        const db = new Database(path || join(__dirname, '..', 'app.db'), (connectionError) => {
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
