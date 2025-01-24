<template>
     <div id="sidebar-menu" class="d-flex">
        <nav class="d-flex flex-column flex-1 align-items-end gap-8">
            a
            <!-- <router-link to="/" @click="goToHomeCars()"> {{ $t('NaseVozidla') }} </router-link>
            <router-link to="/contact" @click="emitter.emit('toggle-sidebarMenu')"> {{ $t('Kontakt') }} </router-link>
            <router-link to="/admin" v-if="$isAdmin"
                @click="emitter.emit('toggle-sidebarMenu')"> 
                <Icon icon="material-symbols:person" class="admin-icon" />
            </router-link> -->
        </nav>

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
    width: 100%;
    background-color: var(--dark-blue);
    color: var(--white);
    padding: 20px;
    transition: right 0.3s ease-in-out;
    z-index: 15;
}

#sidebar-menu.open {
    right: 0;
}

nav {
    margin-top: 120px;
    font-size: 20px;
    text-transform: uppercase;
}

.logo-bg {
    position: absolute;
    bottom: 48px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0.15;
    width: 80%;
    height: auto;
}
</style>