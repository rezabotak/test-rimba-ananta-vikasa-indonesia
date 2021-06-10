<template>
    <div>
        <nav-bar></nav-bar>
        <div class="container mt-5">
            <h1>{{ currentRouteTitle }}</h1>
            <div class="row">
                <b-col>
                    <router-view></router-view>
                </b-col>
            </div>
        </div>
    </div>
</template>
<script>
import NavBar from "./NavBar.vue";
export default {
    components: {
        NavBar,
    },
    computed: {
        currentRouteTitle() {
            return this.$route.meta.title;
        },
    },
};
</script>