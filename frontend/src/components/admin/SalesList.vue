<template>
    <div class="sales-wrapper d-flex flex-column gap-24" v-if="sales.length">
        <template v-for="(sale, index) in sales" :key="index">
            <SaleItem
                :sale-data="sale"
                :is-in-admin="true"
            ></SaleItem>
        </template>
    </div>

    <div class="sales-wrapper no-items text-center pos-relative" v-else>
        <span> No sales were found! :( </span>
        <Icon icon="game-icons:capybara" class="no-items-icon" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SaleItem from '../product/SaleItem.vue';
import { Icon } from '@iconify/vue';

export default {
    name: 'SalesList',

    inject: ['emitter'],
    emits: [],

    props: {
        sales: {
            type: Array,
            default: null
        }
    },

    components: {
        SaleItem,
        Icon
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