<template>
     <div class="report-item-wrapper list-item-cont d-flex gap-16 justify-content-between align-items-center pos-relative">
        <div class="list-item-controls d-flex flex-column gap-8">
            <button class="btn btn-icon" @click="showDeleteReport()">
                <Icon icon="mdi:trash" class="control-icon" />
            </button>
            <button class="btn btn-icon viewed-btn" :class="isConfirmed ? 'confirmed' : ''"
                @click="confirmReport()">
                <Icon icon="charm:circle-tick" class="viewed-icon" />
            </button>
        </div>

        <div class="report-item list-item flex-1 d-flex gap-16 pos-relative">
            <div class="not-confirmed-indicator" v-if="!isConfirmed"> ! </div>

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

    inject: ['axios', 'emitter', 'feedbackApi'],
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

        showDeleteReport() {
            this.emitter.emit("show-delete-modal", {
                type: "report",
                data: this.reportData
            });
        },

        async confirmReport() {
            this.emitter.emit("show-loader");
            const resp = await this.feedbackApi.confirmReport(this.reportData._id, !this.reportData.viewed);
            console.log(resp);

            if (resp.data.success) {
                this.$toast.success(this.$t("ConfirmReportSuccess"));
                this.emitter.emit("confirmed-report", this.reportData._id);
            } else {
                this.$toast.error(this.$t("ConfirmReportFailed"));
            }
            this.emitter.emit("hide-loader");
        }
    },
    
    computed: {
        ...mapGetters(
            {

            }
        ),

        isConfirmed() {
            return this.reportData.viewed;
        }
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

.viewed-btn {
    background-color: var(--white-15a) !important;
    color: var(--white) !important;
}
.viewed-btn.confirmed {
    color: var(--green) !important;
}

.not-confirmed-indicator {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: var(--red);
    border-radius: 50%;
    color: var(--white);
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 20px;
}

/* SMALL - Mobile */
@media(max-width: 640px) { 
    .list-item-controls {
        position: absolute;
        bottom: 0px;
        left: 8px;
        z-index: 2;
        opacity: 0.75;
        flex-direction: row !important;
    }

    .report-description-cont {
        max-height: 100px;
    }

    .report-item .main {
        gap: 12px !important;
    }
}

/* MEDIUM - Tablet */
@media(min-width: 641px) and (max-width: 992px) { 

}
</style>

<style>
/* SMALL - Mobile */
@media(max-width: 640px) {
    .report-item-wrapper .objs-info .images {
        flex-direction: row !important;
    }

    .report-item-wrapper .objs-info .arrow-icon-cont {
        transform: translate(-50%, -50%) !important;
    }
}
</style>