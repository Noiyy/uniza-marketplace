<template>
    <div class="home-content content-wrapper">
        <HomeHero></HomeHero>

        <div class="container">
            <div class="under-hero">
                <div class="content d-flex justify-content-around align-items-center">
                    <div class="pattern" :style="patternBgStyle"></div>

                    <div class="left d-flex flex-column align-items-center gap-16">
                        <button class="btn secondary"> browse </button>
                        171 products sold in last 96 hours
                    </div>
    
                    <div class="mid d-flex flex-column align-items-center gap-16">
                        frequently asked questions
                        <button class="btn secondary"> faq </button>
                    </div>
    
                    <div class="right d-flex flex-column align-items-center gap-16">
                        <button class="btn secondary"> support </button>
                        contact us in case of need
                    </div>
                </div>
            </div>

            <section id="latestProducts">
                <div class="content">
    
                    <h1> LATEST SOLD PRODUCTS </h1>
                    <div class="line-divider"></div>
    
                    <div class="latest-products-wrapper">
                        <router-link :to="`/product/${prod._id}`" class="product d-flex gap-24 justify-content-between" v-for="(prod) in latestProducts" :key="prod._id">
                            <div class="prod-header d-flex flex-column">
                                <div class="prod-thumbnail d-flex justify-content-center align-items-center">
                                    <img v-if="prod.images.length" :src="getAssetUrl(`img/products/${prod.images[0]}`)" :alt="`${prod.title} thumbnail`">
                                    <img v-else :src="getAssetUrl('img/logo-sm_dark.svg')" aria-hidden="true" class="no-img">
                                </div>

                                <div class="prod-price d-flex gap-8 align-items-center justify-content-center">
                                    <Icon icon="icomoon-free:price-tags" class="price-tag-icon" />
                                    <template v-if="prod.price.specialValue"> {{ prod.price.specialValue }} </template>
                                    <template v-else> {{ prod.price.value.$numberDecimal }}€ </template>
                                </div>
                            </div>

                            <div class="prod-body d-flex flex-column gap-24 justify-content-between">
                                <div class="prod-heading d-flex justify-content-between align-items-center">
                                    <h3 class="title"> {{ prod.title }} </h3>
                                    <div class="prod-count d-flex gap-8 align-items-center">
                                        <Icon icon="fluent:book-number-24-regular" class="count-icon" />
                                        {{ prod.count.available }}
                                     </div>
                                </div>

                                <div class="prod-info d-flex flex-column gap-16">
                                    <p class="prod-description">
                                        {{ prod.description }}
                                    </p>
    
                                    <div class="prod-additional-info d-flex justify-content-between align-items-center">
                                        <div class="prod-location d-flex gap-8 align-items-center">
                                            <Icon icon="mdi:location" class="location-icon" />
                                            Žilina
                                        </div>

                                        <div class="prod-seller-cont">
                                            <!-- <img :src="getAssetUrl(`img/userAvatars/${}`)" alt="user avatar"> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                    </div>
    
                </div>
            </section>
        </div>

    
        <Footer></Footer>
    </div>
</template>

<script>
import Footer from '../Footer.vue'
import HomeHero from './HomeHero.vue';
// import { mapGetters, mapActions } from 'vuex';

import { Icon } from '@iconify/vue';

export default {
    name: 'HomeContent',

    inject: ['emitter', 'productApi'],
    emits: [],

    props: {

    },

    components: {
        HomeHero,
        Footer,
        Icon
    },

    data() {
        return {
            patternImgSrc: this.getAssetUrl("img/noise_texture.png"),

            latestProducts: []
        }
    },

    methods: {
        // ...mapActions(
        //     {

        //     }
        // ),
        async getLatestProducts() {
            this.emitter.emit("show-loader");
            const resp = await this.productApi.getLatestProducts();

            this.latestProducts = resp.data;
            console.log("latestProducts", this.latestProducts);
            this.emitter.emit("hide-loader");
        }
    },
    
    computed: {
        // ...mapGetters(
        //     {

        //     }
        // ),
        patternBgStyle() {
            return `
                background: url(${this.patternImgSrc}) 0% 0% / 65% 270% repeat`;
        }
    },

    created() {
        this.getLatestProducts();
    },

    mounted() {

    }
}
</script>

<style scoped>
/* .home-content {
    min-height: 100vh;
    min-height: 100svh;
}

.home-content > section {
    min-height: 100vh;
    min-height: 100svh;
} */

.under-hero {
    margin-top: 72px;
    padding: 1px;
    border-radius: 24px;
    background: linear-gradient(135deg, rgba(255, 154, 158, 0) 0%, rgba(255, 154, 158, 0.5) 100%);
}
.under-hero .content {
    border-radius: 24px;
    padding: 31px;
    /* background: rgba(15, 11, 7, 0.85); */
    position: relative;
}

.under-hero .pattern {
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    border-radius: 24px;
}
.under-hero .pattern::before {
    border-radius: 22px;
    content: "";
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    background: rgba(26, 21, 18, 0.95);
    backdrop-filter: blur(20px);
}

.under-hero .left, .under-hero .mid, .under-hero .right {
    z-index: 2;
}

#latestProducts {
    margin-top: 128px;
}

#latestProducts h1 {
    font-weight: bold;
    text-transform: uppercase;
    font-size: 32px;
    margin-bottom: 8px;
}

.latest-products-wrapper {
    margin-top: 32px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 20px;
}

.product {
    background-color: var(--white-2a);
    border-radius: 24px;
    transition: box-shadow 0.2s ease-out;
}
.product:nth-child(2), .product:nth-child(3) {
    background-color: var(--white-7a);
}
.product:hover {
    -webkit-box-shadow: 0px 0px 8px 0px rgba(255 ,255, 255, 0.66);
    -moz-box-shadow: 0px 0px 8px 0px rgba(255 ,255, 255, 0.66);
    box-shadow: 0px 0px 8px 0px rgba(255 ,255, 255, 0.66);
}

.product .prod-header {
    flex: 1;
}

.product .prod-body {
    flex: 4;
    padding: 16px;
}

.product .prod-price {
    padding: 16px; 
    font-size: 20px;
    font-weight: 900;
}

.product .prod-thumbnail {
    background-color: var(--white-5a);
    border-top-left-radius: 24px;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    width: 100%;
}

.product img {
    max-width: 144px;
    height: 100%;
    object-fit: cover;
    border-top-left-radius: 24px;
}

.product img.no-img {
    opacity: 0.2;
    width: 66%;
    height: 66%;
}

.prod-description {
    font-size: 14px;
    line-height: 16px;
}

.prod-heading .title {
    font-size: 20px;
    font-weight: 600;
    background: var(--gradient-angle);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.prod-count, .location-icon {
    opacity: 0.33;
}

.prod-location .location-icon {
    font-size: 24px;
}

a.product:hover {
    color: var(--white);
}
</style>