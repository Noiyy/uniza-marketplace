<template>
     <div id="sidebar-menu" class="d-flex">
        <div class="d-flex content gap-16 justify-content-between flex-1">
            <div class="avatar-wrapper">
                <img :src="getAssetUrl('img/logo-sm_dark.svg')" alt="UNIZA Marketplace logo">
            </div>

            <nav class="d-flex flex-column flex-1 align-items-end gap-64">
                <div class="d-flex flex-column gap-32">
                    <div class="d-flex flex-column gap-16">
                        <router-link to="/" @click="emitter.emit('close-sidebarMenu')"> Home </router-link>
                        <router-link to="/browse" @click="emitter.emit('close-sidebarMenu')"> Browse </router-link>
                    </div>
    
                    <div class="d-flex flex-column gap-16">
                        <router-link to="/login" class="btn primary" role="" @click="emitter.emit('close-sidebarMenu')"> Login </router-link>
                        <router-link to="/signUp" class="btn secondary" @click="emitter.emit('close-sidebarMenu')"> Sign up </router-link>
                    </div>
                </div>
    
                <div>
                    <div class="d-flex flex-column gap-16">
                        <router-link to="/support" @click="emitter.emit('close-sidebarMenu')"> Support </router-link>
                        <router-link to="/faq" @click="emitter.emit('close-sidebarMenu')"> FAQ </router-link>
                    </div>
                </div>
                <!-- <router-link to="/" @click="goToHomeCars()"> {{ $t('NaseVozidla') }} </router-link>
                <router-link to="/contact" @click="emitter.emit('toggle-sidebarMenu')"> {{ $t('Kontakt') }} </router-link>
                <router-link to="/admin" v-if="$isAdmin"
                    @click="emitter.emit('toggle-sidebarMenu')"> 
                    <Icon icon="material-symbols:person" class="admin-icon" />
                </router-link> -->
            </nav>
        </div>

        <div class="logo-bg">
            <img :src="getAssetUrl('img/logo-w_dark.svg')" alt="UNIZA Marketplace logo" class="img-fluid">
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'SidebarMenu',

    inject: ['axios', 'emitter'],
    emits: [],

    props: {

    },

    components: {

    },

    data() {
        return {

        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),
    },
    
    computed: {
        ...mapGetters(
            {

            }
        ),
    },

    created() {

    },

    mounted() {

    }
}
</script>

<style scoped>
#sidebar-menu {
    position: fixed;
    top: 0;
    right: -100%;
    bottom: 0;
    width: 40%;
    background-color: var(--black);
    color: var(--white);
    padding: 48px;
    transition: right 0.3s ease-in-out;
    z-index: 15;
    box-shadow: 39px 4px 24.2px 35px var(--primary, #FF9A9E);
}

#sidebar-menu .content {
    margin-top: 120px;
}

#sidebar-menu.open {
    right: 0;
}

nav {
    font-size: 20px;
    text-transform: uppercase;
    text-align: right;
    font-family: "Montserrat", sans-serif;
}

nav a {
    transition: color 0.2s ease-out;
}

nav a:hover {
    color: var(--secondary);
}

.logo-bg {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0.15;
    width: 25%;
    height: auto;
}

.btn {
    padding: 4px 16px;
}

.avatar-wrapper img {
    width: 128px;
    height: 128px;
}
</style>