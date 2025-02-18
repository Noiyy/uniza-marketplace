<template>
    <div class="error-content d-flex flex-1 flex-column justify-content-between">
        <div class="error-content-wrapper d-flex flex-column flex-1">
            <Header></Header>
        
            <section id="error-section" class="d-flex flex-1 justify-content-center align-items-center text-center">
                <div class="container">
                    <div class="content">
                        <h1 class="section-heading"> <span> {{ errorCode }} </span> {{ errorTitle }} </h1>
                        <div class="d-flex justify-content-center">
                            <button class="btn primary" @click="$router.back()"> 
                                {{ $t("Back") }}
                            </button>
                        </div>

                        <div class="img-cont-error">
                            <Icon :icon="errorIcon" />
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
            title: `Error - UNIZA Marketplace`,
            meta: [
                { name: "robots", content: "noindex, nofollow" },
            ]
        }
    },

    name: "ErrorView",
    
    components: {
        Header,
        Footer,

        Icon
    },

    props: {
        errorCode: {
            type: String,
            required: true
        },

        errorTitle: {
            type: String,
            required: true
        },

        errorIcon: {
            type: String,
            required: true
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

#error-section {
    position: relative;
}

.img-cont-error {
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
    .img-cont-error {
        font-size: 160px;
    }
}

/* MEDIUM - Tablet */
@media(min-width: 641px) and (max-width: 992px) { 
    .img-cont-error {
        font-size: 256px;
    }
}
</style>