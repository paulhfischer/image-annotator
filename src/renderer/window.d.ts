import type { ContextBridge } from '@common/ContextBridge';

// eslint-disable-next-line import/prefer-default-export
export declare global {
    interface Window {
        ContextBridge: ContextBridge;
    }
}
