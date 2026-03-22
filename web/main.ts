import App from './App.svelte';
import { setStores } from './stores';

let app: App | null = null;

window.loadApp = (
    annotations: string,
    image: string,
    mode: Mode,
    selectedAnnotation: number | null = null,
) => {
    setStores(annotations, image, mode, selectedAnnotation);

    if (!app) {
        app = new App({
            target: document.getElementById('image-annotator')!,
        });
    }
};

window.killApp = () => {
    if (app) {
        app.$destroy();
        app = null;
    }
};

/* ===== DEBUG CODE ===== */
window.loadApp(
    `
        {{c1::image-annotation:single-connector:label=SingleConnector:orientation=right:tip=850,230:angle=45:style=arrow}}
        {{c2::image-annotation:multi-connector:label=MultiConnector:orientation=left:tips=231,722 415,921 589,752:connection-point=150,800:style=dot}}
        {{c3::image-annotation:area:label=Area:orientation=left:points=50,50 231,222 415,621 589,312}}
        {{c4::image-annotation:brace:label=Brace:orientation=right:tips=900,900 900,750}}
    `,
    `<img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/1000x1000Pixel_mit_Gitter.png">`,
    `edit`,
    2,
);
/* ===== DEBUG CODE ===== */
