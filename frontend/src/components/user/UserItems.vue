<template>
    <div class="user-items d-flex flex-column gap-48">
        <div class="user-products pos-relative" :class="shownProducts ? 'shown' : ''">
            <ItemContentList
                :list-title="'Products'"
                :item-filters="productFilters"
                :search-query="productsSearchQuery"
                :selected-sort-filter="productsSortFilter"
                :show-sorter-special-prices="true"
                :active-view-type="productsViewType"
                :filterClickCallback="filterProductsHandler"
                :sorterOptionCallback="sortProductsHandler"
                @update:searchQuery="productsSearchHandler"
                @update:activeViewType="(val) => productsViewType = val"
            >
                <template #content>
                    <ProductsList
                        :products="sortedProducts"
                        :active-view-type="productsViewType"
                        :wrapper-class="'smaller'"
                        :seller-data="user"
                    ></ProductsList>
                </template>
            </ItemContentList>

            <div class="view-divider-cont" v-if="!shownProducts && sortedProducts.length && sortedProducts.length > 1">
                <div class="view-divider shorter d-flex justify-content-center align-items-center">
                    <button class="btn secondary" @click="shownProducts = !shownProducts"> View </button>
                    <div class="divider"></div>
                </div>
    
                <div class="hidden-overlay"></div>
            </div>
        </div>
    
        <div class="user-ratings pos-relative" :class="shownRatings ? 'shown' : ''">
            <ItemContentList
                :list-title="'Ratings'"
                :item-filters="ratingFilters"
                :search-query="ratingsSearchQuery"
                :selected-sort-filter="ratingsSortFilter"
                :sorter-custom-filters="ratingsNavFilters"
                :list-options-class="'flex-row-reverse'"
                :filterClickCallback="filterRatingsHandler"
                :sorterOptionCallback="sortRatingsHandler"
                @update:searchQuery="ratingsSearchHandler"
            >
                <template #content>
                    <RatingsList
                        :ratings="sortedRatings"
                    ></RatingsList>
                </template>

                <template #heading-right-other>
                    <div class="small-btns-wrapper d-flex gap-16">
                        <button class="btn secondary transBg" @click="reportUser()" :disabled="isDisabledForLogged"> 
                            ReportUser 
                        </button>
                        <button class="btn primary" @click="rateUser()" :disabled="isDisabledForLogged"> 
                            RateUser
                        </button>
                    </div>
                </template>
            </ItemContentList>

            <div class="view-divider-cont" v-if="!shownRatings && sortedRatings.length && sortedRatings.length > 1">
                <div class="view-divider shorter d-flex justify-content-center align-items-center">
                    <button class="btn secondary" @click="shownRatings = !shownRatings"> View </button>
                    <div class="divider"></div>
                </div>
    
                <div class="hidden-overlay"></div>
            </div>
        </div>

        <RatingModal
            :rated-user="user"
            v-model:is-shown="ratingModalIsShown"
        ></RatingModal>
    </div>
</template>

<script>
import RatingsList from './RatingsList.vue';
import ProductsList from '../browse/ProductsList.vue';
import ItemContentList from '../ItemContentList.vue';
import RatingModal from './RatingModal.vue';

import { Icon } from '@iconify/vue';

import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'UserItems',

    inject: ['axios', 'emitter'],
    emits: [],

    props: {
        products: {
            type: Array,
            default: []
        },

        ratings: {
            type: Array,
            default: []
        },

        user: {
            type: Object,
            default: null
        }
    },

    components: {
        ItemContentList,
        ProductsList,
        RatingsList,
        RatingModal,
        Icon
    },

    data() {
        return {
            productFilters: [],
            ratingFilters: [],

            productsTypeFilter: "onSale",
            productsSortFilter: "latest",
            productsSearchQuery: "",
            productsViewType: "list",

            ratingsTypeFilter: "self",
            ratingsSortFilter: "latest",
            ratingsSearchQuery: "",

            shownProducts: false,
            shownRatings: false,

            filteredProducts: [],
            sortedProducts: [],
            filteredRatings: [],
            sortedRatings: [],

            ratingsNavFilters: [
                { name: "latest" },
                { name: "oldest" },
            ],

            loadedProducts: false,
            loadedRatings: false,

            ratingModalIsShown: false
        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),

        getProductsData() {
            this.filteredProducts = this.filterProducts(this.products, this.productsSearchQuery, null, null, null, this.productsTypeFilter);
            this.sortedProducts = this.sortProducts(this.filteredProducts, this.productsSortFilter);
        },

        filterProductsHandler(fltr) {
            console.log("fltr prod", fltr);
            this.productsTypeFilter = fltr.name;
            this.productFilters.forEach(pr => pr.active = false);
            const selFilter = this.productFilters.find(pr => pr.name == this.productsTypeFilter);
            if (selFilter) selFilter.active = true;

            this.getProductsData();
        },

        sortProductsHandler(fltr) {
            console.log("sort prod", fltr);
            this.productsSortFilter = fltr.name;
            this.getProductsData();
        },

        getRatingsData() {
            this.filteredRatings = this.filterRatings(this.ratings, this.ratingsSearchQuery, this.ratingsTypeFilter);
            this.sortedRatings = this.sortRatings(this.filteredRatings, this.ratingsSortFilter);
        },

        filterRatingsHandler(fltr) {
            this.ratingsTypeFilter = fltr.name;
            this.ratingFilters.forEach(ft => ft.active = false);
            const selFilter = this.ratingFilters.find(ft => ft.name == this.ratingsTypeFilter);
            if (selFilter) selFilter.active = true;

            this.getRatingsData();
        },

        sortRatingsHandler(fltr) {
            this.ratingsSortFilter = fltr.name;
            this.getRatingsData();
        },

        setupProductFilters() {
            this.productFilters = [
                { name: "onSale", count: this.products.filter(pr => pr.status == 'onSale').length, active: true },
                { name: "saleEnded", count: this.products.filter(pr => pr.status == 'saleEnded').length },
            ];
        },

        setupRatingFilters() {
            this.ratingFilters = [
                { name: "self", count: this.ratings.filter(rt => rt.type__ == "self").length, active: true },
                { name: "others", count: this.ratings.filter(rt => rt.type__ == "others").length },
            ];
        },

        ratingsSearchHandler(newValue) {
            this.ratingsSearchQuery = newValue;
            this.getRatingsData();
        },

        productsSearchHandler(newValue) {
            this.productsSearchQuery = newValue;
            this.getProductsData();
        },

        rateUser() {
            if (!this.getLoggedUser) return;
            this.ratingModalIsShown = true;
            console.log("rate user", this.ratingModalIsShown);
        },

        reportUser() {
            if (!this.getLoggedUser) return;
            console.log("report user");
        }
    },
    
    computed: {
        ...mapGetters(
            {
                getLoggedUser: "user/getUser"
            }
        ),

        isDisabledForLogged() {
            return !this.getLoggedUser || this.getLoggedUser._id == this.user._id;
        }
    },

    created() {
        console.log("joj", this.products);
        this.setupProductFilters();
        this.setupRatingFilters();

        this.getProductsData();
        this.getRatingsData();
    },

    mounted() {
        this.emitter.on("show-hidden-user-products", () => this.shownProducts = true);
        this.emitter.on("show-hidden-user-ratings", () => this.shownRatings = true);

        this.emitter.on("added-rating2", () => {
            this.setupRatingFilters();
            this.getRatingsData();
        });
    },

    unmounted() {
        this.emitter.off("show-hidden-user-products");
        this.emitter.off("show-hidden-user-ratings");
        this.emitter.off("added-rating2");
    }
}
</script>

<style scoped>
.user-items {
    margin-top: 112px;
}

.user-products, .user-ratings { /* , .user-ratings */
    max-height: 345px;
    overflow: hidden;
    scroll-margin-top: 139px;
}
.user-products.shown, .user-ratings.shown { /* , .user-ratings.shown */
    max-height: initial;
    overflow: initial;
}

.small-btns-wrapper .btn {
    padding: 4px 24px;
    line-height: 16px;
}

.small-btns-wrapper .btn.transBg {
    background-color: #25201D;
}
.small-btns-wrapper .btn.primary:hover {
    border: 2px solid #25201D;
}
</style>

<style>
.user-products .products-wrapper, .user-ratings .ratings-wrapper {
    padding: 0 32px;
}
</style>