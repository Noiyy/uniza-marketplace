<template>
    <div class="chat-content content-wrapper">
        <Header></Header>

        <section id="chat">
            <div class="container">
                <div class="content">

                    chat

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
    name: 'ChatContent',

    inject: ['emitter'],
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