<template>
    <div class="sale-item-wrapper list-item-cont d-flex gap-16 justify-content-between align-items-center pos-relative">
        <div class="list-item-controls d-flex flex-column gap-8" v-if="isInAdmin">
            <button class="btn btn-icon" @click="showDeleteSale()">
                <Icon icon="mdi:trash" class="control-icon" />
            </button>

            <button class="btn btn-icon" @click="showEditSale()">
                <Icon icon="mdi:pencil" class="control-icon" />
            </button>
        </div>

        <HistoryItem :history-data="saleData" :class="'list-item flex-1'">
            <template #content>
                <div class="item-misc d-flex gap-8 align-items-center">
                    <Icon icon="charm:circle-tick" class="tick-icon" :class="saleData.confirmed ? 'confirmed' : ''" />
                    <!-- <div class="type-indicator"></div> -->
                </div>
                <div class="item-info d-flex align-items-center gap-16">
                    <router-link :to="saleData.userId ? `/user/${saleData.userId}` : ''" class="user-avatar-wrapper d-flex gap-8 align-items-center">
                        <div class="user-avatar-cont pos-relative">
                            <div class="avatar-overlay"></div>
    
                            <img :src="getAssetUrl(`img/userAvatars/${saleData.buyerInfo.avatarPath}`)" class="user-avatar" alt="User avatar" v-if="saleData.buyerInfo && saleData.buyerInfo.avatarPath">
                            <div class="default-avatar-cont" v-else>
                                <Icon :icon="saleData.buyerInfo ? 'akar-icons:person' : 'line-md:question'" class="default-avatar-icon" />
                            </div>
                        </div>
                        <div class="user-name text-center">
                            {{ saleData.buyerInfo ? saleData.buyerInfo.username : '-' }}
                        </div>
                    </router-link>
                    <div class="sold-info">
                        {{ $t("Bought") }} <span>{{ saleData.count }}x</span>
                    </div>

                    <div class="product-info gradient-text" v-if="isInAdmin">
                        <router-link :to="`/product/${saleData.productId}`" > {{ saleData.product ? saleData.product.title : "?" }} </router-link>
                    </div>
                </div>
            </template>
        </HistoryItem>

        <div class="item-id-info" v-if="isInAdmin">
            {{ saleData._id }}
        </div>
    </div>

</template>

<script>
import { Icon } from '@iconify/vue';
import HistoryItem from './HistoryItem.vue';

export default {
    name: 'SaleItem',

    inject: ['emitter'],
    emits: [],

    props: {
        saleData: {
            type: Object,
            default: null
        },

        isInAdmin: {
            type: Boolean,
            default: false
        }
    },

    components: {
        HistoryItem,
        Icon
    },

    data() {
        return {

        }
    },

    methods: {
        showDeleteSale() {
            this.emitter.emit("show-delete-modal", {
                type: "sale",
                data: this.saleData
            });
        },

        showEditSale() {
            this.emitter.emit("show-edit-modal", {
                type: "sale",
                data: this.saleData
            });
        }
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
.type-indicator {
    height: 32px;
    width: 16px;
    border-radius: 16px;
    background-color: var(--green);
}

.sold-info {
    font-weight: 300;
}

.user-avatar-cont {
    transition: filter 0.2s ease-in;
}
.seller:hover .user-avatar-cont {
    filter: brightness(0.66);
}

.user-avatar-cont, .default-avatar-cont {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    max-width: 48px;
    max-height: 48px;
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
    font-size: 24px;
    background: var(--white-5a);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.user-avatar-wrapper:hover .avatar-overlay {
    opacity: 1;
}

.avatar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.33);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.15s ease-in;
}

.user-avatar-wrapper:hover {
    color: var(--white);
}

.user-name {
    font-weight: bold;
}

.tick-icon {
    font-size: 20px;
    opacity: 0.5;
}
.tick-icon.confirmed {
    opacity: 1;
    color: var(--green);
}

.sold-info span {
    font-weight: bold;
}

.product-info {
    font-weight: bold;
    transition: filter 0.15s ease-in-out;
}
.product-info:hover {
    filter: brightness(0.7);
}
</style>