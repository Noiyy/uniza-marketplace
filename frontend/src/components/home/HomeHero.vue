<template>
    <section id="hero" class="d-flex flex-column">
        <!-- <Header></Header> -->
        
        <div class="container d-flex flex-column flex-1">
            <div class="content d-flex flex-column flex-1">

                <div class="hero-content d-flex flex-1 flex-column justify-content-center align-items-center text-center">
                    
                    <div class="hero-grid">
                        <router-link :to="`/browse?ctg=${'clothing'}`"
                            class="item animate black d-flex flex-column align-items-end text-end justify-content-center gap-8">
                            <div>
                                <h1> Books </h1>
                                <p> fiction, textbooks, homemade ... </p>
                            </div>
                            <img :src="getAssetUrl('img/books-min.png')" alt="">
                        </router-link>
                        <router-link :to="`/browse?ctg=${'tickets'}`"
                            class="item animate full d-flex flex-column align-items-center justify-content-center gap-8">
                            <div>
                                <h1> Tickets </h1>
                                <p> plane tickets, festivals ... </p>
                            </div>
                            <img :src="getAssetUrl('img/tickets-min.png')" alt="">
                        </router-link>
                        <router-link :to="`/browse?ctg=${'services'}`"
                            class="item animate black d-flex align-items-center justify-content-left gap-8">
                            <div>
                                <h1> Pc & phone </h1>
                                <p> laptops, mouses ... </p>
                            </div>
                            <img :src="getAssetUrl('img/pc-min.png')" alt="">
                        </router-link>

                        <router-link :to="`/browse?ctg=${'music'}`"
                            class="item animate full d-flex align-items-center">
                            <div class="info">
                                <h1> Music </h1>
                                <p> drums, keyboard ... </p>
                            </div>
                            <img :src="getAssetUrl('img/music-min.png')" alt="">
                        </router-link>
                        <div class="item mid d-flex flex-column justify-content-center align-items-center">
                            <h1> {{ soldProductsCount }} </h1>
                            <p> Products sold </p>
                            <img :src="getAssetUrl('img/logo-sm_dark.svg')" alt="UNIZA Marketplace logo">
                        </div>
                        <router-link :to="`/browse?ctg=${'electronics'}`"
                            class="item animate full d-flex align-items-center justify-content-between gap-16">
                            <div class="text-left">
                                <h1> Electronics </h1>
                                <p> microwaves, refrigerators ... </p>
                            </div>
                            <img :src="getAssetUrl('img/electro-min.png')" alt="">
                        </router-link>

                        <router-link :to="`/browse?ctg=${'books'}`"
                            class="item animate full d-flex justify-content-center align-items-center">
                            <div class="">
                                <h1> Clothing </h1>
                                <p> footwear, accessories ... </p>
                            </div>
                            <img :src="getAssetUrl('img/clothing-min.png')" alt="">
                        </router-link>
                        <router-link :to="`/browse?ctg=${'furniture'}`"
                            class="item animate black d-flex flex-column-reverse align-items-center justify-content-center">
                            <div>
                                <h1> Furniture </h1>
                                <p> chairs, tables, drawers ... </p>
                            </div>
                            <img :src="getAssetUrl('img/furniture-min.png')" alt="">
                        </router-link>
                        <router-link :to="`/browse?ctg=${'pcPhone'}`"
                            class="item animate white d-flex align-items-center">
                            <div class="text-left">
                                <h1> Services </h1>
                                <p> tutoring, accomodation ... </p>
                            </div>
                            <img :src="getAssetUrl('img/services-min.png')" alt="">
                        </router-link>
                    </div>

                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Header from '../Header.vue';
import { mapGetters, mapActions } from 'vuex';

import { Icon } from '@iconify/vue';

export default {
    name: 'HomeHero',

    inject: ['axios', 'emitter', 'productApi'],
    emits: [],

    props: {

    },

    components: {
        Header,
        Icon
    },

    data() {
        return {
            patternImgSrc: this.getAssetUrl("img/noise_texture.png"),
            soldProductsCount: 0
        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),

        async getSoldProductsCount() {
            const resp = await this.productApi.getAllSales();
            const sales = resp.data;
            if (sales && sales.length) {
                this.soldProductsCount = sales.reduce((acc, sale) => acc + sale.count, 0);
            }
        }
    },
    
    computed: {
        ...mapGetters(
            {

            }
        ),

        patternBgStyle() {
            return `
                background: url(${this.patternImgSrc}) 0% 0% / 1000px 1000px repeat`;
        }
    },

    created() {
        this.getSoldProductsCount();
    },

    mounted() {

    }
}
</script>

<style scoped>
#hero {
    min-height: 82vh;
    min-height: 82svh;
}

.hero-grid {
    width: 100%;
    height: 70vh; /* 550px */
    display: grid;
    gap: 1.5vw;
    padding: 1vw;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: auto;
    grid-template-areas:
        "first first first second second  third   third    third third"
        "first first first second second  third   third    third third"
        "first first first mid    mid     mid     fourth fourth fourth"
        "fifth fifth fifth mid    mid     mid     fourth fourth fourth"
        "fifth fifth fifth mid    mid     mid     fourth fourth fourth"
        "sixth sixth sixth sixth  seventh seventh fourth fourth fourth"
        "sixth sixth sixth sixth  seventh seventh eighth eighth eighth"
        "sixth sixth sixth sixth  seventh seventh eighth eighth eighth"
        "sixth sixth sixth sixth  seventh seventh eighth eighth eighth"
        ;

}

.hero-grid .item {
    border-radius: 24px;
    position: relative;
    color: var(--white);
    padding: 16px;
    transition: transform 0.2s ease-out, filter 0.2s ease-out;
    overflow: hidden;
}
.hero-grid .item.animate:hover {
    cursor: pointer;
    transform: scale(1.1, 1.1);
    /* filter: drop-shadow(0px 0px 10px #fff); */
    z-index: 5;
    -webkit-box-shadow: 0px 0px 8px 0px rgba(255,255,255,1);
    -moz-box-shadow: 0px 0px 8px 0px rgba(255,255,255,1);
    box-shadow: 0px 0px 8px 0px rgba(255,255,255,1);
}

.hero-grid img {
    position: absolute;
    top: 0;
    left: 0;
    max-width: 100%;
    max-height: 100%;
    z-index: 1;
}

.hero-grid .item h1, .hero-grid .item p {
    z-index: 2;
    position: relative;
    text-shadow: 
    1px 1px 0 black, 
    -1px 1px 0 black, 
    1px -1px 0 black, 
    -1px -1px 0 black;
    filter: drop-shadow(0px 0px 1.8px #000);
}

.hero-grid .item h1 {
    text-transform: uppercase;
    font-weight: 900;
    font-size: 2rem;
}

.hero-grid .item p {
    font-weight: 500;
}

.hero-grid .item:nth-child(1) { grid-area: first; }
.hero-grid .item:nth-child(2) { grid-area: second; }
.hero-grid .item:nth-child(3) { grid-area: third; }
.hero-grid .item:nth-child(4) { grid-area: fourth; }
.hero-grid .item:nth-child(5) { grid-area: mid; }
.hero-grid .item:nth-child(6) { grid-area: fifth; }
.hero-grid .item:nth-child(7) { grid-area: sixth; }
.hero-grid .item:nth-child(8) { grid-area: seventh; }
.hero-grid .item:nth-child(9) { grid-area: eighth; }

.hero-grid .item:nth-child(1) img {
    transform: scale(1.2);
}
.hero-grid .item:nth-child(2) img {
    
}
.hero-grid .item:nth-child(3) img {
    right: 20%;
    left: initial;
    transform: scale(1.7);
}
.hero-grid .item:nth-child(4) img {
    object-position: 50% 40%;
}
.hero-grid .item:nth-child(6) img {
    object-position: 50% 85%;
}
.hero-grid .item:nth-child(7) img {

}
.hero-grid .item:nth-child(8) img {
    width: 100%;
    top: 24px;
}
.hero-grid .item:nth-child(9) img {
    transform: scale(1.1);
    width: 100%;
    height: 100%;
    top: 24px;
}

.hero-grid .item:nth-child(1) .icon {
    font-size: 64px;
}

.hero-grid .item.mid img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: auto;
    height: 80%;
    opacity: 0.2;
    user-drag: none;
    -webkit-user-drag: none;
}

.hero-grid .item.mid h1 {
    font-weight: 700;
    background: var(--gradient-angle);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    z-index: 1;
    text-shadow: initial;
}

.hero-grid .item.mid p {
    text-transform: uppercase;
}

.hero-grid .black { background: linear-gradient(288deg, rgba(240, 237, 234, 0.05) 0%, rgba(240, 237, 234, 0.15) 100%); }
.hero-grid .white { background: linear-gradient(288deg, rgba(240, 237, 234, 0.66) 0%, rgba(240, 237, 234, 1) 100%); }
.hero-grid .full {  }
.hero-grid .full img { 
    border-radius: 24px;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero-grid .pattern .above-glass {
    position: relative;
    z-index: 2;
}

.hero-grid .pattern .glass {
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    border-radius: 24px;
}

.hero-grid .pattern .glass::before {
    border-radius: 24px;
    content: "";
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    background: linear-gradient(288deg, rgba(240, 237, 234, 0.6) 0%, rgb(240, 237, 234, 1) 100%);
    backdrop-filter: blur(20px);
}

.hero-grid .item:nth-child(2) .icon {
    font-size: 96px;
    opacity: 0.15;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(15deg);
}
.hero-grid .item:nth-child(2) h1 {
    font-size: 24px;
}
.hero-grid .item:nth-child(2) p {
    font-size: 15px;
}

.hero-grid .item:nth-child(3) .icon {
    font-size: 72px;
}

.hero-grid .item:nth-child(4) .icon {
    font-size: 25vh;
    opacity: 0.2;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.hero-grid .item:nth-child(4) .info {
    margin-left: 16px;
}

.hero-grid .item:nth-child(6) .icon {
    font-size: 48px;
}
.hero-grid .item:nth-child(6) h1 {
    font-size: 24px;
}
.hero-grid .item:nth-child(6) p {
    font-size: 15px;
}

.hero-grid .item:nth-child(7) .icon {
    font-size: 96px;
    transform: rotate(-33deg);
}
.hero-grid .item:nth-child(7) h1 {
    font-size: 36px;
}

.hero-grid .item:nth-child(8) .icon {
    font-size: 72px;
}
.hero-grid .item:nth-child(8) h1 {
    font-size: 24px;
}
.hero-grid .item:nth-child(8) p {
    font-size: 14px;
}

.hero-grid .item:nth-child(9) .icon {
    font-size: 64px;
}
.hero-grid .item:nth-child(9) h1 {
    font-size: 26px;
}

/* @media screen and (max-width: 1000px) {
  .hero-grid {
    grid-template-columns: repeat(6, 1fr);
    grid-template-areas:
        ""
        ;
  }
}

@media screen and (max-width: 750px) {
  .hero-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas:
        ""
        ;
  }
} */
</style>