import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, {cdn, util} from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        monkey({
            entry: 'src/main.ts',
            userscript: {
                namespace: 'gander.dev/monkey',
                homepageURL: 'https://github.com/gander/monkey-redmine-time-widget',
                include: [
                    /\/issues\/\d+/,
                ],
                exclude: [
                    /\/issues\/\d+[.\/]/,
                ],
            },
            build: {
                fileName: 'monkey-redmine-time-widget.user.js',
                externalGlobals: {
                    '@sentry/browser': [
                        'Sentry',
                        (version: string) => `https://browser.sentry-cdn.com/${version}/bundle.min.js`,
                    ],
                    'vue': cdn
                        .jsdelivr('Vue', 'dist/vue.global.prod.js')
                        .concat(
                            await util.fn2dataUrl(() => {
                                // @ts-ignore
                                window.Vue = Vue;
                            }),
                        ),
                    '@vueuse/core': [
                        'VueUse',
                        (version: string) => `https://cdn.jsdelivr.net/npm/@vueuse/shared@${version}/index.iife.min.js`,
                        (version: string) => `https://cdn.jsdelivr.net/npm/@vueuse/core@${version}/index.iife.min.js`,
                        await util.fn2dataUrl(() => {
                            // @ts-ignore
                            window.VueUse = VueUse;
                        }),
                    ],
                    '@formkit/vue': cdn.jsdelivr('FormKitVue', 'dist/formkit-vue.js'),
                    'pinia': [
                        'Pinia',
                        `https://cdn.jsdelivr.net/npm/vue-demi@latest/lib/index.iife.js`,
                        (version: string) => `https://cdn.jsdelivr.net/npm/pinia@${version}/dist/pinia.iife.js`,
                    ],
                    'lodash': cdn.jsdelivr('_', 'lodash.min.js'),
                },
            },
        }),
    ],
});
