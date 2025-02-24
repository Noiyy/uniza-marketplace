<template>
    <div>
        prod
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'ProductItem',

    inject: ['emitter'],
    emits: [],

    props: {
        prodData: {
            type: Object,
            default: null
        }
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

</style>