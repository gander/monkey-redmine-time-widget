import {createApp} from 'vue';
import App from './App.vue';
import {GM} from '$';

const container = document.querySelector('.spent-time .value');

if (container) {
    GM.getValue('API_KEY', '')
        .then(async (api_key: string) => {
            if (!api_key) {
                const new_api_key = prompt('Redmine DevSum API KEY');

                if (!new_api_key) {
                    throw new Error('Missing API KEY');
                } else {
                    api_key = new_api_key;
                    await GM.setValue('API_KEY', new_api_key);
                }
            }

            return api_key;
        })
        .then((api_key: string) => {
            createApp(App)
                .provide('api_key', api_key)
                .mount(GM.addElement(container, 'div'));
        })
        .catch((reason) => console.error(reason));
}



