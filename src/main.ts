import {createApp} from 'vue';
import App from './App.vue';
import {GM} from '$';

const container = document.querySelector('.spent-time .value');

if (container) {
    GM.getValue('API_KEY', '')
        .then((api_key: string) => {
            if (api_key.length === 0) throw new Error('Missing API KEY');
            return api_key;
        })
        .then((api_key: string) => {
            createApp(App)
                .provide('api_key', api_key)
                .mount(GM.addElement(container, 'div'));
        })
        .catch((reason) => console.error(reason));
}



