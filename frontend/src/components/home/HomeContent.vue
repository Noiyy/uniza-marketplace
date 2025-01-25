<template>
    <div class="home-content content-wrapper">
        <HomeHero></HomeHero>
    
        <Footer></Footer>
    </div>
</template>

<script>
import Footer from '../Footer.vue'
import HomeHero from './HomeHero.vue';
// import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'HomeContent',

    inject: ['axios', 'emitter'],
    emits: [],

    props: {

    },

    components: {
        HomeHero,
        Footer
    },

    data() {
        return {

        }
    },

    methods: {
        // ...mapActions(
        //     {

        //     }
        // ),
    },
    
    computed: {
        // ...mapGetters(
        //     {

        //     }
        // ),
    },

    created() {

    },

    mounted() {

    }
}
</script>

<style scoped>
/* .home-content {
    min-height: 100vh;
    min-height: 100svh;
}

.home-content > section {
    min-height: 100vh;
    min-height: 100svh;
} */
</style>