<template>
    <div class="product-edit-content content-wrapper">
        <Header></Header>

        <section id="product-edit">
            <div class="container">
                <div class="content">

                    product edit

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
    name: 'ProducEditContent',

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