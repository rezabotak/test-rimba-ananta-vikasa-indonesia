import $axios from "../../../plugins/axios";

function defaultForm() {
    return {
        nama: "",
        contact: "",
        email: "",
        alamat: "",
        diskon: "",
        tipe_diskon: "",
        ktp: null
    };
}

const state = () => ({
    collection: [],
    collectionList: [],

    form: defaultForm(),

    isBusy: false,

    diskonList: [
        {
            value: 0,
            text: "Persentase"
        },
        {
            value: 1,
            text: "Fix Diskon"
        }
    ],
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
    ASSIGN_LIST(state, payload) {
        state.collectionList = payload;
    },
    ASSIGN_FORM(state, payload) {
        state.form = { ...payload };
        state.form.ktp = null;
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
                .get("/customers", { params })
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
    loadList({ commit }) {
        return new Promise((resolve, reject) => {
            $axios
                .get("/customers/load-list")
                .then(response => {
                    commit("ASSIGN_LIST", response.data);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    store({ dispatch, commit, state }, payload) {
        return new Promise((resolve, reject) => {
            $axios
                .post("/customers", payload, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
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
    },
    update({ state, commit, dispatch }, payload) {
        return new Promise((resolve, reject) => {
            $axios
                .post(`/customers/${payload.id}`, payload.data, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then(response => {
                    commit("CLEAR_FORM");
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
    },
    destroy({ dispatch, state }, payload) {
        return new Promise((resolve, reject) => {
            $axios.delete(`/customers/${payload}`).then(response => {
                dispatch("load", state.tableParams).then(() => resolve());
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
