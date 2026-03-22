// eslint-disable-next-line import/no-unresolved
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
    preprocess: vitePreprocess(),
    onwarn: (warning, handler) => {
        const { code, message } = warning;

        if (code === 'a11y-click-events-have-key-events') {
          return;
        }
        if (code === 'a11y-no-static-element-interactions') {
            return;
          }

        handler(warning);
      },

};
