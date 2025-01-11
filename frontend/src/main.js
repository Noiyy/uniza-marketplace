import { createApp } from 'vue'
import MainApp from './MainApp.vue'

import 'bootstrap/dist/css/bootstrap.css';
import "vue-toastification/dist/index.css"

import router from './routers/MainRouter'
import globals from './globals';
import store from './store/store';
import mitt from 'mitt';
import axios from 'axios';
import Toast from 'vue-toastification';

import { createI18n } from 'vue-i18n';
import { i18nOptions } from './localization';
import { createHead, VueHeadMixin } from '@unhead/vue';

const head = createHead();
const isDev = true;

const axiosInstance = axios.create({
    baseURL: isDev ? "http://localhost:4000/" : "https://uniza-marketplace.sk/",
    headers: {
        'Content-Type': 'application/json',
    },
});

const emitter = mitt();
const app = createApp(MainApp);
Object.assign(app.config.globalProperties, globals);

const routerObj = router(app.config.globalProperties.BASE_PATH, emitter);

const toastOptions = {
    transition: "Vue-Toastification__slideBlurred",
    draggable: false,
    position: 'bottom-center'
}

const i18n = createI18n(i18nOptions);

app.use(i18n);
app.use(store);
app.use(routerObj);
app.use(Toast, toastOptions);
app.use(head);

app.mixin(VueHeadMixin);

app.provide("axios", axiosInstance);
app.provide("emitter", emitter);

app.config.globalProperties.$isDev = isDev;
app.config.globalProperties.$isAdmin = null;
emitter.on('update-isAdmin', (flag) => app.config.globalProperties.$isAdmin = flag);

if (isDev) {
    app.config.devtools = true;
}
   
app.mount('#app');