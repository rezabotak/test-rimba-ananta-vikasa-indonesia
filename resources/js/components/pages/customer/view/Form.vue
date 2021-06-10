<template>
    <div>
        <b-form-group>
            <label>Nama</label>
            <span class="text-danger inline">*</span>
            <b-form-input v-model="form.nama" :class="{ 'is-invalid': errors.nama }" />
            <div class="invalid-feedback" v-if="errors.nama">{{ errors.nama[0] }}</div>
        </b-form-group>
        <b-form-group>
            <label>Contact</label>
            <span class="text-danger inline">*</span>
            <b-form-input v-model="form.contact" :class="{ 'is-invalid': errors.contact }" />
            <div class="invalid-feedback" v-if="errors.contact">{{ errors.contact[0] }}</div>
        </b-form-group>
        <b-form-group>
            <label>Email</label>
            <span class="text-danger inline">*</span>
            <b-form-input v-model="form.email" :class="{ 'is-invalid': errors.email }" />
            <div class="invalid-feedback" v-if="errors.email">{{ errors.email[0] }}</div>
        </b-form-group>
        <b-form-group>
            <label>Alamat</label>
            <span class="text-danger inline">*</span>
            <b-form-textarea
                id="textarea"
                v-model="form.alamat"
                :class="{ 'is-invalid': errors.alamat }"
                placeholder="Enter something..."
                rows="3"
                max-rows="6"
            ></b-form-textarea>
            <div class="invalid-feedback" v-if="errors.alamat">{{ errors.alamat[0] }}</div>
        </b-form-group>
        <b-form-group>
            <label>Diskon</label>
            <b-form-input v-model="form.diskon" :class="{ 'is-invalid': errors.diskon }" />
            <div class="invalid-feedback" v-if="errors.diskon">{{ errors.diskon[0] }}</div>
        </b-form-group>
        <b-form-group>
            <label>Tipe Diskon</label>
            <b-form-select v-model="form.tipe_diskon" :class="{ 'is-invalid': errors.tipe_diskon }" :options="diskonList"></b-form-select>
            <div class="invalid-feedback" v-if="errors.tipe_diskon">{{ errors.tipe_diskon[0] }}</div>
        </b-form-group>
        <b-form-group>
            <label>Ktp</label>
            <span class="text-danger inline">*</span>
            <b-form-file
                v-model="form.ktp"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
                accept=".jpg, .png"
                :class="{ 'is-invalid': errors.ktp }"
            ></b-form-file>
            <div class="invalid-feedback" v-if="errors.ktp">{{ errors.ktp[0] }}</div>
        </b-form-group>
    </div>
</template>
<script>
import { mapState } from "vuex";
export default {
    computed: {
        ...mapState(["errors"]),
        ...mapState("customer", {
            form: (state) => state.form,
            diskonList: (state) => state.diskonList,
        }),
    },
};
</script>