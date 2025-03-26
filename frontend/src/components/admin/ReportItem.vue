<template>
     <div class="report-item-wrapper list-item-cont d-flex gap-16 justify-content-between align-items-center pos-relative">
        <div class="list-item-controls d-flex flex-column gap-8">
            <button class="btn btn-icon" @click="deleteReport()">
                <Icon icon="mdi:trash" class="control-icon" />
            </button>
        </div>

        <div class="report-item list-item flex-1 d-flex gap-16">
            <div class="main d-flex gap-24">
                <div>
                    <FromToObjectInfos
                        :from-obj="reportData.fromUser"
                        :to-obj="reportData.toProductId ? reportData.toProduct : reportData.toUser"
                        :to-obj-type="reportData.toProductId ? 'product' : 'user' "
                        :created-at="reportData.createdAt"
                    ></FromToObjectInfos>
                </div>
                <div class="report-content d-flex flex-column">
                    <div class="report-description-cont scrollbar">
                        <p class="report-description">
                            {{ reportData.description ? reportData.description : '-' }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="item-id-info">
            {{ reportData._id }}
        </div>
    </div>
</template>

<script>
import FromToObjectInfos from '../user/FromToObjectInfos.vue';
import { Icon } from '@iconify/vue';

import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'ReportItem',

    inject: ['axios', 'emitter'],
    emits: [],

    props: {
        reportData: {
            type: Object,
            default: null
        },

        reportsProduct: {
            type: Boolean,
            default: false
        }
    },

    components: {
        FromToObjectInfos,
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

        deleteReport() {

        }
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
.report-item .main {
    padding: 16px;
}

.report-description-cont {
    overflow: auto;
    height: 100%;
}

.report-description {
    font-size: 14px;
    font-weight: 300;
    line-height: 17px;
    margin-right: 16px;
}


</style>