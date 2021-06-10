import $axios from "../../../plugins/axios";

function defaultForm() {
    return {
        code_transaksi: "",
        tanggal_transaksi: "",
        customer_id: "",
        total_diskon: "",
        total_harga: "",
        total_bayar: "",
        sale_items: []
    };
}

const state = () => ({
    collection: [],
    form: defaultForm(),

    isBusy: false,
    tableParams: {
        page: 1,
        per_page: 10,
        order_column: "updated_at",
        order_direction: true,
        pageOptions: [
            { text: 10, value: 10 },
            { text: 20, value: 20 },
            { text: 50, value: 50 },
            { text: 100, value: 100 }
        ]
    }
});

const mutations = {
    ASSIGN_DATA(state, payload) {
        state.collection = payload;
    },
    ASSIGN_FORM(state, payload) {
        state.form = { ...payload };
    },
    SET_TABLE_PARAMS(state, payload) {
        state.tableParams = payload;
    },
    SET_BUSY(state, payload) {
        state.isBusy = payload;
    },
    CLEAR_FORM(state) {
        state.form = defaultForm();
    }
};

const actions = {
    load({ commit }, params) {
        return new Promise((resolve, reject) => {
            $axios
                .get("/sales", { params })
                .then(response => {
                    commit("ASSIGN_DATA", response.data);
                    commit("SET_BUSY", false);
                    resolve(response);
                })
                .catch(error => {
                    commit("SET_BUSY", false);
                    reject(error);
                });
        });
    },
    store({ dispatch, commit, state }) {
        return new Promise((resolve, reject) => {
            $axios
                .post("/sales", state.form)
                .then(response => {
                    dispatch("load", state.tableParams).then(() => {
                        resolve(response.data);
                    });
                })
                .catch(error => {
                    if (error.response.status == 422) {
                        commit("SET_ERRORS", error.response.data.errors, {
                            root: true
                        });
                    }
                    reject(error.response);
                });
        });
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
