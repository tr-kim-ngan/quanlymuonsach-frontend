import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// Import Bootstrap CSS và JavaScript
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import Font Awesome (nếu cần dùng các icon)
import '@fortawesome/fontawesome-free/css/all.min.css';

const app = createApp(App);
app.use(router);
app.mount('#app');
