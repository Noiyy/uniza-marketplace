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
                                    <div class="info d-flex flex-column">
                                        <div class="breadcrumbs d-flex gap-8" v-if="selectedSearchCategory">
                                            <a href="#"> Clothing </a>
                                            <span> > </span>
                                            <a href="#"> Shirts </a>
                                        </div>
                                        <div class="heading d-flex align-items-center gap-16">
                                            <h2> {{ getSearchTitle }} </h2>
                                            <span class="result-count"> {{ sortedProducts.length }} </span>
                                        </div>
                                    </div>

                                    <div class="options d-flex gap-64 align-items-center">
                                        <div class="filters">
                                            <div class="sort-filters pos-relative" :class="sortFiltersOpened ? 'open' : ''"
                                                @click="toggleSortFilterDropdown"
                                            >
                                                <div class="selected-cont d-flex gap-8">
                                                    <Icon icon="bx:sort" class="sort-icon" />
                                                    <div class="selected d-flex align-items-center">
                                                        {{ selectedSortFilter }}
                                                        <Icon icon="mdi:chevron-down" class="chevron-icon" />
                                                    </div>
                                                </div>
                                                <div class="filters-dropdown-content scrollbar">
                                                    <div class="option" v-for="fltr in sortFilters" :key="fltr.name"
                                                        :class="selectedSortFilter && selectedSortFilter == fltr.name ? 'selected' : ''"
                                                        @click="selectSortFilter(fltr)"> 
                                                        {{ fltr.name }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="result-views d-flex gap-8">
                                            <div class="view-icon-cont" :class="activeViewType == 'grid' ? 'active' : ''"
                                                @click="activeViewType = 'grid'">
                                                <Icon icon="mingcute:grid-fill" class="view-icon" />
                                            </div>
                                            <div class="view-icon-cont" :class="activeViewType == 'list' ? 'active' : ''"
                                                @click="activeViewType = 'list'">
                                                <Icon icon="material-symbols:list" class="view-icon" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="line-divider"></div>
                            </div>
                            <div class="results-content">
                                <div class="products-wrapper" :class="activeViewType == 'list' ? 'list' : 'grid'">
                                    <template v-for="(prod, index) in sortedProducts" :key="index">
                                        <ProductItem v-if="prod"
                                            :prod-data="prod"
                                            :view-type="activeViewType"
                                        ></ProductItem>
                                    </template>
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
            products: [],
            sortedProducts: [],

            sortFiltersOpened: false,
            sortFilters: [
                { name: "latest" },
                { name: "oldest" },
                { name: "minPrice" },
                { name: "maxPrice" }
            ],
            selectedSortFilter: "latest",

            activeViewType: "list",

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

        transformCategories(categories) {
            let mainCategories = [{
                name: "allProducts",
                id: "all",
                active: this.selectedSearchCategory ? false : true
            }];
            mainCategories.push(...categories.filter(category => !category.parentName));

            // For each main category, find subcategories
            return mainCategories.map(mainCategory => {
                const subCategories = categories.filter(category => category.parentName === mainCategory.name);
                return { 
                    ...mainCategory, 
                    subCategories,
                    showSub: mainCategory.name == this.selectedSearchCategory ? true : false,
                    active: mainCategory.name == this.selectedSearchCategory ? true : false
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
            console.log("all products", resp.data);
            this.sortProducts();
        },

        toggleSortFilterDropdown(e) {
            if (e.target.classList.contains("option") || e.target.classList.contains("chevron-icon") ||
                e.target.classList.contains("selected") || e.target.classList.contains("sort-icon") ||
                e.target.classList.contains("sort-filters")) {
                this.sortFiltersOpened = !this.sortFiltersOpened;
            }
        },

        selectSortFilter(fltr) {
            this.selectedSortFilter = fltr.name;
            this.sortProducts();
        },

        sortProducts() {
            this.sortedProducts = JSON.parse(JSON.stringify(this.products));
            if (this.selectedSortFilter == "latest" || this.selectedSortFilter == "oldest") {
                this.sortedProducts.sort((a, b) => {
                    const aEpoch = new Date(a.createdAt).getTime();
                    const bEpoch = new Date(b.createdAt).getTime();
                    // console.log(a.title, aEpoch);
                    // console.log(b.title, bEpoch);
                    // console.log(aEpoch - bEpoch);

                    return this.selectedSortFilter == "latest" ? 
                        bEpoch - aEpoch : 
                        aEpoch - bEpoch;
                });

            } else if (this.selectedSortFilter == "minPrice" || this.selectedSortFilter == "maxPrice") {

            } 
        },

        getSearchOptions() {
            const urlParams = new URLSearchParams(window.location.search);
            this.selectedSearchCategory = urlParams.get('category');
            this.selectedPriceRange[0] = urlParams.get('priceFrom');
            this.selectedPriceRange[1] = urlParams.get('priceTo');
            this.selectedLocation = urlParams.get('location');
            this.searchQuery = urlParams.get('search');

            console.log("query params\n",this.selectedSearchCategory,  this.selectedPriceRange, this.selectedLocation, this.searchQuery);
        }
    },
    
    computed: {
        ...mapGetters(
            {
                getAllCategories: "product/getAllCategories"
            }
        ),

        getSearchTitle() {
            if (this.searchQuery) return `"${this.searchQuery}"`;
            else if (this.selectedSearchCategory) return this.selectedSearchCategory.toUpperCase();
            else return this.$t("AllProducts").toUpperCase();
        }
    },

    created() {
        this.getSearchOptions();
        this.emitter.emit("update-header-search-params", { 
            category: this.selectedSearchCategory, 
            priceRange: this.selectedPriceRange, 
            location: this.selectedLocation,
            searchQuery: this.searchQuery
        });

        this.categories = this.transformCategories(this.getAllCategories);
        console.log("ctg?", this.categories);
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

        this.emitter.emit("hide-loader");
    },

    unmounted() {
        this.emitter.off("check-browse-filters");
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

.results-header .breadcrumbs {
    opacity: 0.5;
    font-size: 14px;
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

.result-views .view-icon-cont {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    font-size: 20px;
    color: var(--black);
    background: var(--gradient-angle);
    opacity: 0.33;
    cursor: pointer;
    transition: all 0.2s ease-out;
}
.result-views .view-icon-cont:hover {
    opacity: 0.5;
}
.result-views .view-icon-cont.active {
    opacity: 1;
}

.filters .sort-icon {
    color: var(--primary);
    font-size: 20px;
}

.filters .selected-cont .selected {
    font-size: 14px;
    gap: 2px;
    user-select: none;
}

.filters .chevron-icon {
    font-size: 18px;
}

.sort-filters {
    cursor: pointer;
}

.filters-dropdown-content {
    top: 32px;
    right: 0;
    cursor: initial;
}
.filters-dropdown-content .option {
    cursor: pointer;
}

.products-wrapper.list {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.products-wrapper.grid {
    display: grid;
    row-gap: 24px;
    column-gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}
</style>