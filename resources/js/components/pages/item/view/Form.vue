<template>
    <div>
        <b-form-group>
            <label>Nama Item</label>
            <span class="text-danger inline">*</span>
            <b-form-input v-model="form.nama_item" :class="{ 'is-invalid': errors.nama_item }" />
            <div class="invalid-feedback" v-if="errors.nama_item">{{ errors.nama_item[0] }}</div>
        </b-form-group>
        <b-form-group>
            <label>Unit</label>
            <span class="text-danger inline">*</span>
            <b-form-select v-model="form.unit" :class="{ 'is-invalid': errors.unit }" :options="unitList"></b-form-select>
            <div class="invalid-feedback" v-if="errors.unit">{{ errors.unit[0] }}</div>
        </b-form-group>
        <b-form-group>
            <label>Stok</label>
            <span class="text-danger inline">*</span>
            <b-form-input v-model="form.stok" :class="{ 'is-invalid': errors.stok }" />
            <div class="invalid-feedback" v-if="errors.stok">{{ errors.stok[0] }}</div>
        </b-form-group>
        <b-form-group>
            <label>Harga Satuan</label>
            <span class="text-danger inline">*</span>
            <b-form-input v-model="form.harga_satuan" :class="{ 'is-invalid': errors.harga_satuan }" />
            <div class="invalid-feedback" v-if="errors.harga_satuan">{{ errors.harga_satuan[0] }}</div>
        </b-form-group>
        <b-form-group>
            <label>Barang</label>
            <span class="text-danger inline">*</span>
            <b-form-file
                v-model="form.barang"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
                accept=".jpg, .png"
                :class="{ 'is-invalid': errors.barang }"
            ></b-form-file>
            <div class="invalid-feedback" v-if="errors.barang">{{ errors.barang[0] }}</div>
        </b-form-group>
    </div>
</template>
<script>
import { mapState } from "vuex";
export default {
    computed: {
        ...mapState(["errors"]),
        ...mapState("item", {
            form: (state) => state.form,
            unitList: (state) => state.unitList,
        }),
    },
};
</script>