<template>
    <div class="product-detail-content content-wrapper">
        <Header></Header>

        <section id="product-detail">
            <div class="container">
                <div class="content">

                    product detail

                </div>
            </div>
        </section>

        <Footer></Footer>
    </div>
</template>

<script>
import Header from '../Header.vue';
import Footer from '../Footer.vue';

import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'ProducDetailContent',

    inject: ['emitter', 'productApi'],
    emits: [],

    props: {

    },

    components: {
        Header,
        Footer
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