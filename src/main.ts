import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './components/App.vue';
import PrimeVue from 'primevue/config';
import {GM} from '$';

import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primevue/resources/primevue.min.css";

const container = document.querySelector('.attributes');

if (container) {
    createApp(App)
        .use(createPinia())
        .use(PrimeVue)
        .mount(GM.addElement(container, 'div'));
}



