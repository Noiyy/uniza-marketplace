import { createApp } from 'vue'
import MainApp from './MainApp.vue'

import 'bootstrap/dist/css/bootstrap.css';
import "vue-toastification/dist/index.css";
import './assets/css/globalStyle.css';

import router from './routers/MainRouter'
import globals from './globals';
import store from './store/store';
import mitt from 'mitt';
import axios from 'axios';
import Toast, { useToast } from 'vue-toastification';

import { createI18n } from 'vue-i18n';
import { i18nOptions } from './localization';
import { globalMixin } from './mixins/globalMixin'; 
import { createHead, VueHeadMixin } from '@unhead/vue';

import UserService from './services/userService';
import FeedbackService from './services/feedbackService';
import ProductService from './services/productService';
import MiscService from './services/miscService';

const head = createHead();
const isDev = process.env.NODE_ENV && process.env.NODE_ENV.trim() === "development";

const axiosInstance = axios.create({
    baseURL: isDev ? "http://localhost:4000/" : "https://uniza-marketplace.sk/",
    headers: {
        'Content-Type': 'application/json',
    },
});

const emitter = mitt();
const app = createApp(MainApp);
Object.assign(app.config.globalProperties, globals);

const routerObj = router(emitter, isDev, axiosInstance);

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

app.mixin(globalMixin);
app.mixin(VueHeadMixin);

app.provide("axios", axiosInstance);
app.provide("userApi", new UserService(isDev, "api"));
app.provide("feedbackApi", new FeedbackService(isDev, "api/feedback"));
app.provide("productApi", new ProductService(isDev, "api/product"));
app.provide("miscApi", new MiscService(isDev, "api/misc"));
app.provide("emitter", emitter);

const toastInstance = useToast();

app.config.globalProperties.$isDev = isDev;
app.config.globalProperties.$isAdmin = null;
app.config.globalProperties.$toast = toastInstance;
emitter.on('update-isAdmin', (flag) => app.config.globalProperties.$isAdmin = flag);

if (isDev) {
    app.config.devtools = true;
}
   
app.mount('#app');