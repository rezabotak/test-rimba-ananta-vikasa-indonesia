<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
            <b-navbar-brand href="#">Rimba Ananta Vikasa Indonesia</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav class="ml-auto">
                    <b-nav-item :to="{ name: 'item' }">Item</b-nav-item>
                    <b-nav-item :to="{ name: 'customer' }">Customer</b-nav-item>
                    <b-nav-item :to="{ name: 'sales' }">Sales</b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>