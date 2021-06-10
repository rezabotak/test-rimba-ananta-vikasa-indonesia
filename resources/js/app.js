require("./bootstrap");

window.Vue = require("vue").default;
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import VueRouter from "vue-router";

import router from "./router";
import store from "./store";

import IndexComponent from "./components/layouts/Index.vue";

Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

const app = new Vue({
    render: h => h(IndexComponent),
    router,
    store
}).$mount("#app");
