<template>
    <div class="product-item-wrapper list-item-cont d-flex gap-16 justify-content-between align-items-center pos-relative">
        <div class="list-item-controls d-flex flex-column gap-8" v-if="isInAdmin">
            <button class="btn btn-icon" @click="deleteProduct()">
                <Icon icon="mdi:trash" class="control-icon" />
            </button>

            <button class="btn btn-icon" @click="editProduct()">
                <Icon icon="mdi:pencil" class="control-icon" />
            </button>
        </div>

        <router-link :to="`/product/${prodData._id}`" class="product-item list-item d-flex flex-1 list" v-if="viewType == 'list'"> <!-- :class="viewType == 'grid' ? 'grid' : ''" -->
            <div class="thumbnail d-flex justify-content-center align-items-center">
                <img v-if="prodData.images.length" :src="getAssetUrl(`img/products/${prodData.images[0]}`)" :alt="`${prodData.title} thumbnail`" class="img-fluid">
                <img v-else :src="getAssetUrl('img/logo-sm_dark.svg')" aria-hidden="true" class="no-img img-fluid">
            </div>
            <div class="main d-flex flex-column">
                <div class="heading">
                    <h2 class="gradient-text"> {{ prodData.title }} </h2>
                </div>
                <div class="description" 
                    v-html="prodData.description"> 
                </div>
            </div>
            <div class="details d-flex flex-column gap-8">
                <div class="price">
                    <span v-if="prodData.price.specialValue"> {{ prodData.price.specialValue }} </span>
                    <span v-else> {{ prodData.price.value.$numberDecimal }}€ </span>      
                </div>
                <div class="location">
                    <Icon icon="mdi:location" class="location-icon detail-icon" />
                    Žilina
                </div>
                <div class="d-flex gap-16 justify-content-between align-items-center">
                    <div class="views">
                        <Icon icon="mdi:eye" class="views-icon detail-icon" />
                        2719x
                    </div>
                    <div class="count d-flex gap-8 align-items-center">
                        <Icon icon="fluent:book-number-24-regular" class="count-icon detail-icon" />
                        {{ prodData.count.available }}
                    </div>
                </div>
            </div>
        </router-link>
    
        <router-link :to="`/product/${prodData._id}`" class="product-item d-flex flex-column grid" v-else-if="viewType == 'grid'">
            <div class="thumbnail d-flex justify-content-center align-items-center">
                <div class="location">
                    <Icon icon="mdi:location" class="location-icon detail-icon" />
                    Žilina
                </div>
    
                <img v-if="prodData.images.length" :src="getAssetUrl(`img/products/${prodData.images[0]}`)" :alt="`${prodData.title} thumbnail`" class="img-fluid">
                <img v-else :src="getAssetUrl('img/logo-sm_dark.svg')" aria-hidden="true" class="no-img img-fluid">
            </div>
            <div class="main d-flex flex-column justify-content-between">
                <div class="heading">
                    <h2 class="gradient-text"> {{ prodData.title }} </h2>
                </div>
                <div class="grid-details d-flex gap-16 justify-content-between align-items-center">
                    <div class="price">
                        <span v-if="prodData.price.specialValue"> {{ prodData.price.specialValue }} </span>
                        <span v-else> {{ prodData.price.value.$numberDecimal }}€ </span>      
                    </div>
    
                    <div class="count d-flex gap-8 align-items-center">
                        <Icon icon="fluent:book-number-24-regular" class="count-icon detail-icon" />
                        {{ prodData.count.available }}
                    </div>
                </div>
            </div>
        </router-link>

        <router-link :to="`/user/${prodData.sellerId}`" class="user-avatar-wrapper" v-if="isInAdmin">
            <div class="user-avatar-cont pos-relative">
                <img :src="getAssetUrl(`img/userAvatars/${prodData.avatarPath}`)" class="user-avatar" alt="User avatar" v-if="prodData.avatarPath">
                <div class="default-avatar-cont" v-else>
                    <Icon icon="akar-icons:person" class="default-avatar-icon" />
                </div>
            </div>
            <div class="user-name text-center">
                {{ prodData.username }}
            </div>
        </router-link>

        <div class="item-id-info" v-if="isInAdmin">
            {{ prodData._id }}
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Icon } from '@iconify/vue';

export default {
    name: 'ProductItem',

    inject: ['emitter'],
    emits: [],

    props: {
        prodData: {
            type: Object,
            default: null
        },

        viewType: {
            type: String,
            default: "list"
        },

        isInAdmin: {
            type: Boolean,
            default: false
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
.product-item {
    height: 116px;
    gap: 20px;
}
.product-item:hover { 
    color: var(--white);
    -webkit-box-shadow: 0px 0px 8px 0px rgba(255 ,255, 255, 0.66);
    -moz-box-shadow: 0px 0px 8px 0px rgba(255 ,255, 255, 0.66);
    box-shadow: 0px 0px 8px 0px rgba(255 ,255, 255, 0.66);
}

.thumbnail {
    flex: 1.5;
    background-color: var(--white-5a);
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
    overflow: hidden;
}

.thumbnail img {
    object-fit: cover;
    height: 100%;
    width: 100%;
}

.thumbnail .no-img {
    object-fit: initial;
    height: 75%;
    opacity: 0.2;
}

.main {
    flex: 4;
    padding: 16px 0;
    overflow: hidden;
    gap: 4px;
}

.main .description {
    font-size: 14px;
    overflow: hidden;
}

.details {
    flex: 1.3;
    padding: 16px 0;
    padding-right: 16px;
    align-items: flex-start;
    font-size: 14px;
}

.detail-icon {
    opacity: 0.33;
    font-size: 20px;
}

.heading h2 {
    font-size: 16px;
    font-weight: bold;
    line-height: 16px;
    display: inline-flex;
}

.price {
    display: inline;
    padding: 2px 8px;
    border-radius: 8px;
    background: var(--gradient-angle);
    color: var(--black);
    font-size: 18px;
    font-weight: 800;
    line-height: 18px;
}

.product-item.grid {
    height: 228px;
    /* width: 182px; */
    gap: 0;
    border-radius: 0;
}

.product-item.grid .thumbnail {
    flex: 2;
    border-radius: 0;
}

.product-item.grid .main {
    padding: 8px;
    flex: 1;
    gap: 16px;
}

.product-item.grid .detail-icon {
    font-size: 16px;
}

.product-item.grid .location {
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.66);
    font-size: 12px;
    padding: 2px 8px;
}
</style>