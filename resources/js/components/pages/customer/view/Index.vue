<template>
    <div>
        <div class="card">
            <div class="card-body">
                <b-row class="mt-2 mb-2">
                    <b-col col lg="4">
                        <input type="text" class="form-control" placeholder="Search" v-model="keyword" />
                    </b-col>
                    <b-col>
                        <div class="float-right">
                            <b-button @click="showModal()" class="btn btn-success ml-2"><b-icon icon="plus"></b-icon> Create</b-button>
                        </div>
                    </b-col>
                </b-row>
                <b-table
                    responsive="sm"
                    striped
                    hover
                    bordered
                    :sort-by.sync="tableParams.order_column"
                    :sort-desc.sync="tableParams.order_direction"
                    :busy.sync="isBusy"
                    :items="collection.data"
                    :fields="fields"
                    show-empty
                >
                    <template v-slot:cell(index)="row">
                        {{ tableParams.page !== 1 ? row.index + 1 + tableParams.per_page * (tableParams.page - 1) : row.index + 1 }}
                    </template>

                    <template v-slot:cell(tipe_diskon)="row">
                        {{ tipeDiskon(row.item.tipe_diskon) }}
                    </template>

                    <template v-slot:cell(ktp)="row">
                        <img :src="row.item.ktp" width="80px" />
                    </template>

                    <template v-slot:cell(actions)="row">
                        <a href="javascript:void(0)" @click="edit(row.item)" class="text-primary" v-b-tooltip.hover title="update">
                            <b-icon icon="pencil-square"></b-icon>
                        </a>
                        <a href="javascript:void(0)" @click="remove(row.item.id)" class="text-danger" v-b-tooltip.hover title="delete">
                            <b-icon icon="trash"></b-icon>
                        </a>
                    </template>
                </b-table>
            </div>
            <div class="card-footer">
                <b-row>
                    <b-col lg="2">
                        <b-form-select v-model="tableParams.per_page" :options="tableParams.pageOptions"></b-form-select>
                    </b-col>
                    <b-col lg="7" class="text-center">
                        <p>
                            Showing data from {{ (collection.meta || {}).from }} to {{ (collection.meta || {}).to }} of total
                            {{ (collection.meta || {}).total }} entries
                        </p>
                    </b-col>
                    <b-col>
                        <b-pagination
                            v-model="tableParams.page"
                            pills
                            :total-rows="collection.meta.total"
                            :per-page="collection.meta.per_page"
                            v-if="collection.data && collection.data.length > 0"
                            class="float-lg-right d-flex justify-content-center"
                        ></b-pagination>
                    </b-col>
                </b-row>
            </div>
            <b-modal id="modal-form" :title="modalTitle" no-close-on-esc no-close-on-backdrop>
                <form-component></form-component>
                <template v-slot:modal-footer>
                    <b-button class="btn btn-danger ml-2" @click="hideModal()"> Cancel </b-button>
                    <button class="btn btn-primary" @click.prevent="submit" :disabled="loadingProcess">
                        <b-spinner v-if="loadingProcess" small class="mr-2"></b-spinner>
                        Save
                    </button>
                </template>
            </b-modal>
        </div>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from "vuex";
import formComponent from "./Form";
export default {
    components: {
        formComponent,
    },
    data() {
        return {
            modalTitle: "Create",
            keyword: "",
            loadingProcess: false,
            modelId: null,
            fields: [
                {
                    key: "index",
                    label: "#",
                    thStyle: "text-align: center; width: 35px;",
                    thClass: "align-middle text-center",
                    tdClass: "align-middle text-center",
                },
                { key: "nama", label: "Nama", sortable: true, thClass: "align-middle text-center", tdClass: "align-middle text-center" },
                { key: "contact", label: "Contact", thClass: "align-middle text-center", tdClass: "align-middle text-center" },
                { key: "email", label: "Email", thClass: "align-middle text-center", tdClass: "align-middle text-center" },
                { key: "alamat", label: "Alamat", thClass: "align-middle text-center", tdClass: "align-middle text-center" },
                { key: "diskon", label: "Diskon", thClass: "align-middle text-center", tdClass: "align-middle text-center" },
                { key: "tipe_diskon", label: "Tipe Diskon", thClass: "align-middle text-center", tdClass: "align-middle text-center" },
                { key: "ktp", label: "Ktp", thClass: "align-middle text-center", tdClass: "align-middle text-center" },
                {
                    key: "actions",
                    label: "Action",
                    thStyle: "text-align: center; width: 80px;",
                    thClass: "align-middle text-center",
                    tdClass: "align-middle text-center",
                },
            ],
        };
    },
    computed: {
        ...mapState("customer", {
            form: (state) => state.form,
            collection: (state) => state.collection,
            isBusy: (state) => state.isBusy,
            diskonList: (state) => state.diskonList,
        }),
        tableParams: {
            get() {
                return this.$store.state.customer.tableParams;
            },
            set(params) {
                this.$store.commit("customer/SET_TABLE_PARAMS", params);
            },
        },
    },
    created() {
        this.loadData(this.tableParams);
    },
    watch: {
        tableParams: {
            handler: function (params) {
                this.loadData(params, true);
            },
            deep: true,
        },
        keyword() {
            this.loadData(this.tableParams, true);
        },
    },
    methods: {
        ...mapMutations(["CLEAR_ERRORS"]),
        ...mapMutations("customer", ["CLEAR_FORM", "ASSIGN_FORM"]),
        ...mapActions("customer", ["load", "store", "update", "destroy"]),
        loadData(params, keyword = false) {
            this.load({
                keyword: this.keyword,
                page: keyword ? (this.tableParams.page = 1) : params.page,
                per_page: params.per_page,
                order_column: params.order_column,
                order_direction: params.order_direction,
            });
        },
        showModal() {
            this.$bvModal.show("modal-form");
        },
        hideModal() {
            this.$bvModal.hide("modal-form");
            this.modelId = null;
            this.modalTitle = "Create";
            this.CLEAR_FORM();
            this.CLEAR_ERRORS();
        },
        edit(item) {
            this.modelId = item.id;
            this.ASSIGN_FORM(item);
            this.modalTitle = "Edit";
            this.showModal();
        },
        remove(id) {
            this.destroy(id);
        },
        submit() {
            let data = new FormData();
            data.append("nama", this.form.nama);
            data.append("contact", this.form.contact);
            data.append("email", this.form.email);
            data.append("alamat", this.form.alamat);
            data.append("diskon", this.form.diskon);
            data.append("tipe_diskon", this.form.tipe_diskon);
            if (this.form.ktp !== null) data.append("ktp", this.form.ktp);

            if (!this.modelId) {
                this.store(data)
                    .then(() => {
                        this.loadingProcess = false;
                        this.hideModal();
                    })
                    .catch((res) => {
                        this.loadingProcess = false;
                    });
            } else {
                data.append("_method", "patch");
                this.update({ id: this.modelId, data })
                    .then(() => {
                        this.loadingProcess = false;
                        this.hideModal();
                    })
                    .catch((res) => {
                        this.loadingProcess = false;
                    });
            }
        },
        tipeDiskon(value) {
            const diskon = this.diskonList.find((item) => item.value == value);
            if (diskon) {
                return diskon.text;
            }
            return "";
        },
    },
};
</script>