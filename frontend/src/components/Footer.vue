<template>
    <footer>
        <div class="upper-content">
            <div class="pattern" :style="patternBgStyle"></div>

            <div class="container d-flex">
                <div class="left d-flex flex-column gap-24">
                    <a href="/"> <img :src="getAssetUrl('img/logo-w_dark.svg')" alt="UNIZA Marketplace logo"> </a> 
                    <div class="socials d-flex gap-16">
                        <a href=""> <Icon icon="ic:baseline-facebook" class="social-icon fb" /> </a>
                        <a href=""> <Icon icon="ri:instagram-fill" class="social-icon ig" /> </a>
                        <a href=""> <Icon icon="ri:twitter-x-fill" class="social-icon x" /> </a>
                    </div>
                </div>
                <div class="right d-flex flex-column gap-32 montserrat">
                    <p> {{ $t('CustomerService').toUpperCase() }} </p>
                    <div class="info-links d-flex">
                        <div class="left-col d-flex flex-column">
                            <router-link to="/chat/system"> {{ $t('Notifications') }} </router-link>
                            <router-link to="/faq"> FAQ </router-link>
                            <a href=""> {{ $t('Terms') }} </a>
                            <a href=""> {{ $t('Collaboration') }} </a>
                        </div>
                        <div class="right-col d-flex flex-column">
                            <a href=""> {{ $t('AboutUs') }} </a>
                            <a href=""> {{ $t('DataPrivacy') }} </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="lower-content">
            <div class="container d-flex flex-column gap-16 align-items-center">
                <p> &copy; UNIZA Marketplace 2025, {{ $t('FooterCopy').toLowerCase() }}. </p>
                <a href="https://noiyy.eu/" target="_blank" class="montserrat"> {{ $t('MadeBy').toLowerCase() }} Noiyy<Icon icon="prime:arrow-up-right" class="arrow-icon" /> </a>
            </div>
        </div>
    </footer>
</template>

<script>
// import { mapGetters, mapActions } from 'vuex';
import { Icon } from '@iconify/vue';

export default {
    name: 'Footer',

    inject: ['axios', 'emitter'],
    emits: [],

    props: {

    },

    components: {
        Icon
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
footer {
    margin-top: 172px;
}

.upper-content {
    padding: 48px 0;
    position: relative;
}

.upper-content .pattern {
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}
.upper-content .pattern::before {
    content: "";
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    background: rgba(26, 21, 18, 0.97);
    backdrop-filter: blur(20px);
}

.upper-content .container {
    column-gap: 120px;
    position: relative;
    z-index: 2;
}

.upper-content .left {
    flex: 1.1;
}

.upper-content .right {
    flex: 3;
    font-weight: 400;
    line-height: normal;
}

.upper-content .right p {
    font-weight: 600;
    opacity: 0.66;
    text-transform: uppercase;
}

.upper-content .right .info-links {
    gap: 24px;
}

.upper-content .right .info-links > div {
    gap: 4px;
    flex: 1;
}

.upper-content .right a {
    transition: color 0.15s ease-out;
}

.upper-content .right a:hover {
    color: var(--secondary);
}

.upper-content .socials {
    font-size: 24px;
}

.upper-content .socials .social-icon {
    opacity: 0.33;
    transition: color 0.2s ease-out, opacity 0.2s ease-out;
}

.upper-content .socials .fb:hover {
    opacity: 1;
    color: #1877F2;
}

.upper-content .socials .ig:hover {
    opacity: 1;
    color: #E1306C;
}

.upper-content .socials .x:hover {
    opacity: 1;
    color: white;
}

.lower-content {
    padding: 24px 0;
}

.lower-content p {
    line-height: 16px;
}

.lower-content a {
    font-style: normal;
    font-weight: 300;
    letter-spacing: 16.64px;
    opacity: 0.33;
    cursor: pointer;
}

/* SMALL - Mobile */
@media(max-width: 640px) { 
    /* footer {
        margin-top: 64px;
    } */

    .upper-content .container {
        column-gap: 48px;
    }
}

/* MEDIUM - Tablet */
@media(min-width: 641px) and (max-width: 992px) { 

}
</style>