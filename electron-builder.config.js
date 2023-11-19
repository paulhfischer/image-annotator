/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
    appId: 'com.image-annotator.app',
    productName: 'Image Annotator',
    directories: {
        output: 'release',
        buildResources: 'build',
    },
    files: ['dist-main/index.js', 'dist-preload/index.js', 'dist-renderer/**/*'],
    extraMetadata: {
        version: process.env.VITE_APP_VERSION,
    },
    mac: {
        hardenedRuntime: true,
        gatekeeperAssess: false,
        target: [
            {
                target: 'dmg',
                arch: 'universal',
            },
            {
                target: 'zip',
                arch: 'universal',
            },
        ],
    },
    win: {
        target: [
            {
                target: 'msi',
            },
            {
                target: 'nsis',
            },
            {
                target: 'zip',
            },
        ],
    },
    linux: {
        category: 'Utility',
        target: [
            {
                target: 'AppImage',
            },
            {
                target: 'deb',
            },
            {
                target: 'zip',
            },
        ],
    },
};

module.exports = config;
