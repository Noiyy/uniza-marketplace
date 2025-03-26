<template>
    <div class="reports-wrapper d-flex flex-column gap-24" v-if="reports.length">
        <template v-for="(report, index) in reports" :key="index">
            <ReportItem
                :report-data="report"
                :reports-product="report.toProductId ? true : false"
            ></ReportItem>
        </template>
    </div>

    <div class="products-wrapper no-items text-center pos-relative" v-else>
        <span> No reports were found! :( </span>
        <Icon icon="game-icons:capybara" class="no-items-icon" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ReportItem from './ReportItem.vue';
import { Icon } from '@iconify/vue';

export default {
    name: 'ReportsList',

    inject: ['emitter'],
    emits: [],

    props: {
        reports: {
            type: Array,
            default: null
        }
    },

    components: {
        ReportItem,
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