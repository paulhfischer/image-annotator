type Mode = 'edit' | 'question' | 'answer';

interface Window {
    loadApp: (
        annotations: string,
        image: string,
        mode: Mode,
        selectedAnnotation: number | null,
    ) => void;
    killApp: () => void;
}
