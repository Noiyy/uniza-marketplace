<template>
    <div class="error-content d-flex flex-1 flex-column justify-content-between">
        <div class="error-content-wrapper d-flex flex-column flex-1">
            <Header></Header>
        
            <section id="error-404" class="d-flex flex-1 justify-content-center align-items-center text-center">
                <div class="container">
                    <div class="content">
                        <h1 class="section-heading"> <span>404</span> Page not found </h1>
                        <div class="d-flex justify-content-center">
                            <button class="btn primary" @click="$router.back()"> 
                                {{ $t("Back") }}
                            </button>
                        </div>

                        <div class="img-cont-404">
                            <Icon icon="game-icons:capybara" class="capy-icon" />
                        </div>
                    </div>
                </div>
            </section>

            <Footer></Footer>
        </div>
    </div>
</template>

<script>
import Header from '../src/components/Header.vue';
import Footer from '../src/components/Footer.vue';

import { Icon } from '@iconify/vue';

export default {
    head() {
        return {
            title: `404 - UNIZA Marketplace`,
            meta: [
                { name: "robots", content: "noindex, nofollow" },
            ]
        }
    },

    name: "404-PageNotFound",

    inject: ['axios', 'emitter'],

    components: {
        Header,
        Footer,

        Icon
    },

    data() {
        return {

        }
    },
}
</script>

<style scoped>
.error-content {
    min-height: 100vh;
    min-height: 100svh;
}

h1 span {
    color: var(--primary);
}

.section-heading {
    margin-bottom: 16px;
}

p {
    font-size: 18px;
}

h4 {
    margin-bottom: 16px;
}

#error-404 {
    position: relative;
}

.img-cont-404 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.15;
    font-size: 320px;
    color: var(--primary);
    z-index: -1;
}

footer {
    margin-top: 32px;
}

/* SMALL - Mobile */
@media(max-width: 640px) { 
    .img-cont-404 {
        font-size: 160px;
    }
}

/* MEDIUM - Tablet */
@media(min-width: 641px) and (max-width: 992px) { 
    .img-cont-404 {
        font-size: 256px;
    }
}
</style>