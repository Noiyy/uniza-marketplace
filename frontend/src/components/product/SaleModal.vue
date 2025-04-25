<template>
    <Modal
        v-model:is-shown="localIsShown"
        :header-text="modalHeading"
        :modal-id="'sale-modal'"
        @close="closeModal">
        <template #body>
            <div class="input-row d-flex gap-32 align-items-center justify-content-between">
                <div class="input-cont d-flex flex-column gap-8 flex-1">
                    <div class="input-tag"> {{ $t('Buyer') }} </div>
                    <Multiselect
                        v-model="newBuyer"
                        :options="filteredUsers"
                        :allow-empty="true"
                        :multiple="false"
                        :show-labels="false"
                        :track-by="'_id'"
                        @search-change="onBuyerSearchChange" 
                        :internal-search="false"
                        >
                        <template #option="props">
                            <div class="user-avatar-wrapper d-flex gap-8 align-items-center">
                                <div class="user-avatar-cont pos-relative">
                                    <img :src="getAssetUrl(`img/userAvatars/${props.option.avatarPath}`)" class="user-avatar" alt="User avatar" v-if="props.option.avatarPath">
                                    <div class="default-avatar-cont" v-else>
                                        <Icon icon="akar-icons:person" class="default-avatar-icon" />
                                    </div>
                                </div>
                                <div class="user-name text-center">
                                    {{ props.option.username }}
                                    <span class="admin-badge-small" v-if="props.option.isAdmin"> Admin </span>
                                    <span class="admin-badge-small banned-badge" v-if="props.option.ban && props.option.ban.isBanned"> Banned </span>
                                </div>
                            </div>
                        </template>
                        <template #singleLabel="props">
                            <div class="user-avatar-wrapper d-flex gap-8 align-items-center">
                                <div class="user-avatar-cont pos-relative">
                                    <img :src="getAssetUrl(`img/userAvatars/${props.option.avatarPath}`)" class="user-avatar" alt="User avatar" v-if="props.option.avatarPath">
                                    <div class="default-avatar-cont" v-else>
                                        <Icon icon="akar-icons:person" class="default-avatar-icon" />
                                    </div>
                                </div>
                                <div class="user-name text-center">
                                    {{ props.option.username }} 
                                    <span class="admin-badge-small" v-if="props.option.isAdmin"> Admin </span>
                                    <span class="admin-badge-small banned-badge" v-if="props.option.ban && props.option.ban.isBanned"> Banned </span>
                                </div>
                            </div>
                        </template>
                    </Multiselect>
                </div>

                <div class="input-cont d-flex flex-column gap-8">
                    <div class="input-tag"> {{ $t('Count') }} </div>
                    <input v-model="saleCount" type="number" min="1" max="9999" class="styled" :placeholder="$t('Count')">
                </div>
            </div>

            <div class="btns-cont d-flex justify-content-center">
                <button class="btn primary" @click="addSale"> {{ $t("Add") }} </button>
            </div>
        </template>
    </Modal>
</template>

<script>
import { Icon } from '@iconify/vue';
import Modal from '../Modal.vue';

import Multiselect from 'vue-multiselect';
import "vue-multiselect/dist/vue-multiselect.min.css";

export default {
    name: 'SaleModal',

    inject: ['emitter', 'productApi'],
    emits: ['close', 'update:isShown'],

    props: {
        isShown: {
            type: Boolean,
            default: false
        },

        availableUsers: {
            type: Array,
            default: null
        },

        saleData: {
            type: Object,
            default: null
        }
    },

    components: {
        Modal,
        Icon,
        Multiselect
    },

    data() {
        return {
            localIsShown: false,
            newBuyer: null,
            saleCount: 1,
            filteredUsers: []
        }
    },

    methods: {
        onBuyerSearchChange(searchQuery) {
            this.filteredUsers = this.filterByValue(this.availableUsers, searchQuery);
        },

        closeModal() {
            this.localIsShown = false;
            this.newBuyer = null;
            this.saleCount = 1;

            this.$emit("update:isShown", false);
            this.$emit("close");
        },

        async addSale() {
            try {
                this.emitter.emit("show-loader");
                const post = {
                    productId: this.$route.params.id, 
                    userId: this.newBuyer && this.newBuyer._id ? this.newBuyer._id : null,
                    count: this.saleCount
                };

                const resp = await this.productApi.addSale(this.$route.params.id, post);
                console.log("added?", resp);
                if (resp.data.id) {
                    this.$toast.success("SaleAddSuccess");
                    this.closeModal();
                    this.emitter.emit("sale-add-success");
                } else {
                    this.$toast.error("SaleAddFailed");
                }
                this.emitter.emit("hide-loader");
            } catch (err) {
                this.emitter.emit("hide-loader");
                console.error(err);
            }
        }
    },

    computed: {
        isEdit() {
            return this.saleData;
        },

        modalHeading() {
            return this.isEdit ? this.$t("EditSale") : this.$t("AddSale");
        }
    },

    mounted() {
        this.localIsShown = this.isShown;
        this.filteredUsers = this.availableUsers;
    },

    watch: {
        isShown(newValue) {
            this.localIsShown = newValue;
        }
    }
}
</script>

<style scoped>
.btns-cont {
    margin-top: 24px;
}

.user-avatar-cont {
    transition: filter 0.2s ease-in;
}

.user-avatar-cont, .default-avatar-cont {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    max-width: 24px;
    max-height: 24px;
    border-radius: 50%;
}
.user-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    aspect-ratio: 1 / 1;
}

.default-avatar-cont {
    font-size: 16px;
    background: var(--white-5a);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.user-avatar-wrapper:hover .avatar-overlay {
    opacity: 1;
}

.user-name {
    line-height: 100%;
}

.admin-badge-small {
    margin-left: 8px;
}
</style>