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
                include: [
                    /\/issues\/\d+/,
                ],
                exclude: [
                    /\/issues\/\d+[.\/]/,
                ],
            },
            build: {
                fileName: 'redmine-dev-sum.user.js',
                externalGlobals: {
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
                    'pinia': cdn.jsdelivr('Pinia', 'dist/pinia.iife.prod.js'),
                    'lodash': cdn.jsdelivr('_', 'lodash.min.js'),
                },
            },
        }),
    ],
});
