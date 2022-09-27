import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, {cdn} from 'vite-plugin-monkey';

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
                    vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
                    lodash: cdn.jsdelivr('_', 'lodash.min.js'),
                },
            },
        }),
    ],
});
