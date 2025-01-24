<template>
    <section id="hero" class="d-flex flex-column">
        <Header></Header>
        
        <div class="container d-flex flex-column flex-1">
            <div class="content d-flex flex-column flex-1">

                <div class="hero-content d-flex flex-1 flex-column justify-content-center align-items-center text-center">

                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Header from '../Header.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'HomeHero',

    inject: ['axios', 'emitter'],
    emits: [],

    props: {

    },

    components: {
        Header
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

</style>