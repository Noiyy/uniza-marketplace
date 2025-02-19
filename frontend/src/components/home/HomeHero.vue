<template>
    <section id="hero" class="d-flex flex-column">
        <Header></Header>
        
        <div class="container d-flex flex-column flex-1">
            <div class="content d-flex flex-column flex-1">

                <div class="hero-content d-flex flex-1 flex-column justify-content-center align-items-center text-center">
                    
                    <div class="hero-grid">
                        <div class="item animate gradient-straight d-flex flex-column align-items-center justify-content-center gap-8">
                            <div>
                                <h1> Clothing </h1>
                                <p> footwear, accessories ... </p>
                            </div>
                            <Icon icon="lsicon:clothes-filled" class="icon" />
                        </div>
                        <div class="item animate pattern d-flex flex-column align-items-center justify-content-center gap-8">
                            <div class="glass" :style="patternBgStyle"></div>
                            <div class="above-glass">
                                <div>
                                    <h1> Tickets </h1>
                                    <p> plane tickets, festivals ... </p>
                                </div>
                                <Icon icon="mdi:ticket" class="icon" />
                            </div>
                        </div>
                        <div class="item animate secondary d-flex align-items-center justify-content-around gap-8">
                            <div>
                                <h1> Services </h1>
                                <p> tutoring, accomodation ... </p>
                            </div>
                            <Icon icon="ri:service-fill" class="icon" />
                        </div>

                        <div class="item animate gradient-angle d-flex align-items-center">
                            <div class="info">
                                <h1> Music </h1>
                                <p> drums, keyboard ... </p>
                            </div>
                            <Icon icon="tdesign:music-filled" class="icon" />
                        </div>
                        <div class="item mid d-flex flex-column justify-content-center align-items-center">
                            <h1> 621817 </h1>
                            <p> Products sold </p>
                            <img :src="getAssetUrl('img/logo-sm_dark.svg')" alt="UNIZA Marketplace logo">
                        </div>
                        <div class="item animate secondary d-flex align-items-center justify-content-between gap-16">
                            <div class="text-left">
                                <h1> Electronics </h1>
                                <p> microwaves, refrigerators ... </p>
                            </div>
                            <Icon icon="material-symbols:microwave" class="icon" />
                        </div>

                        <div class="item animate pattern d-flex">
                            <div class="glass" :style="patternBgStyle"></div>
                            <div class="above-glass d-flex flex-row-reverse justify-content-around flex-1">
                                <div class="text-left">
                                    <h1> Books </h1>
                                    <p> fiction, textbooks, homemade ... </p>
                                </div>
                                <Icon icon="ic:baseline-book" class="icon" />
                            </div>
                        </div>
                        <div class="item animate primary d-flex flex-column-reverse align-items-center justify-content-center">
                            <div>
                                <h1> Furniture </h1>
                                <p> chairs, tables, drawers ... </p>
                            </div>
                            <Icon icon="material-symbols:chair" class="icon" />
                        </div>
                        <div class="item animate pattern d-flex align-items-center">
                            <div class="glass" :style="patternBgStyle"></div>
                            <div class="above-glass d-flex flex-column flex-1">
                                <div class="text-left">
                                    <h1> PC & Phone  </h1>
                                    <p> laptops, mouses ... </p>
                                </div>
                                <div class="icon-cont d-flex justify-content-end">
                                    <Icon icon="icon-park-solid:laptop" class="icon" />
                                </div>
                            </div>
                        </div>
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

    inject: ['axios', 'emitter'],
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

        patternBgStyle() {
            return `
                background: url(${this.patternImgSrc}) 0% 0% / 1000px 1000px repeat`;
        }
    },

    created() {

    },

    mounted() {

    }
}
</script>

<style scoped>
.hero-grid {
    width: 100%;
    height: 550px;
    display: grid;
    gap: 1.5vw;
    padding: 1vw;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: auto;
    grid-template-areas:
        "first first first second second third third third third"
        "first first first second second third third third third"
        "first first first mid mid mid fourth fourth fourth"
        "fifth fifth fifth mid mid mid fourth fourth fourth"
        "fifth fifth fifth mid mid mid fourth fourth fourth"
        "sixth sixth sixth sixth seventh seventh fourth fourth fourth"
        "sixth sixth sixth sixth seventh seventh eighth eighth eighth"
        "sixth sixth sixth sixth seventh seventh eighth eighth eighth"
        "sixth sixth sixth sixth seventh seventh eighth eighth eighth"
        ;

}

.hero-grid .item {
    border-radius: 24px;
    position: relative;
    color: var(--black);
    padding: 16px;
    transition: transform 0.2s ease-out, filter 0.2s ease-out;
}
.hero-grid .item.animate:hover {
    cursor: pointer;
    transform: scale(1.1, 1.1);
    filter: drop-shadow(0px 0px 10px #000000);
    z-index: 5;
}

.hero-grid .item h1 {
    text-transform: uppercase;
    font-weight: 900;
    font-size: 2rem;
}

.hero-grid .item p {
    font-weight: 500;
}

.hero-grid .item:nth-child(1) {
    grid-area: first;
}
.hero-grid .item:nth-child(2) {
    grid-area: second;
}
.hero-grid .item:nth-child(3) {
    grid-area: third;
}
.hero-grid .item:nth-child(4) {
    grid-area: fourth;
}
.hero-grid .item:nth-child(5) {
    grid-area: mid;
    color: var(--white);
}
.hero-grid .item:nth-child(6) {
    grid-area: fifth;
}
.hero-grid .item:nth-child(7) {
    grid-area: sixth;
}
.hero-grid .item:nth-child(8) {
    grid-area: seventh;
}
.hero-grid .item:nth-child(9) {
    grid-area: eighth;
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
}

.hero-grid .gradient-straight { background: var(--gradient-straight); }
.hero-grid .gradient-angle { background: var(--gradient-angle); }
.hero-grid .primary { background: var(--primary); }
.hero-grid .secondary { background: var(--secondary); }
/* .hero-grid .pattern { background: var(--white); } */

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
    margin-top: 32px;
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