<template>
    <div class="faq-content content-wrapper">
        <Header></Header>

        <section id="faq">
            <div class="container">
                <div class="content">

                    <div class="faq-wrapper d-flex flex-column gap-40">
                        <div class="question d-flex flex-column gap-24" v-for="(question, index) in questions" :key="index">

                            <a role="button" class="heading d-flex flex-column gap-8" 
                                @click="question.shown = !question.shown" :class="question.shown ? 'collapseShown' : ''"
                                data-bs-toggle="collapse" :href="`#questionCollapse${index}`" aria-expanded="false" :aria-controls="`questionCollapse${index}`">
                                <div class="heading-content d-flex justify-content-between align-items-center gap-16">
                                    <div class="title">
                                        <h2> {{ question.title }} </h2>
                                    </div>
                                    <div class="chevron-icon-cont">
                                        <Icon icon="mdi:chevron-down" class="chevron-icon" />
                                    </div>
                                </div>

                                <div class="heading-divider"></div>
                            </a>
                            <div class="body collapse" :id="`questionCollapse${index}`">
                                <template  v-for="(answer, index) in question.answers" :key="index">
                                    <p> {{ answer }} </p>
                                    <br v-if="index < question.answers.length-1">
                                </template>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>

        <Footer></Footer>
    </div>
</template>

<script>
import Header from '../Header.vue';
import Footer from '../Footer.vue';
import { Icon } from '@iconify/vue';

import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'FAQContent',

    inject: ['emitter'],
    emits: [],

    props: {

    },

    components: {
        Header,
        Footer,
        Icon
    },

    data() {
        return {
            questions: [
                {
                    title: "Ako funguje predávanie produktov?",
                    shown: false,
                    answers: [
                        "abcd",
                        "efgh"
                    ]
                },
                {
                    title: "Ako funguje kupovanie produktov?",
                    shown: false,
                    answers: [
                        "abcd"
                    ]
                },
                {
                    title: "Ako funguje počet pri produktoch?",
                    shown: false,
                    answers: [
                        "abcd"
                    ]
                }
            ]
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
#faq {
    margin-top: 72px;
    min-height: initial;
}

.heading-divider {
    width: 100%;
    height: 1px;
    background-color: var(--white-15a);
}

.title h2 {
    font-size: 20px;
    font-weight: bold;
}

.chevron-icon-cont {
    font-size: 32px;
    transition: transform 0.2s ease-out;
}

.collapseShown .chevron-icon-cont {
    transform: rotate(180deg);
}
</style>