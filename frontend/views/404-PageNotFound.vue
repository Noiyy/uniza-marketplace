<template>
    <div class="error-content d-flex flex-1 flex-column justify-content-between">
        <div class="error-content-wrapper d-flex flex-column flex-1">
            <div class="container">
                <Header></Header>
            </div>
        
            <section id="error-404" class="d-flex flex-1 justify-content-center align-items-center text-center">
                <div class="container">
                    <div class="content">
                        <h1 class="section-heading"> <span>404</span> Page not found </h1>
                        <p> {{ $t("Err404Text1") }} </p>
                        <h4> {{ $t("Err404Text2") }} </h4>
                        <button class="btn btn-primary dark"
                            @click="$router.back()"> 
                            <Icon icon="iconamoon:arrow-left-2" />
                            {{ $t("Back") }}
                        </button>

                        <div class="img-cont-404">
                        </div>
                    </div>
                </div>
            </section>

            <Footer></Footer>
        </div>
    </div>
</template>

<script>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

import { useToast } from 'vue-toastification';
import { Icon } from '@iconify/vue';

export default {
    head() {
        return {
            title: `404 - UNIZA MARKETPLACE`,
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
            toast: useToast(),
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