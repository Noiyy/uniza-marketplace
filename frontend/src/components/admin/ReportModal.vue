<template>
    <Modal
        v-model:is-shown="localIsShown"
        :header-text="modalHeading"
        :modal-id="'report-modal'"
        @close="closeModal">
        <template #body>
            <div class="add-content d-flex flex-column gap-32">
                <div class="report-info d-flex flex-column gap-8">
                    <div> {{ $t("User") }} <span> {{ user ? user.username : "" }} </span> </div>
                    <div v-if="!reportUser"> {{ $t("Product") }} <span> {{ product ? product.title : "" }} </span> </div>
                </div>

                <div class="input-cont d-flex flex-column gap-8">
                    <div class="input-tag"> {{ $t('ReportDescription') }} </div>
                    <textarea v-model="reportDescription" type="text" class="styled" :placeholder="$t('Description')"></textarea>
                </div>

                <div class="btns-wrapper d-flex gap-24 justify-content-end">
                    <button class="btn primary  " @click="doReport()"> {{ $t("Report") }} </button>
                    <button class="btn secondary" @click="closeModal()"> {{ $t("Cancel") }} </button>
                </div>
            </div>
        </template>
    </Modal>
</template>

<script>
import { mapGetters } from 'vuex/dist/vuex.cjs.js';
import Modal from '../Modal.vue';

export default {
    name: 'RatingModal',

    inject: ['emitter', 'feedbackApi'],
    emits: ['close', 'update:isShown'],

    props: {
        isShown: {
            type: Boolean,
            default: false
        },

        reportUser: {
            type: Boolean,
            default: true
        },

        user: {
            type: Object,
            default: null
        },

        product: {
            type: Object,
            default: null
        }
    },

    components: {
        Modal,
    },

    data() {
        return {
            localIsShown: false,
            modalHeading: this.reportUser ? this.$t("ReportUser") : this.$t("ReportProduct"),

            reportDescription: ""
        }
    },

    methods: {
        closeModal() {
            this.localIsShown = false;

            this.$emit("update:isShown", false);
            this.$emit("close");
        },

        async doReport() {
            if (!this.reportDescription) {
                this.$toast.error("InvalidDescription");
                return;
            }
            this.emitter.emit("show-loader");

            const post = {
                fromUserId: this.getLoggedUser._id,
                toUserId: this.user._id,
                toProductId: this.product ? this.product._id : null,
                description: this.reportDescription
            };
            console.log(",", post);

            const resp = await this.feedbackApi.addReport(post);
            console.log("hm", resp);
            if (resp.data.success) {
                this.$toast.success("ReportAddSuccess");
                this.closeModal();
            } else this.$toast.error("ReportAddFailed");

            this.emitter.emit("hide-loader");
        }
    },
    
    computed: {
        ...mapGetters(
            {
                getLoggedUser: "user/getUser"
            }
        )
    },

    mounted() {
        this.localIsShown = this.isShown;
    },

    watch: {
        isShown(newValue) {
            this.localIsShown = newValue;
        }
    }
}
</script>

<style scoped>
.report-info span {
    padding: 0 16px;
    font-weight: 200;
    font-size: 18px;
}

textarea {
    min-width: 64px;
    max-height: 35vh;
}
</style>