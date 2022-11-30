import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './components/App.vue';
import * as FormKitVue from '@formkit/vue'
import {GM} from '$';
import './sentry';

const selectors = '.splitcontent:last-child .splitcontentleft:last-child';
const container = document.querySelector(selectors);

if (container) {
    createApp(App)
        .use(createPinia())
        .use(FormKitVue.plugin, FormKitVue.defaultConfig({theme: 'genesis'}))
        .mount(GM.addElement(container, 'div'));
} else {
    throw new Error(`Missing "${selectors}"`)
}



