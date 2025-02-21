<template>
    <div class="user-profile-content content-wrapper">
        <Header></Header>

        <section id="user-profile">
            <div class="container">
                <div class="content">

                    user profile

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
    name: 'UserProfileContent',

    inject: ['emitter', 'userApi'],
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