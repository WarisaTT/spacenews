import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // นำเข้า router

const app = createApp(App);

app.use(router); // ใช้งาน router
app.mount('#app');