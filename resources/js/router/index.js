import Vue from "vue";
import Router from "vue-router";

import Item from "../components/pages/item/view/Index.vue";
import Customer from "../components/pages/customer/view/Index.vue";
import Sales from "../components/pages/sales/view/Index.vue";

Vue.use(Router);

const routes = [
    {
        path: "/item",
        name: "item",
        component: Item,
        meta: { title: "Item" }
    },
    {
        path: "/customer",
        name: "customer",
        component: Customer,
        meta: { title: "Customer" }
    },
    {
        path: "/sales",
        name: "sales",
        component: Sales,
        meta: { title: "Sales" }
    }
];

const router = new Router({
    mode: "history",
    linkActiveClass: "active",
    routes
});

export default router;
