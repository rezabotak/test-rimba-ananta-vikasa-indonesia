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
                    <template v-slot:cell(customer_id)="row">
                        {{ (row.item.customer || {}).nama }}
                    </template>

                    <template v-slot:cell(actions)="row">
                        <a href="javascript:void(0)" @click="edit(row.item)" class="text-primary" v-b-tooltip.hover title="update">
                            <i class="fas fa-pen-square"></i>
                        </a>
                        <a href="javascript:void(0)" @click="remove(row.item.id)" class="text-danger" v-b-tooltip.hover title="delete">
                            <i class="fas fa-trash"></i>
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
            <b-modal id="modal-form" size="lg" :title="modalTitle" no-close-on-esc no-close-on-backdrop>
                <form-component @disableSaveButton="isDisableSaveButton($event)"></form-component>
                <template v-slot:modal-footer>
                    <b-button class="btn btn-danger ml-2" @click="hideModal()">Cancel </b-button>
                    <button class="btn btn-primary" @click.prevent="submit" :disabled="loadingProcess || disableSaveButton">
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
            disableSaveButton: false,
            modelId: null,
            fields: [
                {
                    key: "index",
                    label: "#",
                    thStyle: "text-align: center; width: 35px;",
                    tdClass: "text-center",
                },
                { key: "code_transaksi", label: "Code", sortable: true },
                { key: "customer_id", label: "Customer" },
                { key: "tanggal_transaksi", label: "Tanggal Transaksi" },
                { key: "total_diskon", label: "Total Diskon" },
                { key: "total_harga", label: "Total Harga" },
                { key: "total_bayar", label: "Total Bayar" },
            ],
        };
    },
    computed: {
        ...mapState("sales", {
            form: (state) => state.form,
            collection: (state) => state.collection,
            isBusy: (state) => state.isBusy,
        }),
        tableParams: {
            get() {
                return this.$store.state.sales.tableParams;
            },
            set(params) {
                this.$store.commit("sales/SET_TABLE_PARAMS", params);
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
        ...mapMutations("sales", ["CLEAR_FORM"]),
        ...mapActions("sales", ["load", "store"]),
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
            this.CLEAR_FORM();
            this.modelId = null;
            this.CLEAR_ERRORS();
        },
        submit() {
            this.store()
                .then(() => {
                    this.loadingProcess = false;
                    this.hideModal();
                })
                .catch((res) => {
                    this.loadingProcess = false;
                });
        },
        isDisableSaveButton(value) {
            this.disableSaveButton = value;
        },
    },
};
</script>