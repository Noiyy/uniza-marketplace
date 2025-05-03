<template>
    <div class="history-item d-flex justify-content-between" :class="historyData.historyType ? `type-${historyData.historyType}` : ''">
        <div class="item-main d-flex gap-32 align-items-center">
            <slot name="content">
                <div class="item-misc d-flex gap-16 align-items-center">
                    <div class="type-indicator"></div>
                    <span v-if="historyData.historyType == 'sale'"> {{ $t("Sold") }} {{ historyData.newValue }}x </span>
                    <span v-else-if="historyData.historyType == 'count'"> {{ $t("Added") }} +{{ historyData.newValue - historyData.oldValue }} </span>
                    <span v-else-if="historyData.historyType == 'priceChange'"> {{ $t("ChangedPrice") }} </span>
                    <span v-else-if="historyData.historyType == 'saleEnded'"> {{ $t("SaleEnded") }} </span>
                </div>
                <div class="item-info">
                    <span v-if="historyData.historyType == 'count'"> {{ $t("CountOfLeft") }}: {{ historyData.newValue }} </span>
                    <span v-if="historyData.historyType == 'sale'"> {{ $t("CountOfLeft") }}: {{ historyData.oldValue }} </span>
                    <span v-if="historyData.historyType == 'priceChange'" class="d-flex gap-8 align-items-center"> 
                        {{ historyData.oldValue }}€
                        <Icon icon="formkit:arrowright" class="arrow-icon" :class="historyData.oldValue > historyData.newValue ? 'lower' : 'higher'" />
                        {{ historyData.newValue }}€
                    </span>
                </div>
            </slot>
        </div>

        <div class="item-date d-flex gap-8 align-items-center montserrat">
            <Icon icon="lets-icons:date-fill" class="date-icon" />
            <span class="date"> {{ isoToDateString(historyData.timestamp || historyData.createdAt) }}  </span>
            <span class="time"> {{ isoToDayTime(historyData.timestamp || historyData.createdAt) }} </span>
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
            type: Object,
            default: null
        },

        productData: {
            type: Object,
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

.history-item.type-count .type-indicator {
    background-color: var(--blue);
}
.history-item.type-priceChange .type-indicator {
    background-color: var(--accent);
}
.history-item.type-sale .type-indicator {
    background-color: var(--green);
}
.history-item.type-saleEnded .type-indicator {
    background-color: var(--red);
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

.arrow-icon.lower {
    color: var(--green);
}
.arrow-icon.higher {
    color: var(--red);
}

.item-misc {
    font-weight: 300;
}

/* SMALL - Mobile */
@media(max-width: 640px) { 
    .history-item {
        padding: 4px 12px;
        gap: 16px;
    }

    .type-indicator {
        width: 8px;
        height: 24px;
    }

    .item-misc {
        gap: 8px !important;
        font-size: 14px;
    }

    .item-main {
        gap: 16px !important;
    }

    .item-info {
        font-size: 14px;
    }

    .item-date {
        font-size: 12px;
    }

    .item-date .date-icon {
        font-size: 16px;
    }
}

/* MEDIUM - Tablet */
@media(min-width: 641px) and (max-width: 992px) { 

}
</style>