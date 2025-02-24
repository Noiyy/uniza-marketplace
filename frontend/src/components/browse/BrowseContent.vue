<template>
    <div class="browse-content content-wrapper">
        <Header></Header>

        <section id="browse">
            <div class="container">
                <div class="content">

                    <div class="browse-wrapper d-flex">
                        <div class="categories d-flex flex-column">
                            <div class="main-category category" v-for="ctg in categories" :key="ctg.name" @click="(e) => chooseCategory(e, ctg, true)"
                                :class="ctg.active ? 'active' : ctg.subCategories.some(sCtg => sCtg.active) ? 'main-sub_active' : ''">
                                {{ ctg.name }}

                                <div class="sub-categories d-flex flex-column gap-8" v-if="ctg.showSub">
                                    <div class="sub-category category" v-for="subCtg in ctg.subCategories" :key="subCtg.name" @click="(e) => chooseCategory(e, subCtg, false)"
                                        :class="subCtg.active ? 'active' : ''">
                                        {{ subCtg.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <div class="results d-flex flex-column gap-40 flex-1">
                            <div class="results-header d-flex flex-column gap-8">
                                <div class="content d-flex justify-content-between">
                                    <div class="info">
                                        <div class="breadcrumbs">
                                            Clothing > Shirts
                                        </div>
                                        <div class="heading">
                                            SHIRTS
                                            <span class="result-count"> 201 </span>
                                        </div>
                                    </div>

                                    <div class="options d-flex gap-64 align-items-center">
                                        <div class="filters">
                                            f
                                        </div>

                                        <div class="result-views d-flex gap-8">
                                            <Icon icon="mingcute:grid-fill" class="view-icon" />
                                            <Icon icon="material-symbols:list" class="view-icon" />
                                        </div>
                                    </div>
                                </div>

                                <div class="line-divider"></div>
                            </div>
                            <div class="results-content">
                                <div class="products-wrapper d-flex flex-column gap-24">
                                    <ProductItem v-for="(prod, index) in products" :key="index"
                                        :prod-data="prod"
                                    ></ProductItem>
                                </div>
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
import ProductItem from './ProductItem.vue';

import { mapGetters, mapActions } from 'vuex';
import { Icon } from '@iconify/vue';

export default {
    name: 'BrowseContent',

    inject: ['emitter', 'productApi'],
    emits: [],

    props: {

    },

    components: {
        Header,
        Footer,
        ProductItem,
        Icon
    },

    data() {
        return {
            categories: [],
            products: []
        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),

        transformCategories(categories) {
            let mainCategories = [{
                name: "allProducts",
                id: "all",
                active: true
            }];
            mainCategories.push(...categories.filter(category => !category.parentName));

            // For each main category, find subcategories
            return mainCategories.map(mainCategory => {
                const subCategories = categories.filter(category => category.parentName === mainCategory.name);
                return { 
                    ...mainCategory, 
                    subCategories,
                    showSub: false 
                };
            });
        },

        chooseCategory(event, category, isMain) {
            if (!isMain) {
                event.stopPropagation();
                event.preventDefault();
            }

            this.categories.forEach(ctg => {
                ctg.showSub = false
                ctg.active = false;
                ctg.subCategories.forEach(sCtg => {
                    sCtg.active = false;

                    if (category.parentName === ctg.name) {
                        ctg.showSub = true;
                    }
                });
            });
            if (isMain && category && category.id !== "all") category.showSub = !category.showSub;
            else if (isMain) {
                // all products

            }

            category.active = true;
            console.log("u", this.categories);
        },

        async getProducts() {
            const resp = await this.productApi.getAllProducts();

            this.products = resp.data;
        }
    },
    
    computed: {
        ...mapGetters(
            {
                getAllCategories: "product/getAllCategories"
            }
        ),
    },

    created() {
        this.categories = this.transformCategories(this.getAllCategories);
        console.log("ctg?", this.categories);
    },

    async mounted() {
        this.emitter.emit("show-loader");
        await this.getProducts();
        this.emitter.emit("hide-loader");
    }
}
</script>

<style scoped>
.browse-wrapper {
    gap: 20px;
    margin-top: 72px;
}

.categories {
    gap: 12px;
    min-width: 150px;
}

.sub-category {
    margin-left: 32px;
}
.sub-category.active:hover {
    color: var(--white);
}

.sub-categories {
    margin-top: 8px;
}

.main-category.active, .main-category.main-sub_active {
    color: var(--secondary);
    font-weight: bold;
}

.category {
    position: relative;
    font-weight: initial;
    color: var(--white);
    text-transform: capitalize;
    cursor: pointer;
    transition: color 0.2s ease-in;
}
.category:hover {
    color: rgba(255, 255, 255, 0.75);
}

.category.active {
    font-weight: bold;
}
.main-category.active:hover, .main-category.main-sub_active:hover {
    color: var(--secondary);
}

.category.active::after {
    content: "";
    width: 8px;
    height: 16px;
    background: var(--gradient-angle);
    border-radius: 4px;
    position: absolute;
    left: -16px;
    top: 0;
}
</style>