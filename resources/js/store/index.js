import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import customer from "../components/pages/customer/state";
import item from "../components/pages/item/state";
import sales from "../components/pages/sales/state";

const store = new Vuex.Store({
    modules: {
        customer,
        item,
        sales
    },
    state: {
        errors: []
    },
    mutations: {
        SET_ERRORS(state, payload) {
            state.errors = payload;
        },
        CLEAR_ERRORS(state) {
            state.errors = [];
        }
    }
});

export default store;
