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
                                {{ ctg.name == "allProducts" ? $t('AllProducts') : $t(`ctg_${ctg.name}`) }}

                                <div class="sub-categories d-flex flex-column gap-8" v-if="ctg.showSub">
                                    <div class="sub-category category" v-for="subCtg in ctg.subCategories" :key="subCtg.name" @click="(e) => chooseCategory(e, subCtg, false)"
                                        :class="subCtg.active ? 'active' : ''">
                                        {{ $t(`ctg_${subCtg.name}`) }}
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <div class="results d-flex flex-column gap-40 flex-1">
                            <div class="results-header d-flex flex-column gap-8">
                                <div class="content d-flex justify-content-between">
                                    <div class="info d-flex flex-column">
                                        <div class="breadcrumbs d-flex gap-8" v-if="selectedSearchCategory && selectedSearchCategory._id">
                                            <span> {{ $t(`ctg_${selectedMainCtg}`) }} </span>
                                            <span v-if="selectedSubCtg"> > </span>
                                            <span v-if="selectedSubCtg"> {{ $t(`${selectedSubCtg}`) }} </span>
                                        </div>
                                        <div class="heading d-flex align-items-center gap-16">
                                            <h2> {{ getSearchTitle }} </h2>
                                            <span class="result-count"> {{ sortedProducts.length }} </span>
                                        </div>
                                    </div>

                                    <div class="options d-flex gap-64 align-items-center">
                                        <div class="filters">
                                            <ItemsSorter
                                                :option-callback="selectSortFilter"
                                                :selected-sort-filter="selectedSortFilter"
                                                :show-special-prices="true"
                                            ></ItemsSorter>
                                        </div>

                                        <div class="result-views d-flex gap-8">
                                            <div class="view-icon-cont" :class="activeViewType == 'grid' ? 'active' : ''"
                                                @click="activeViewType = 'grid'">
                                                <Icon icon="mingcute:grid-fill" class="view-icon" />
                                            </div>
                                            <div class="view-icon-cont" :class="activeViewType == 'list' ? 'active' : ''"
                                                @click="activeViewType = 'list'">
                                                <Icon icon="ph:rows-fill" class="view-icon" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="line-divider"></div>
                            </div>
                            <div class="results-content">
                                <ProductsList
                                    :products="sortedProducts"
                                    :active-view-type="activeViewType"
                                ></ProductsList>
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
import ItemsSorter from '../ItemsSorter.vue';
import ProductsList from './ProductsList.vue';

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
        ItemsSorter,
        ProductsList,
        Icon
    },

    data() {
        return {
            categories: [],
            products: [],
            sortedProducts: [],
            filteredProducts: [],

            sortFiltersOpened: false,
            selectedSortFilter: "latest",

            activeViewType: "list",

            selectedMainCtg: null,
            selectedSubCtg: null,

            selectedSearchCategory: null,
            selectedPriceRange: [0, 9999],
            selectedLocation: null,
            searchQuery: "",
        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),

        chooseCategory(event, category, isMain) {
            this.selectedSubCtg = null;
            this.selectedMainCtg = null;

            if (!isMain) {
                if (event) {
                    event.stopPropagation();
                    event.preventDefault();
                }
                this.selectedSubCtg = category.name;
            } else this.selectedMainCtg = category.name;

            this.selectedSearchCategory = { name: category.name, _id: category._id };

            this.categories.forEach(ctg => {
                ctg.showSub = false
                ctg.active = false;
                ctg.subCategories.forEach(sCtg => {
                    sCtg.active = false;

                    if (category.parentName === ctg.name) {
                        this.selectedMainCtg = ctg.name;
                        ctg.showSub = true;
                    }
                });
            });
            if (isMain && category && category.id !== "all") category.showSub = !category.showSub;
            else if (isMain) {
                // all products

            }

            category.active = true;
            if (this.selectedSubCtg) {
                this.categories.forEach((ctg, indx) => {
                    let c = ctg.subCategories.find(sCtg => sCtg.name == category.name);
                    let subIndx = ctg.subCategories.findIndex(sCtg => sCtg.name == category.name);
                    if (c) {
                        this.categories[indx].subCategories[subIndx] = {
                            ...this.categories[indx].subCategories[subIndx],
                            active: true
                        }
                    }
                });
            }

            this.filteredProducts = this.filterProducts(this.products, this.searchQuery, this.selectedSearchCategory, this.selectedPriceRange, this.selectedLocation);
            this.sortedProducts = this.sortProducts(this.filteredProducts, this.selectedSortFilter);
        },

        async getProducts() {
            const resp = await this.productApi.getAllProducts();

            this.products = resp.data;
            console.log("all products", resp.data);
            this.filteredProducts = this.filterProducts(this.products, this.searchQuery, this.selectedSearchCategory, this.selectedPriceRange, this.selectedLocation);
            this.sortedProducts = this.sortProducts(this.filteredProducts, this.selectedSortFilter);
        },

        toggleSortFilterDropdown(e) {
            if (e.target.classList.contains("option") || e.target.classList.contains("chevron-icon") ||
                e.target.classList.contains("selected") || e.target.classList.contains("sort-icon") ||
                e.target.classList.contains("sort-filters")) {
                this.sortFiltersOpened = !this.sortFiltersOpened;
            }
        },

        selectSortFilter(fltr) {
            this.selectedSortFilter = fltr.id;
            this.filteredProducts = this.filterProducts(this.products, this.searchQuery, this.selectedSearchCategory, this.selectedPriceRange, this.selectedLocation);
            this.sortedProducts = this.sortProducts(this.filteredProducts, this.selectedSortFilter);
        },

        getSearchOptions() {
            const data = this.getBrowseOptions;
            this.selectedSearchCategory = data.category;
            this.selectedPriceRange = data.priceRange;
            this.selectedLocation = data.location;
            this.searchQuery = data.searchQuery;

            if (this.selectedSearchCategory) {
                this.selectedMainCtg = data.category.parentName ? data.category.parentName : data.category.name;
                if (data.category.parentName) this.selectedSubCtg = data.category.name;
            }

            this.categories = this.transformCategories(this.getAllCategories, this.selectedSearchCategory);
        },

        findCategory(name) {
            let activeCtg = this.categories.find(ctg => ctg.name == name);
            if (!activeCtg) {
                this.categories.forEach(ctg => {
                    const c = ctg.subCategories.find(sCtg => sCtg.name == name);
                    if (c) activeCtg = c;
                });
            }
            return activeCtg;
        }
    },
    
    computed: {
        ...mapGetters(
            {
                getAllCategories: "product/getAllCategories",
                getBrowseOptions: "browse/getBrowseOptions"
            }
        ),

        getSearchTitle() {
            if (this.searchQuery) return `"${this.searchQuery}"`;
            else if (this.selectedSearchCategory) return this.selectedSearchCategory.name.toUpperCase();
            else return this.$t("AllProducts").toUpperCase();
        },

        queryCtg() {
            return this.$route.query.ctg;
        }
    },

    created() {
        this.getSearchOptions();
        console.log("ctg?", this.getAllCategories);

        if (this.queryCtg) {
            let activeCtg = this.findCategory(this.queryCtg);
            console.log("ale jak toto može spraviť dpč", this.queryCtg);
            this.chooseCategory(null, activeCtg, activeCtg.parentName ? false : true);
        }
    },

    async mounted() {
        this.emitter.emit("show-loader");
        await this.getProducts();

        this.emitter.on("check-browse-filters", (e) => {
            const sortFiltersEl = document.querySelector('.sort-filters');
            const optionsEls = document.querySelectorAll('.option');
            const selectedContEl = document.querySelector('.selected-cont');

            if (!sortFiltersEl.contains(e.target) &&
                !Array.from(optionsEls).some(option => option.contains(e.target)) &&
                !selectedContEl.contains(e.target)
            ) {
                this.sortFiltersOpened = false;
            }
        });

        this.emitter.on("do-search", () => {
            this.emitter.emit("show-loader");

            this.getSearchOptions();
            this.filteredProducts = this.filterProducts(this.products, this.searchQuery, this.selectedSearchCategory, this.selectedPriceRange, this.selectedLocation);
            this.sortedProducts = this.sortProducts(this.filteredProducts, this.selectedSortFilter);
            
            this.emitter.emit("hide-loader");
        });

        this.emitter.emit("hide-loader");
    },

    unmounted() {
        this.emitter.off("check-browse-filters");
        this.emitter.off("do-search");
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
    margin-top: 48px;
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

.results-header .heading h2 {
    font-size: 20px;
    font-weight: 900;
    line-height: 16px;
}

.results-header .heading .result-count {
    border-radius: 8px;
    background-color: var(--white-5a);
    padding: 4px 16px;
    color: var(--white-50a);
    font-size: 14px;
    font-weight: bold;
}

.results-header .info {
    gap: 4px;
}
</style>