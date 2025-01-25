<template>
    <div class="home-content content-wrapper">
        <HomeHero></HomeHero>

        
        <div class="container">
            <div class="under-hero">
                <div class="content d-flex justify-content-around align-items-center">
                    <div class="pattern" :style="patternBgStyle"></div>

                    <div class="left d-flex flex-column align-items-center gap-16">
                        <button class="btn"> browse </button>
                        171 products sold in last 96 hours
                    </div>
    
                    <div class="mid d-flex flex-column align-items-center gap-16">
                        frequently asked questions
                        <button class="btn"> faq </button>
                    </div>
    
                    <div class="right d-flex flex-column align-items-center gap-16">
                        <button class="btn"> support </button>
                        contact us in case of need
                    </div>
                </div>
            </div>
        </div>
    
        <Footer></Footer>
    </div>
</template>

<script>
import Footer from '../Footer.vue'
import HomeHero from './HomeHero.vue';
// import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'HomeContent',

    inject: ['axios', 'emitter'],
    emits: [],

    props: {

    },

    components: {
        HomeHero,
        Footer
    },

    data() {
        return {
            patternImgSrc: this.getAssetUrl("img/noise_texture.png"),
        }
    },

    methods: {
        // ...mapActions(
        //     {

        //     }
        // ),
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
</style>