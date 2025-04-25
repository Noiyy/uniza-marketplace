<template>
    <Modal
        v-model:is-shown="localIsShown"
        :header-text="`${$t('AreYouSure')}?`"
        :modal-id="modalId"
        @close="closeModal"
        :header-class="'confirm-modal-header'"
    >
        <template #body>
            <div class="d-flex flex-column justify-content-center align-items-center confirm-body gap-24">
                <p> {{ bodyText }} <span> {{ itemName }} </span> </p>

                <div class="btns-wrapper d-flex gap-24">
                    <button class="btn secondary smaller" @click="$emit('yes')"> {{ $t('Yes') }} </button>
                    <button class="btn primary smaller" @click="closeModal"> {{ $t('No') }} </button>
                </div>
            </div>
        </template>
    </Modal>
</template>

<script>
import Modal from './Modal.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'ConfirmModal',

    inject: ['emitter'],
    emits: ['close', 'yes', 'update:isShown'],

    props: {
        isShown: {
            type: Boolean,
            default: false
        },
        modalId: {
            type: String,
            default: "confirmModalEl"
        },
        bodyText: {
            type: String,
            default: null
        },
        itemName: {
            type: String,
            default: null
        }
    },

    components: {
        Modal
    },

    data() {
        return {
            localIsShown: false
        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),

        closeModal() {
            this.localIsShown = false;
            this.$emit("update:isShown", false);
            this.$emit("close");
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
        this.localIsShown = this.isShown;
        console.log("huh", this.localIsShown);
    },

    watch: {
        isShown(newValue) {
            this.localIsShown = newValue;
        }
    }
}
</script>

<style scoped>
.confirm-body p {
    display: inline-flex;
    gap: 16px;
    flex-wrap: wrap;
}

.confirm-body p span {
    font-weight: bold;
}
</style>

<style>
.confirm-modal-header {
    background-color: var(--accent) !important;
    color: var(--black);
}

.confirm-modal-header h2 {
    color: var(--black);
}
</style>