<template>
    <div>
        <b-row>
            <b-col>
                <b-form-group>
                    <label>Code Transaksi</label>
                    <span class="text-danger inline">*</span>
                    <b-form-input v-model="form.code_transaksi" :class="{ 'is-invalid': errors.code_transaksi }" />
                    <div class="invalid-feedback" v-if="errors.code_transaksi">{{ errors.code_transaksi[0] }}</div>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group>
                    <label>Tanggal Transaksi</label>
                    <span class="text-danger inline">*</span>
                    <b-form-datepicker
                        id="example-datepicker"
                        v-model="form.tanggal_transaksi"
                        :class="{ 'is-invalid': errors.tanggal_transaksi }"
                    ></b-form-datepicker>
                    <div class="invalid-feedback" v-if="errors.tanggal_transaksi">{{ errors.tanggal_transaksi[0] }}</div>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group>
                    <label>Customer</label>
                    <span class="text-danger inline">*</span>
                    <b-form-select
                        v-model="form.customer_id"
                        :class="{ 'is-invalid': errors.customer_id }"
                        :options="customers"
                        text-field="nama"
                        value-field="id"
                    ></b-form-select>
                    <div class="invalid-feedback" v-if="errors.customer_id">{{ errors.customer_id[0] }}</div>
                </b-form-group>
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <table class="table table-bordered table-sm table-hover">
                    <thead>
                        <tr>
                            <th width="50px" class="text-center">#</th>
                            <th width="40%">Item</th>
                            <th width="40%">Qty</th>
                            <th class="text-center" width="50px">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in form.sale_items" :key="index" class="justify-content-between align-items-center">
                            <td class="text-center align-middle">
                                {{ index + 1 }}
                            </td>
                            <td class="align-middle">
                                <b-form-select
                                    v-model="row.item_id"
                                    :options="items"
                                    text-field="nama_item"
                                    value-field="id"
                                    :class="{ 'is-invalid': errors[`sale_items.${index}.item_id`] }"
                                ></b-form-select>
                                <div class="invalid-feedback" v-if="errors[`sale_items.${index}.item_id`]">
                                    {{ errors[`sale_items.${index}.item_id`][0] }}
                                </div>
                            </td>
                            <td class="align-middle">
                                <b-form-input
                                    v-model="row.qty"
                                    :class="{ 'is-invalid': errors[`sale_items.${index}.qty`] }"
                                    :disabled="row.item_id == ''"
                                    @keyup="handleQty(index, row.item_id)"
                                />
                                <div class="invalid-feedback" v-if="errors[`sale_items.${index}.qty`]">
                                    {{ errors[`sale_items.${index}.qty`][0] }}
                                </div>
                            </td>
                            <td class="text-center align-middle">
                                <a href="javascript:void(0)" class="text-danger" v-b-tooltip.hover title="delete" @click="deleteitem(index)">
                                    <b-icon icon="trash"></b-icon>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p class="float-left text-danger" v-if="errors.sale_items">{{ errors.sale_items[0] }}</p>
                <button type="button" @click="addItem()" class="btn btn-sm btn-success waves-effect waves-light float-right">
                    <b-icon icon="plus"></b-icon> Add
                </button>
            </b-col>
        </b-row>

        <b-row class="mt-2">
            <b-col> Total Diskon: {{ form.total_diskon }} </b-col>
            <b-col> Total Harga: {{ form.total_harga }} </b-col>
            <b-col>
                <b-form-input v-model="form.total_bayar" :class="{ 'is-invalid': errors.total_bayar }" placeholder="Total Bayar" />
                <div class="invalid-feedback" v-if="errors.total_bayar">{{ errors.total_bayar[0] }}</div>
            </b-col>
        </b-row>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
    data() {
        return {
            itemOptions: [],
        };
    },
    computed: {
        ...mapState(["errors"]),
        ...mapState("sales", {
            form: (state) => state.form,
            customer: (state) => state.form.customer_id,
            saleItems: (state) => state.form.sale_items,
        }),
        ...mapState("customer", {
            customers: (state) => state.collectionList.data,
        }),
        ...mapState("item", {
            items: (state) => state.collectionList.data,
        }),
    },
    created() {
        this.loadCustomer();
        this.loadItem();
    },
    watch: {
        customer() {
            this.countTotal();
        },
        saleItems: {
            deep: true,
            handler() {
                this.countTotal();
            },
        },
    },
    methods: {
        ...mapMutations(["SET_ERRORS"]),
        ...mapActions("customer", {
            loadCustomer: "loadList",
        }),
        ...mapActions("item", {
            loadItem: "loadList",
        }),
        addItem() {
            this.form.sale_items.push({
                item_id: "",
                qty: "",
            });
        },
        deleteitem(index) {
            this.form.sale_items.splice(index, 1);
        },
        handleQty(index, itemId) {
            const stokItem = this.items.find((item) => item.id == itemId).stok;
            const totalQty = this.form.sale_items
                .filter((item) => item.item_id == itemId)
                .map((item) => {
                    if (item.qty == "") {
                        return 0;
                    }
                    return parseInt(item.qty);
                })
                .reduce((acc, curr) => acc + curr, 0);

            if (stokItem < totalQty) {
                this.SET_ERRORS({
                    [`sale_items.${index}.qty`]: ["The qty exceeds stock. Remaining stock " + stokItem],
                });
                this.$emit("disableSaveButton", true);
            } else {
                if (this.errors.hasOwnProperty(`sale_items.${index}.qty`)) {
                    this.$delete(this.errors, `sale_items.${index}.qty`);
                }
                this.$emit("disableSaveButton", false);
            }
        },
        countTotal() {
            let totalHargaItems = 0;
            this.form.sale_items.forEach((element) => {
                const item = this.items.find((item) => item.id == element.item_id);
                const hargaSatuan = item == undefined ? 0 : item.harga_satuan;
                const qty = element.qty == "" ? 0 : element.qty;

                totalHargaItems += hargaSatuan * qty;
            });

            let totalDiskon = 0;
            if (this.form.customer_id != "") {
                const customer = this.customers.find((customer) => customer.id == this.form.customer_id);
                if (customer !== undefined) {
                    const customerDiskon = customer.diskon;
                    const customerTipeDiskon = customer.tipe_diskon;

                    if (customerDiskon) {
                        if (customerTipeDiskon == 0) {
                            totalDiskon = (customer.diskon * totalHargaItems) / 100;
                        }
                        if (customerTipeDiskon == 1) {
                            totalDiskon = customer.diskon;
                        }
                    }
                }
            }
            const totalHarga = totalHargaItems - totalDiskon;
            this.form.total_harga = totalHarga < 0 ? 0 : totalHarga;
            this.form.total_diskon = totalDiskon;
        },
    },
};
</script>