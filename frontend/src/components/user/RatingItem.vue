<template>
    <div class="rating-item d-flex gap-16">
        <div class="main d-flex gap-24">
            <router-link :to="`/user/${ratingData.fromUserId}`" class="fromUser-avatar-cont pos-relative">
                <img v-if="ratingData.fromUser && ratingData.fromUser.avatarPath" :src="getAssetUrl(`img/userAvatars/${ratingData.fromUser.avatarPath}`)" class="user-avatar" alt="User avatar" >
                <div class="default-avatar-cont" v-else>
                    <Icon icon="akar-icons:person" class="default-avatar-icon" />
                </div>
            </router-link>
            <div class="rating-content d-flex flex-column">
                <div class="rating-heading d-flex gap-24">
                    <div class="rating-values d-flex gap-8 align-items-center">
                        <span> {{ ratingData.ratingValue.$numberDecimal }} </span>
                        <Icon icon="material-symbols:star" class="star-icon" v-if="ratingData.ratingValue.$numberDecimal && ratingData.ratingValue.$numberDecimal >= 1" />
                        <Icon icon="material-symbols:star-half" class="star-icon" v-else-if="ratingData.ratingValue.$numberDecimal && ratingData.ratingValue.$numberDecimal > 0" />
                            <Icon icon="material-symbols:star-outline" class="star-icon" v-else />
                    </div>

                    <h1 class="rating-title"> {{ ratingData.title }} </h1>
                </div>
                <div class="rating-description-cont scrollbar">
                    <p class="rating-description">
                        {{ ratingData.description ? ratingData.description : '-' }}
                    </p>
                </div>
            </div>
        </div>
        <div class="product-info d-flex flex-column pos-relative">
            <div class="product-heading"> Product </div>
            <div class="product-name gradient-text">
                <template v-if="ratingData.product && ratingData.product.title"> {{ ratingData.product.title }} </template>
                <template v-else> - </template>
            </div>

            <router-link v-if="ratingData.productId" :to="`/product/${ratingData.productId}`" class="product-link">
                <Icon icon="prime:arrow-up-right" class="arrow-icon" />
            </router-link>
        </div>
    </div>
</template>

<script>
import { Icon } from '@iconify/vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'RatingItem',

    inject: ['axios', 'emitter'],
    emits: [],

    props: {
        ratingData: {
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
.rating-item {
    border-radius: 16px;
    background-color: var(--white-2a);
    max-height: 124px;
    gap: 20px;
    transition: box-shadow 0.2s ease-out;
    position: relative;
}
.rating-item:hover {
    color: var(--white);
    -webkit-box-shadow: 0px 0px 8px 0px rgba(255 ,255, 255, 0.66);
    -moz-box-shadow: 0px 0px 8px 0px rgba(255 ,255, 255, 0.66);
    box-shadow: 0px 0px 8px 0px rgba(255 ,255, 255, 0.66);
}
.rating-item:nth-child(even) {
    background-color: var(--white-7a);
}

.main {
    flex: 3;
    padding: 16px;
}

.product-info {
    flex: 1.2;
    background-color: var(--white-3a);
    border-radius: 16px;
    padding: 16px;
}

.product-info .product-heading {
    font-size: 14px;
    font-weight: 300;
}

.product-info .product-name {
    font-weight: 600;
}

.rating-content {
    gap: 4px;
}

.product-link {
    position: absolute;
    bottom: 8px;
    right: 8px;
    font-size: 32px;
}

.fromUser-avatar-cont:hover {
    color: var(--white);
}

.fromUser-avatar-cont::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.2s ease-in;
}
.fromUser-avatar-cont:hover::before {
    opacity: 1;
}

.fromUser-avatar-cont, .default-avatar-cont {
    flex-shrink: 0;
    width: 88px;
    height: 88px;
    max-width: 88px;
    max-height: 88px;
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
    font-size: 48px;
    background: var(--white-5a);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.rating-title {
    font-size: 16px;
    font-weight: bold;
    line-height: 16px;
}

.rating-description-cont {
    overflow: auto;
    height: 100%;
}

.rating-description {
    font-size: 14px;
    font-weight: 300;
    line-height: 17px;
    margin-right: 16px;
}

.rating-values span {
    font-weight: 600;
}
</style>