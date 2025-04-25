<template>
    <div class="product-edit-content content-wrapper">
        <Header></Header>

        <section id="favorites">
            <div class="container">
                <div class="content">

                    <div class="favorites-wrapper">
                        <div class="favorites-heading-cont d-flex flex-column gap-8">
                            <h1> Favorite products </h1>
                            <div class="line-divider"></div>
                        </div>

                        <div id="products">
                            <ItemContentList
                                :list-title="'Products'"
                                :item-filters="productFilters"
                                :search-query="productsSearchQuery"
                                :selected-sort-filter="productsSortFilter"
                                :show-sorter-special-prices="true"
                                :list-all-items-count="allFavoriteProducts ? allFavoriteProducts.length : 0"
                                :filterClickCallback="filterProductsHandler"
                                :sorterOptionCallback="sortProductsHandler"
                                @update:searchQuery="productsSearchHandler"
                            >
                                <template #content>
                                    <ProductsList
                                        :products="sortedProducts"
                                        :wrapper-class="'smaller'"
                                        :is-in-favorites="true"
                                        @removed-bookmark="removedBookmark"
                                    ></ProductsList>
                                </template>
                            </ItemContentList>
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
import ItemContentList from '../ItemContentList.vue';
import ProductsList from '../browse/ProductsList.vue';

import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'ProductFavoritesContent',

    inject: ['emitter', 'productApi'],
    emits: [],

    props: {
        
    },

    components: {
        Header,
        Footer,
        ItemContentList,
        ProductsList
    },

    data() {
        return {
            allFavoriteProducts: [],
            filteredProducts: [],
            sortedProducts: [],

            bookmarkedProductIds: [],

            productFilters: [],
            productsTypeFilter: "onSale",
            productsSortFilter: "latest",
            productsSearchQuery: "",
        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),

        getProductsData() {
            this.filteredProducts = this.filterProducts(this.allFavoriteProducts, this.productsSearchQuery, null, null, null, this.productsTypeFilter);
            this.sortedProducts = this.sortProducts(this.filteredProducts, this.productsSortFilter);
        },

        filterProductsHandler(fltr) {
            this.productsTypeFilter = fltr.id;
            this.productFilters.forEach(pr => pr.active = false);
            const selFilter = this.productFilters.find(pr => pr.name == this.productsTypeFilter);
            if (selFilter) selFilter.active = true;

            this.getProductsData();
        },

        sortProductsHandler(fltr) {
            this.productsSortFilter = fltr.id;
            this.getProductsData();
        },

        productsSearchHandler(newValue) {
            this.productsSearchQuery = newValue;
            this.getProductsData();
        },

        setupProductFilters() {
            this.productFilters = [
                { name: this.$t("onSale"), id: "onSale", count: this.allFavoriteProducts.filter(pr => pr.status == "onSale").length, active: true },
                { name: this.$t("saleEnded"), id: "saleEnded", count: this.allFavoriteProducts.filter(pr => pr.status == "saleEnded").length }
            ];
        },

        async getProducts() {
            await this.getFavoriteProducts();
            this.setupProductFilters();
            this.getProductsData();
        },

        async getFavoriteProducts() {
            const resp = await this.productApi.getAllProducts();
            this.allFavoriteProducts = resp.data.filter(prod => this.bookmarkedProductIds.includes(prod._id));
            console.log("products", resp);
        },

        removedBookmark(prodId) {
            this.bookmarkedProductIds = this.bookmarkedProductIds.filter(prod => prod != prodId);
            this.getProducts();
        }
    },
    
    computed: {
        ...mapGetters(
            {
                getLoggedUser: "user/getUser"
            }
        ),
    },

    created() {

    },

    async mounted() {
        this.emitter.emit("show-loader");

        this.bookmarkedProductIds = this.getLoggedUser.bookmarkedProducts;
        await this.getProducts();

        this.emitter.emit("hide-loader");
    }
}
</script>

<style scoped>
.favorites-wrapper {
    margin-top: 72px;
}

.favorites-heading-cont h1 {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 32px;
}
</style>