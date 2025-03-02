<template>
    <div class="user-items">
        <div class="user-products pos-relative" :class="shownProducts ? 'shown' : ''">
            <ItemContentList
                :item-filters="productFilters"
                :search-query="productsSearchQuery"
                :selected-sort-filter="productsSortFilter"
                :filterClickCallback="filterProductsHandler"
                :sorterOptionCallback="sortProductsHandler"
                @search-changed="filterProductsHandler()"
            >
                <template #content>
                    <ProductsList
                        :products="sortedProducts"
                        :active-view-type="productsViewType"
                    ></ProductsList>
                </template>
            </ItemContentList>

            <template v-if="!shownProducts">
                <div class="view-divider d-flex justify-content-center align-items-center">
                    <button class="btn secondary" @click="shownProducts = !shownProducts"> View </button>
                    <div class="divider"></div>
                </div>
    
                <div class="hidden-overlay"></div>
            </template>
        </div>
    
        <!-- <div class="user-ratings">
            <ItemContentList>
                
            </ItemContentList>
        </div> -->
    </div>
</template>

<script>
import ProductsList from '../browse/ProductsList.vue';
import ItemContentList from '../ItemContentList.vue';
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
        }
    },

    components: {
        ItemContentList,
        ProductsList,
        Icon
    },

    data() {
        return {
            productFilters: [
                { name: "onSale", count: 2, active: true },
                { name: "sold", count: 12 },
                { name: "bought", count: 7 },
            ],

            productsSortFilter: "latest",
            productsSearchQuery: "",
            productsViewType: "list",

            shownProducts: false,

            filteredProducts: [],
            sortedProducts: []
        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),

        filterProductsHandler(fltr) {
            console.log("fltr prod", fltr);

            this.filteredProducts = this.filterProducts(this.products, this.productsSearchQuery);
            this.sortedProducts = this.sortProducts(this.filteredProducts, this.productsSortFilter);

        },

        sortProductsHandler(fltr) {
            console.log("sort prod", fltr);
            this.productsSortFilter = fltr.name;

            this.filteredProducts = this.filterProducts(this.products, this.productsSearchQuery);
            this.sortedProducts = this.sortProducts(this.filteredProducts, this.productsSortFilter);
        },

        toggleShowProducts() {

        }
    },
    
    computed: {
        ...mapGetters(
            {

            }
        ),
    },

    created() {
        console.log("joj", this.products);
        this.filteredProducts = this.filterProducts(this.products, this.productsSearchQuery);
        this.sortedProducts = this.sortProducts(this.filteredProducts, this.productsSortFilter);
    },

    mounted() {
        
    }
}
</script>

<style scoped>
.user-items {
    margin-top: 112px;
}

.user-products {
    max-height: 345px;
    overflow: hidden;
    scroll-margin-top: 24px;
}
.user-products.shown {
    max-height: initial;
    overflow: initial;
}

.view-divider {
    bottom: 16px;
    width: 80%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
}

.view-divider .divider {
    background-color: var(--white-33a);
}

.hidden-overlay {
    position: absolute;
    top: 104px;
    left: 0;
    width: 100%;
    height: 72%;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 100%);
}
</style>