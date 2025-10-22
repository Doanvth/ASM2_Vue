import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const app = createApp(App);

app.use(router);
//Gắn Bootstrap vào global
app.config.globalProperties.$bootstrap = bootstrap;

app.mount("#app");
