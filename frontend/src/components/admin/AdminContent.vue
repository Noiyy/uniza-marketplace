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
                                    :list-all-items-count="allProducts ? allProducts.length : 0"
                                    :filterClickCallback="filterProductsHandler"
                                    :sorterOptionCallback="sortProductsHandler"
                                    @update:searchQuery="productsSearchHandler"
                                >
                                    <template #content>
                                        <ProductsList
                                            :products="sortedProducts"
                                            :wrapper-class="'smaller'"
                                            :is-in-admin="true"
                                        ></ProductsList>
                                    </template>
                                </ItemContentList>
                            </div>

                            <div id="users" class="admin-section">
                                <ItemContentList
                                    :list-title="'Users'"
                                    :item-filters="usersFilters"
                                    :search-query="usersSearchQuery"
                                    :selected-sort-filter="usersSortFilter"
                                    :sorter-custom-filters="usersNavFilters"
                                    :list-all-items-count="allUsers ? allUsers.length : 0"
                                    :filterClickCallback="filterUsersHandler"
                                    :sorterOptionCallback="sortUsersHandler"
                                    @update:searchQuery="usersSearchHandler"
                                >
                                    <template #content>
                                        <UsersList
                                            :users="sortedUsers"
                                        ></UsersList>
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
                                    :sorterOptionCallback="sortRatingsHandler"
                                    @update:searchQuery="ratingsSearchHandler"
                                >
                                    <template #content>
                                        <RatingsList
                                            :ratings="sortedRatings"
                                            :is-in-admin="true"
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
import UsersList from '../user/UsersList.vue';

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
        RatingsList,
        UsersList
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

            filteredUsers: [],
            sortedUsers: [],

            usersFilters: [],
            usersSortFilter: "latest",
            usersSearchQuery: "",
            usersNavFilters: [
                { name: "latest" },
                { name: "oldest" },
                { name: "userId" },
                { name: "maxRating" },
                { name: "minRating" },
                { name: "maxProductsOnSale" },
                { name: "maxProductsSold" },
                { name: "maxProductsBought" },
                { name: "maxOwnReports" },
                { name: "maxOthersReports" }
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
        },

        /* DATA GETTERS THROUGH SORTING AND FILTERING */
        getProductsData() {
            this.filteredProducts = this.filterProducts(this.allProducts, this.productsSearchQuery, this.productsTypeFilter);
            this.sortedProducts = this.sortProducts(this.filteredProducts, this.productsSortFilter);
        },

        getRatingsData() {
            this.filteredRatings = this.filterRatings(this.allRatings, this.ratingsSearchQuery, null);
            this.sortedRatings = this.sortRatings(this.filteredRatings, this.ratingsSortFilter);
        },

        getUsersData() {
            this.filteredUsers = this.filterUsers(this.allUsers, this.usersSearchQuery, this.usersTypeFilter);
            this.sortedUsers = this.sortUsers(this.filteredUsers, this.usersSortFilter);
        },

        /* FILTER HANDLERS */
        filterProductsHandler(fltr) {
            this.productsTypeFilter = fltr.name;
            this.productFilters.forEach(pr => pr.active = false);
            const selFilter = this.productFilters.find(pr => pr.name == this.productsTypeFilter);
            if (selFilter) selFilter.active = true;

            this.getProductsData();
        },

        filterRatingsHandler(fltr) {
            // vymazať, netreba
            // this.ratingFilters.forEach(ft => ft.active = false);
            // this.getRatingsData();
        },

        filterUsersHandler(fltr) {
            this.usersTypeFilter = fltr.name;
            this.usersFilters.forEach(ft => ft.active = false);
            const selFilter = this.usersFilters.find(ft => ft.name == this.usersTypeFilter);
            if (selFilter) selFilter.active = true;

            this.getUsersData();
        },

        /* SORT HANDLERS */
        sortProductsHandler(fltr) {
            this.productsSortFilter = fltr.name;
            this.getProductsData();
        },

        sortRatingsHandler(fltr) {
            this.ratingsSortFilter = fltr.name;
            this.getRatingsData();
        },

        sortUsersHandler(fltr) {
            this.usersSortFilter = fltr.name;
            this.getUsersData();
        },

        /* SEARCH HANDLERS */
        ratingsSearchHandler(newValue) {
            this.ratingsSearchQuery = newValue;
            this.getRatingsData();
        },

        productsSearchHandler(newValue) {
            this.productsSearchQuery = newValue;
            this.getProductsData();
        },

        usersSearchHandler(newValue) {
            this.usersSearchQuery = newValue;
            this.getUsersData();
        },

        /* SETUP FILTERS */
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

        setupUserFilters() {
            this.usersFilters = [    
                { name: "active", count: this.allUsers.filter(usr => !usr.ban).length, active: true },
                { name: "banned", count: this.allUsers.filter(usr => usr.ban && usr.ban.isBanned).length }
            ];
        },

        /* ####################### */
        /* RESTY */
        /* ####################### */

        async getAllProducts() {
            const resp = await this.productApi.getAllProducts();
            this.allProducts = resp.data;
            console.log("products", resp);
        },

        async getAllRatings() {
            const resp = await this.feedbackApi.getAllRatings();
            this.allRatings = resp.data;
            console.log("ratings", resp);
        },

        async getAllUsers() {
            const resp = await this.userApi.getAllUsers();
            this.allUsers = resp.data;
            console.log("users", resp);
        },

        async getAllSupportTickets() {
            const resp = await this.feedbackApi.getAllRatings();
            this.allSupportTickets = resp.data;
            console.log("supp tickets", resp);
        },

        async getAllReports() {
            const resp = await this.feedbackApi.getAllRatings();
            this.allReports = resp.data;
            console.log("reports", resp);
        },
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
        await this.getAllUsers();

        this.setupProductFilters();
        this.setupRatingFilters();
        this.setupUserFilters();
        
        this.getProductsData();
        this.getRatingsData();
        this.getUsersData();

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