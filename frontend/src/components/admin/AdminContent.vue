<template>
    <div class="admin-content content-wrapper">
        <Header></Header>
    
        <section id="admin">
            <div class="container">
                <div class="content">
                    
                    <div class="admin-wrapper">
                        <div class="admin-heading-cont d-flex flex-column gap-8">
                            <h1> Admin panel </h1>
                            <div class="line-divider"></div>

                        </div>

                        <nav class="admin-navbar nav-btns-wrapper d-flex">
                            <a role="button" :href="`#${itm.href}`" class="btn nav-btn" v-for="itm in navItems" :key="itm.name"
                                :class="navItemClasses(itm)" @click.prevent="adminNavItemClick(itm)">
                                {{ itm.name }}
                                <span class="new-indicator" v-if="itm.newCount"> 11 </span>
                            </a>
                        </nav>

                        <div class="admin-items-content d-flex flex-column">
                            <div id="products" class="admin-section">
                                <ItemContentList
                                    :list-title="'Products'"
                                    :item-filters="productFilters"
                                    :search-query="productsSearchQuery"
                                    :selected-sort-filter="productsSortFilter"
                                    :show-sorter-special-prices="true"
                                    :list-all-items-count="18251"
                                    :filterClickCallback="filterProductsHandler"
                                    :sorterOptionCallback="sortProductsHandler"
                                    @update:searchQuery="productsSearchHandler"
                                >
                                    <template #content>
                                        <ProductsList
                                            :products="sortedProducts"
                                            :wrapper-class="'smaller'"
                                        ></ProductsList>
                                    </template>
                                </ItemContentList>
                            </div>

                            <div id="users" class="admin-section">
                                <ItemContentList
                                    :list-title="'Users'"
                                    :item-filters="ratingFilters"
                                    :search-query="ratingsSearchQuery"
                                    :selected-sort-filter="ratingsSortFilter"
                                    :sorter-custom-filters="ratingsNavFilters"
                                    :list-all-items-count="18632"
                                    :filterClickCallback="filterRatingsHandler"
                                    :sorterOptionCallback="sortRatingsHandler"
                                    @update:searchQuery="ratingsSearchHandler"
                                >
                                    <template #content>
                                        aaa
                                    </template>
                                </ItemContentList>
                            </div>

                            <div id="ratings" class="admin-section">
                                <ItemContentList
                                    :list-title="'Ratings'"
                                    :item-filters="ratingFilters"
                                    :search-query="ratingsSearchQuery"
                                    :selected-sort-filter="ratingsSortFilter"
                                    :sorter-custom-filters="ratingsNavFilters"
                                    :list-all-items-count="allRatings ? allRatings.length : 0"
                                    :filterClickCallback="filterRatingsHandler"
                                    :sorterOptionCallback="sortRatingsHandler"
                                    @update:searchQuery="ratingsSearchHandler"
                                >
                                    <template #content>
                                        <RatingsList
                                            :ratings="sortedRatings"
                                        ></RatingsList>
                                    </template>
                                </ItemContentList>
                            </div>

                            <div id="support" class="admin-section">
                                <ItemContentList
                                    :list-title="'Support'"
                                    :item-filters="ratingFilters"
                                    :search-query="ratingsSearchQuery"
                                    :selected-sort-filter="ratingsSortFilter"
                                    :sorter-custom-filters="ratingsNavFilters"
                                    :list-all-items-count="18632"
                                    :filterClickCallback="filterRatingsHandler"
                                    :sorterOptionCallback="sortRatingsHandler"
                                    @update:searchQuery="ratingsSearchHandler"
                                >
                                    <template #content>
                                        aaa
                                    </template>
                                </ItemContentList>
                            </div>

                            <div id="reports" class="admin-section">
                                <ItemContentList
                                    :list-title="'Reports'"
                                    :item-filters="ratingFilters"
                                    :search-query="ratingsSearchQuery"
                                    :selected-sort-filter="ratingsSortFilter"
                                    :sorter-custom-filters="ratingsNavFilters"
                                    :list-all-items-count="18632"
                                    :filterClickCallback="filterRatingsHandler"
                                    :sorterOptionCallback="sortRatingsHandler"
                                    @update:searchQuery="ratingsSearchHandler"
                                >
                                    <template #content>
                                        aaa
                                    </template>
                                </ItemContentList>
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
import ItemContentList from '../ItemContentList.vue';

import ProductsList from '../browse/ProductsList.vue';
import RatingsList from '../user/RatingsList.vue';

import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'AdminContent',

    inject: ['emitter', 'productApi', 'userApi', 'feedbackApi'],
    emits: [],

    props: {

    },

    components: {
        Header,
        Footer,
        ItemContentList,
        ProductsList,
        RatingsList
    },

    data() {
        return {
            navItems: [
                {
                    name: "Products",
                    active: true,
                    href: "products"
                },
                {
                    name: "Users",
                    href: "users"
                },
                {
                    name: "Ratings",
                    href: "ratings"
                },
                {
                    name: "Support",
                    href: "support",
                    newCount: 11
                },
                {
                    name: "Reports",
                    href: "reports",
                    newCount: 11
                },
            ],
            allProducts: [],
            allUsers: [],
            allRatings: [],
            allSupportTickets: [],
            allReports: [],

            filteredProducts: [],
            sortedProducts: [],

            productFilters: [],
            productsTypeFilter: "onSale",
            productsSortFilter: "latest",
            productsSearchQuery: "",
            // productsViewType: "list",

            
            filteredRatings: [],
            sortedRatings: [],

            ratingFilters: [],
            ratingsSortFilter: "latest",
            ratingsSearchQuery: "",
            ratingsNavFilters: [
                { name: "latest" },
                { name: "oldest" },
            ],
        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),

        stickyNavbarHandler() {
            // set navbar top position
            const header = document.querySelector("header");
            const navbar = document.querySelector(".admin-navbar");

            let headerHeight = header.offsetHeight; 
            navbar.style.top = `${headerHeight}px`;

            // scrollspy
            setTimeout(() => {
                const sections = document.querySelectorAll('.admin-section');
    
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            const sectionId = entry.target.id;
    
                            // Check if at least half of the section is visible
                            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                                this.navItems.forEach(itm => itm.active = false);
    
                                const activeItem = this.navItems.find(itm => itm.href == sectionId);
                                if (activeItem) activeItem.active = true;
                            }
                        });
                    },
                    {
                    root: null, // Use the viewport as the root
                    threshold: [0.5], // Trigger when at least half of the section is visible
                    }
                );
    
                sections.forEach((section) => observer.observe(section));
            }, 500);
        },

        navItemClasses(item) {
            let classes = "";
            if (item.active) classes += "active ";
            if (item.newCount) classes += "d-flex gap-8";

            return classes;
        },

        adminNavItemClick(item) {
            this.navItems.forEach(itm => itm.active = false);
            item.active = true; 

            const el = document.getElementById(item.href);
            el.scrollIntoView();

            const headerHeight = 123;
            // window.scrollBy(0, headerHeight + 16);

            // function scrollElementIntoViewAsync(element) {
            //     return new Promise((resolve) => {
            //         const observer = new IntersectionObserver(
            //             (entries) => {
            //                 entries.forEach((entry) => {

            //                 if (entry.intersectionRatio >= 0.80) {
            //                     observer.disconnect();
            //                     resolve();
            //                 }
            //                 });
            //             },
            //             {
            //                 threshold: 0.80, // Trigger when 80% of the element is visible
            //             }
            //         );

            //         observer.observe(element);
            //         element.scrollIntoView();
            //     });
            // }   

            // scrollElementIntoViewAsync(el).then(() => {
            //     console.log('Scrolling finished and element is in view!');
            //     setTimeout(() =>{
            //         window.scrollBy(0, headerHeight + 16);
            //     }, 100);
            // });

        },

        getProductsData() {
            this.filteredProducts = this.filterProducts(this.allProducts, this.productsSearchQuery, this.productsTypeFilter);
            this.sortedProducts = this.sortProducts(this.filteredProducts, this.productsSortFilter);
        },

        getRatingsData() {
            this.filteredRatings = this.filterRatings(this.allRatings, this.ratingsSearchQuery, null);
            this.sortedRatings = this.sortRatings(this.filteredRatings, this.ratingsSortFilter);
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

        filterRatingsHandler(fltr) {
            // this.ratingsTypeFilter = fltr.name;
            this.ratingFilters.forEach(ft => ft.active = false);
            // const selFilter = this.ratingFilters.find(ft => ft.name == this.ratingsTypeFilter);
            // if (selFilter) selFilter.active = true;

            this.getRatingsData();
        },

        sortRatingsHandler(fltr) {
            this.ratingsSortFilter = fltr.name;
            this.getRatingsData();
        },

        ratingsSearchHandler(newValue) {
            this.ratingsSearchQuery = newValue;
            this.getRatingsData();
        },

        productsSearchHandler(newValue) {
            this.productsSearchQuery = newValue;
            this.getProductsData();
        },

        setupProductFilters() {
            this.productFilters = [
                { name: "onSale", count: 2, active: true },
                { name: "saleEnded", count: 12 }
            ];
        },

        setupRatingFilters() {
            this.ratingFilters = [
                { name: "all", count: this.allRatings.length, active: true }
            ];
        },

        /* RESTY */
        async getAllProducts() {
            const resp = await this.productApi.getAllProducts();
            this.allProducts = resp.data;
            console.log("products", resp);
        },

        async getAllRatings() {
            const resp = await this.feedbackApi.getAllRatings();
            this.allRatings = resp.data;
            console.log("ratings", resp);
        }
    },
    
    computed: {
        ...mapGetters(
            {

            }
        ),
    },

    created() {

    },

    async mounted() {
        this.emitter.emit("show-loader");

        this.stickyNavbarHandler();

        await this.getAllProducts();
        await this.getAllRatings();

        this.setupProductFilters();
        this.setupRatingFilters();
        
        this.getProductsData();
        this.getRatingsData();

        this.emitter.emit("hide-loader");
    }
}
</script>

<style scoped>
.admin-wrapper {
    margin-top: 72px;
}

.admin-heading-cont h1 {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 32px;
}

.new-indicator {
    background: var(--red);
    width: 20px;
    height: 20px;
    font-size: 12px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
}

.admin-items-content {
    margin-top: 40px;
    gap: 48px;
}

.admin-navbar {
    position: sticky;
    top: 123px;
    z-index: 9;
    margin-top: 8px;
    background: #25201D;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.85));
}

.nav-btn {
    padding: 4px 24px;  
}

.admin-section {
    scroll-margin-top: 180px;
}
</style>