import react from '@vitejs/plugin-react';
import { rmSync } from 'fs';
import { join, resolve as pathResolve } from 'path';
import { defineConfig, type AliasOptions } from 'vite';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import pkg from './package.json';

export default defineConfig(({ command }) => {
    rmSync('dist-main', { recursive: true, force: true });
    rmSync('dist-preload', { recursive: true, force: true });

    const isServe = command === 'serve';
    const isBuild = command === 'build';
    const sourcemap = isServe;

    const resolve: { alias: AliasOptions } = {
        alias: {
            '@common': join(__dirname, 'src', 'common'),
        },
    };

    return {
        root: 'src/renderer',
        build: {
            outDir: pathResolve(__dirname, '../../dist-renderer'),
            chunkSizeWarningLimit: 1000,
            emptyOutDir: true,
        },
        resolve,
        plugins: [
            react(),
            electron([
                {
                    entry: pathResolve(__dirname, 'src/main/index.ts'),
                    onstart(options) {
                        options.startup();
                    },
                    vite: {
                        resolve,
                        build: {
                            sourcemap,
                            minify: isBuild,
                            outDir: pathResolve(__dirname, 'dist-main'),
                            rollupOptions: {
                                external: Object.keys(
                                    'dependencies' in pkg ? pkg.dependencies : {},
                                ),
                            },
                        },
                    },
                },
                {
                    entry: pathResolve(__dirname, 'src/preload/index.ts'),
                    onstart(options) {
                        options.reload();
                    },
                    vite: {
                        resolve,
                        build: {
                            sourcemap: sourcemap ? 'inline' : undefined,
                            minify: isBuild,
                            outDir: pathResolve(__dirname, 'dist-preload'),
                            rollupOptions: {
                                external: Object.keys(
                                    'dependencies' in pkg ? pkg.dependencies : {},
                                ),
                            },
                        },
                    },
                },
            ]),
            renderer(),
        ],
        server: (() => ({
            host: '127.0.0.1',
            port: 7777,
        }))(),
        clearScreen: false,
    };
});
