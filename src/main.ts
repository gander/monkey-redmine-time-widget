import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './components/App.vue';
import * as FormKitVue from '@formkit/vue'
import {GM} from '$';

const container = document.querySelector('.attributes');

if (container) {
    createApp(App)
        .use(createPinia())
        .use(FormKitVue.plugin, FormKitVue.defaultConfig({theme: 'genesis'}))
        .mount(GM.addElement(container, 'div'));
}



