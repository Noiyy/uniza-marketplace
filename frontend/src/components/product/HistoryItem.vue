<template>
    <div class="history-item d-flex justify-content-between" :class="historyData.historyType ? historyData.historyType : ''">
        <div class="item-main d-flex gap-24 align-items-center">
            <div class="item-misc d-flex gap-8 align-items-center">
                <div class="type-indicator"></div>
                Sold 2x
            </div>
            <div class="item-info">
                Count of left: 2
            </div>
        </div>

        <div class="item-date d-flex gap-8 align-items-center montserrat">
            <Icon icon="lets-icons:date-fill" class="date-icon" />
            <span class="date"> 17.12.2024  </span> <!-- {{ isoToDateString(historyData.timestamp) }} -->
            <span class="time"> 14:44 </span> <!-- {{ isoToDayTime(historyData.timestamp) }} -->
        </div>
    </div>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
    name: 'HistoryItem',

    inject: ['emitter'],
    emits: [],

    props: {
        historyData: {
            type: Number, // Object
            default: null
        }
    },

    components: {
        Icon
    },

    data() {
        return {

        }
    },

    methods: {

    },
    
    computed: {

    },

    created() {

    },

    mounted() {

    }
}
</script>

<style scoped>
.history-item {
    padding: 8px 16px;
    border-radius: 16px;
    background-color: var(--white-7a);
}
.history-item:nth-child(even) {
    background-color: var(--white-3a);
}
.history-item:nth-child(6n) {
    margin-top: 16px;
}

.type-indicator {
    height: 32px;
    width: 16px;
    border-radius: 16px;
    background-color: var(--white-50a);
}

.item-info {
    font-weight: bold;
}

.item-date .date-icon {
    font-size: 24px;
    opacity: 0.5;
}

.item-date .date {
    font-weight: bold;
}

.item-date .time {
    font-weight: 100;
}
</style>