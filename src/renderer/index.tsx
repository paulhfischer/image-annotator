import { FluentProvider, webDarkTheme } from '@fluentui/react-components';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './Components/App';
import { AppContextProvider } from './Context';

document.addEventListener('DOMContentLoaded', () => {
    createRoot(document.getElementById('app') as HTMLDivElement).render(
        <StrictMode>
            <FluentProvider theme={webDarkTheme} style={{ height: '100vh', minWidth: '700px' }}>
                <AppContextProvider>
                    <App />
                </AppContextProvider>
            </FluentProvider>
        </StrictMode>,
    );
});
