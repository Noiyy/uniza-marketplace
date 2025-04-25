<template>
    <div class="admin-content content-wrapper">
        <Header></Header>
    
        <section id="admin">
            <div class="container">
                <div class="content">
                    
                    <div class="admin-wrapper">
                        <div class="admin-heading-cont d-flex flex-column gap-8">
                            <h1> {{ $t('AdminPanel') }} </h1>
                            <div class="line-divider"></div>
                        </div>

                        <nav class="admin-navbar nav-btns-wrapper d-flex">
                            <a role="button" :href="`#${itm.href}`" class="btn nav-btn" v-for="itm in navItems" :key="itm.name"
                                :class="navItemClasses(itm)" @click.prevent="adminNavItemClick(itm)">
                                {{ itm.name }}
                                <span class="new-indicator" v-if="itm.newCount"> {{ itm.newCount }} </span>
                            </a>
                        </nav>

                        <div class="admin-items-content d-flex flex-column">
                            <div id="products" class="admin-section">
                                <ItemContentList
                                    :list-title="$t('Products')"
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
                                    :list-title="$t('Users')"
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
                                    :list-title="$t('Ratings')"
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

                            <div id="sales" class="admin-section">
                                <ItemContentList
                                    :list-title="$t('Sales')"
                                    :item-filters="salesFilters"
                                    :search-query="salesSearchQuery"
                                    :selected-sort-filter="salesSortFilter"
                                    :sorter-custom-filters="salesNavFilters"
                                    :list-all-items-count="allSales ? allSales.length : 0"
                                    :filterClickCallback="filterSalesHandler"
                                    :sorterOptionCallback="sortSalesHandler"
                                    @update:searchQuery="salesSearchHandler"
                                >
                                    <template #content>
                                        <SalesList
                                            :sales="sortedSales"
                                        ></SalesList>
                                    </template>
                                </ItemContentList>
                            </div>

                            <!-- <div id="support" class="admin-section">
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
                            </div> -->

                            <div id="reports" class="admin-section">
                                <ItemContentList
                                    :list-title="$t('Reports')"
                                    :item-filters="reportsFilters"
                                    :search-query="reportsSearchQuery"
                                    :selected-sort-filter="reportsSortFilter"
                                    :sorter-custom-filters="reportsNavFilters"
                                    :list-all-items-count="allReports ? allReports.length : 0"
                                    :filterClickCallback="filterReportsHandler"
                                    :sorterOptionCallback="sortReportsHandler"
                                    @update:searchQuery="reportsSearchHandler"
                                >
                                    <template #content>
                                        <ReportsList
                                            :reports="sortedReports"
                                        ></ReportsList>
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

    <!-- Edit modal -->
    <Modal
        v-model:is-shown="editModalIsShown"
        :header-text="`Edit ${itemToEditInfo}`"
        :modal-id="'edit-modal'"
        @close="closeEditModal">
        <template #body>
            <div class="edit-modal-body" v-if="itemToEdit">
                <div class="edit-content d-flex flex-column gap-32">

                    <!-- user -->
                    <template v-if="itemToEdit.type == 'user'">
                        <div>
                            {{ $t("UserAdminEditInfo1") }}
                            <router-link :to="`/user/${itemToEdit.data._id}`"> 
                                {{ $t("UserAdminEditInfo2") }}
                                <Icon icon="prime:arrow-up-right" class="arrow-icon" /> 
                             </router-link>
                        </div>

                        <div class="input-row d-flex gap-32 align-items-center justify-content-between">
                            <div class="input-cont d-flex flex-column gap-8 flex-1">
                                <div class="input-tag"> {{ $t('Username') }} </div>
                                <input v-model="itemToEdit.data.username" type="text" class="styled" :placeholder="'Username'">
                            </div>

                            <div class="input-cont d-flex flex-column gap-8 flex-1">
                                <div class="input-tag"> {{ $t("Email") }} </div>
                                <input v-model="itemToEdit.data.email" type="email" class="styled" :placeholder="'Email'" disabled>
                            </div>
                        </div>

                        <div>
                            <div class="input-cont d-flex gap-16 flex-1">
                                <Checkbox
                                    :text="$t('DelAvatarInfo')"
                                    :disabled="itemToEdit.data.avatarPath ? false : true"
                                    v-model:is-checked="itemToEdit.data.deleteAvatar"
                                ></Checkbox>

                                <div class="user-avatar-wrapper d-flex gap-8 align-items-center">
                                    <div class="user-avatar-cont bigger pos-relative">
                                        <img :src="getAssetUrl(`img/userAvatars/${itemToEdit.data.avatarPath}`)" class="user-avatar" alt="User avatar" v-if="itemToEdit.data.avatarPath">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- sale -->
                    <template v-if="itemToEdit.type == 'sale'">
                        <div class="input-row d-flex gap-32 align-items-center justify-content-between">
                            <div class="input-cont d-flex flex-column gap-8 flex-1">
                                <div class="input-tag"> {{ $t("Buyer") }} </div>
                                <Multiselect
                                    v-model="itemToEdit.data.buyer"
                                    :options="allUsers.filter(usr => usr._id != itemToEdit.data.product.sellerId)"
                                    :allow-empty="true"
                                    :multiple="false"
                                    :show-labels="false"
                                    :track-by="'_id'"
                                    @search-change="onUserSearchChange" 
                                    :internal-search="false"
                                    >
                                    <template #option="props">
                                        <div class="user-avatar-wrapper d-flex gap-8 align-items-center">
                                            <div class="user-avatar-cont pos-relative">
                                                <img :src="getAssetUrl(`img/userAvatars/${props.option.avatarPath}`)" class="user-avatar" alt="User avatar" v-if="props.option.avatarPath">
                                                <div class="default-avatar-cont" v-else>
                                                    <Icon icon="akar-icons:person" class="default-avatar-icon" />
                                                </div>
                                            </div>
                                            <div class="user-name text-center">
                                                {{ props.option.username }}
                                                <span class="admin-badge-small" v-if="props.option.isAdmin"> Admin </span>
                                                <span class="admin-badge-small banned-badge" v-if="props.option.ban && props.option.ban.isBanned"> Banned </span>
                                            </div>
                                        </div>
                                    </template>
                                    <template #singleLabel="props">
                                        <div class="user-avatar-wrapper d-flex gap-8 align-items-center">
                                            <div class="user-avatar-cont pos-relative">
                                                <img :src="getAssetUrl(`img/userAvatars/${props.option.avatarPath}`)" class="user-avatar" alt="User avatar" v-if="props.option.avatarPath">
                                                <div class="default-avatar-cont" v-else>
                                                    <Icon icon="akar-icons:person" class="default-avatar-icon" />
                                                </div>
                                            </div>
                                            <div class="user-name text-center">
                                                {{ props.option.username }} 
                                                <span class="admin-badge-small" v-if="props.option.isAdmin"> Admin </span>
                                                <span class="admin-badge-small banned-badge" v-if="props.option.ban && props.option.ban.isBanned"> Banned </span>
                                            </div>
                                        </div>
                                    </template>
                                </Multiselect>
                            </div>

                            <div class="input-cont d-flex flex-column gap-8">
                                <div class="input-tag"> {{ $t("Count") }} </div>
                                <input v-model="itemToEdit.data.count" type="number" min="1" max="9999" class="styled" :placeholder="'Count'">
                            </div>
                        </div>

                        <div>
                            <Checkbox
                                :text="$t('IsSaleConfInfo')"
                                v-model:is-checked="itemToEdit.data.confirmed"
                            ></Checkbox>
                        </div>
                    </template>

                    <!-- rating -->
                    <RatingModalContent v-if="itemToEdit.type == 'rating'"
                        :is-edit="true"
                        :all-users="allUsers"
                        :all-products="allProducts"
                        v-model:item-to-edit-data="itemToEdit.data"
                    ></RatingModalContent>

                    <div class="btns-wrapper d-flex gap-24 justify-content-end">
                        <button class="btn primary  " @click="confirmedEditHandler()"> {{ $t("Edit") }} </button>
                        <button class="btn secondary" @click="closeEditModal()"> {{ $t("Cancel") }} </button>
                    </div>
                </div>

            </div>
        </template>
    </Modal>

    <!-- Delete confirm modal -->
    <ConfirmModal
        v-model:is-shown="deleteModalIsShown"
        :body-text="confirmModalBodyText"
        :item-name="itemToDeleteName"
        @yes="confirmedDeleteHandler"
        @close="closedDeleteModal"
    ></ConfirmModal>
</template>

<script>
import Header from '../Header.vue';
import Footer from '../Footer.vue';
import ItemContentList from '../ItemContentList.vue';
import Modal from '../Modal.vue';
import ConfirmModal from '../ConfirmModal.vue';
import Checkbox from '../Checkbox.vue';
import RatingModalContent from '../user/RatingModalContent.vue';

import ProductsList from '../browse/ProductsList.vue';
import RatingsList from '../user/RatingsList.vue';
import UsersList from '../user/UsersList.vue';
import ReportsList from './ReportsList.vue';
import SalesList from './SalesList.vue';

import Multiselect from 'vue-multiselect';
import "vue-multiselect/dist/vue-multiselect.min.css";

import { Icon } from '@iconify/vue';
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
        UsersList,
        ReportsList,
        SalesList,
        Modal,
        ConfirmModal,
        Multiselect,
        Icon,
        Checkbox,
        RatingModalContent
    },

    data() {
        return {
            navItems: [
                {
                    name: this.$t("Products"),
                    active: true,
                    href: "products"
                },
                {
                    name: this.$t("Users"),
                    href: "users"
                },
                {
                    name: this.$t("Ratings"),
                    href: "ratings"
                },
                {
                    name: this.$t("Sales"),
                    href: "sales"
                },
                // {
                //     name: ("Support"),
                //     href: "support",
                //     newCount: 11
                // },
                {
                    name: this.$t("Reports"),
                    href: "reports",
                    newCount: 0
                },
            ],
            allProducts: [],
            allUsers: [],
            allRatings: [],
            allSupportTickets: [],
            allReports: [],
            allSales: [],

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
            usersTypeFilter: "active",
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

            filteredReports: [],
            sortedReports: [],

            reportsFilters: [],
            reportsTypeFilter: "all",
            reportsSortFilter: "latest",
            reportsSearchQuery: "",
            reportsNavFilters: [
                { name: "latest" },
                { name: "oldest" },
            ],

            filteredSales: [],
            sortedSales: [],

            salesFilters: [],
            salesTypeFilter: "all",
            salesSortFilter: "latest",
            salesSearchQuery: "",
            salesNavFilters: [
                { name: "latest" },
                { name: "oldest" },
            ],

            deleteModalIsShown: false,
            itemToDelete: null,
            itemToDeleteInfo: "",
            itemToDeleteName: "",

            editModalIsShown: false,
            itemToEdit: null,
            itemToEditInfo: "",
            itemToEditName: "",
        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),

        async confirmedEditHandler() {
            this.emitter.emit("show-loader");

            if (!this.itemToEdit) {
                this.$toast.error("InvalidItemToEdit");
                return;
            }
            let resp;
            const itemType = this.itemToEdit.type;

            if (itemType == "rating") resp = await this.feedbackApi.updateRating(this.itemToEdit.data._id, this.itemToEdit.data);
            else if (itemType == "user") resp = await this.userApi.updateUser(this.itemToEdit.data._id, this.itemToEdit.data);
            else if (itemType == "sale") resp = await this.productApi.updateSale(this.itemToEdit.data._id, this.itemToEdit.data);

            if (resp.data.success) {
                if (itemType == "user") await this.getUsers();
                if (itemType == "rating") await this.getRatings();
                if (itemType == "sale") await this.getSales();
                
                this.$toast.success("ItemEditSuccess");
            }
            else this.$toast.error("ItemEditFailed");

            this.editModalIsShown = false;
            this.emitter.emit("hide-loader");
        },

        async confirmedDeleteHandler() {
            this.emitter.emit("show-loader");
            console.log("do delete");

            if (!this.itemToDelete) {
                this.$toast.error("InvalidItemToDelete");
                return;
            }
            let resp;
            const itemType = this.itemToDelete.type;

            if (itemType == "product") resp = await this.productApi.deleteProduct(this.itemToDelete.data._id);
            else if (itemType == "report") resp = await this.feedbackApi.deleteReport(this.itemToDelete.data._id);
            else if (itemType == "user") resp = await this.userApi.deleteUser(this.itemToDelete.data._id);
            else if (itemType == "rating") resp = await this.feedbackApi.deleteRating(this.itemToDelete.data._id);
            else if (itemType == "sale") resp = await this.productApi.deleteSale(this.itemToDelete.data._id);

            if (resp.data.success) {
                if (itemType == "product") await this.getProducts();
                if (itemType == "user") await this.getUsers();
                if (itemType == "rating") await this.getRatings();
                if (itemType == "report") await this.getReports();
                if (itemType == "sale") await this.getSales();
                
                this.$toast.success("ItemDeleteSuccess");
            }
            else this.$toast.error("ItemDeleteFailed");

            this.deleteModalIsShown = false;
            this.emitter.emit("hide-loader");
        },

        closedDeleteModal() {
            this.itemToDelete = null;
            this.itemToDeleteInfo = "";
            this.itemToDeleteName = "";
        },

        closeEditModal() {
            this.editModalIsShown = false;
            this.itemToEdit = null;
            this.itemToEditInfo = "";
            this.itemToEditName = "";
        },

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

        onUserSearchChange(searchQuery) {
            // this.filteredUsers = this.filterByValue(this.availableUsers, searchQuery);
        },

        /* DATA GETTERS THROUGH SORTING AND FILTERING */
        getProductsData() {
            this.filteredProducts = this.filterProducts(this.allProducts, this.productsSearchQuery, null, null, null, this.productsTypeFilter);
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

        getReportsData() {
            this.filteredReports = this.filterReports(this.allReports, this.reportsSearchQuery, this.reportsTypeFilter);
            this.sortedReports = this.sortReports(this.filteredReports, this.reportsSortFilter);
        },

        getSalesData() {
            this.filteredSales = this.filterSales(this.allSales, this.salesSearchQuery, this.salesTypeFilter);
            this.sortedSales = this.sortSales(this.filteredSales, this.salesSortFilter);
        },

        /* FILTER HANDLERS */
        filterProductsHandler(fltr) {
            this.productsTypeFilter = fltr.id;
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
            this.usersTypeFilter = fltr.id;
            this.usersFilters.forEach(ft => ft.active = false);
            const selFilter = this.usersFilters.find(ft => ft.name == this.usersTypeFilter);
            if (selFilter) selFilter.active = true;

            this.getUsersData();
        },

        filterReportsHandler(fltr) {
            this.reportsTypeFilter = fltr.id;
            this.reportsFilters.forEach(ft => ft.active = false);
            const selFilter = this.reportsFilters.find(ft => ft.name == this.reportsTypeFilter);
            if (selFilter) selFilter.active = true;

            this.getReportsData();
        },

        filterSalesHandler(fltr) {
            this.salesTypeFilter = fltr.id;
            this.salesFilters.forEach(ft => ft.active = false);
            const selFilter = this.salesFilters.find(ft => ft.name == this.salesTypeFilter);
            if (selFilter) selFilter.active = true;

            this.getSalesData();
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

        sortReportsHandler(fltr) {
            this.reportsSortFilter = fltr.name;
            this.getReportsData();
        },

        sortSalesHandler(fltr) {
            this.salesSortFilter = fltr.name;
            this.getSalesData();
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

        reportsSearchHandler(newValue) {
            this.reportsSearchQuery = newValue;
            this.getReportsData();
        },

        salesSearchHandler(newValue) {
            this.salesSearchQuery = newValue;
            this.getSalesData();
        },

        /* SETUP FILTERS */
        setupProductFilters() {
            this.productFilters = [
                { name: this.$t("onSale"), id: "onSale", count: this.allProducts.filter(pr => pr.status == "onSale").length, active: true },
                { name: this.$t("saleEnded"), id: "saleEnded", count: this.allProducts.filter(pr => pr.status == "saleEnded").length }
            ];
        },

        setupRatingFilters() {
            this.ratingFilters = [
                { name: this.$t("all"), id: "all", count: this.allRatings.length, active: true }
            ];
        },

        setupUserFilters() {
            this.usersFilters = [    
                { name: this.$t("active"), id: "active", count: this.allUsers.filter(usr => !usr.ban).length, active: true },
                { name: this.$t("banned"), id: "banned", count: this.allUsers.filter(usr => usr.ban && usr.ban.isBanned).length }
            ];
        },

        setupReportFilters() {
            this.reportsFilters = [    
                { name: this.$t("all"), id: "all", count: this.allReports.length, active: true },
                { name: this.$t("users"), id: "users", count: this.allReports.filter(rp => !rp.toProductId).length },
                { name: this.$t("products"), id: "products", count: this.allReports.filter(rp => rp.toProductId).length }
            ];
        },

        setupSaleFilters() {
            this.salesFilters = [
                { name: this.$t("all"), id: "all", count: this.allSales.length, active: true },
                { name: this.$t("confirmed"), id: "confirmed", count: this.allSales.filter(sl => sl.confirmed).length },
                { name: this.$t("unconfirmed"), id: "unconfirmed", count: this.allSales.filter(sl => !sl.confirmed).length },
            ];
        },

        async getProducts() {
            await this.getAllProducts();
            this.setupProductFilters();
            this.getProductsData();
        },

        async getRatings() {
            await this.getAllRatings();
            this.setupRatingFilters();
            this.getRatingsData();
        },

        async getUsers() {
            await this.getAllUsers();
            this.setupUserFilters();
            this.getUsersData();
        },

        async getReports() {
            await this.getAllReports();
            const reportsNavItem = this.navItems.find(itm => itm.href == "reports");
            reportsNavItem.newCount = this.allReports.filter(rp => !rp.viewed).length;

            this.setupReportFilters();
            this.getReportsData();
        },

        async getSales() {
            await this.getAllSales();
            this.setupSaleFilters();
            this.getSalesData();
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
            this.allUsers = resp.data.map(usr => ({
                ...usr,
                ownReports: this.allReports.filter(rp => rp.toUserId == usr._id),
                othersReports: this.allReports.filter(rp => rp.fromUserId == usr._id),
                ownProducts: this.allProducts.filter(prd => prd.sellerId == usr._id),
                sales: this.allSales.filter(sl => sl.product.sellerId == usr._id)
            }));
            console.log("users", JSON.parse(JSON.stringify(this.allUsers)));
        },

        async getAllSupportTickets() {
            const resp = await this.feedbackApi.getAllRatings();
            this.allSupportTickets = resp.data;
            console.log("supp tickets", resp);
        },

        async getAllReports() {
            const resp = await this.feedbackApi.getAllReports();
            this.allReports = resp.data;
            console.log("reports", resp);
        },

        async getAllSales() {
            const resp = await this.productApi.getAllSales();
            this.allSales = resp.data.map(sl => ({
                ...sl,
                product: this.allProducts.find(prd => prd._id == sl.productId)
            }));
            console.log("sales", JSON.parse(JSON.stringify(this.allSales)));
        }
    },
    
    computed: {
        ...mapGetters(
            {

            }
        ),

        confirmModalBodyText() {
            return `About deleting ${this.itemToDeleteInfo}`;
        },
    },

    created() {

    },

    async mounted() {
        this.emitter.emit("show-loader");

        this.stickyNavbarHandler();

        await this.getProducts();
        await this.getRatings();
        await this.getReports();
        await this.getSales();
        await this.getUsers();

        this.emitter.emit("hide-loader");

        this.emitter.on("confirmed-report", (id) => {
            this.getReports();
        });

        this.emitter.on("show-delete-modal", (data) => {
            console.log("xd?", data);
            const itemType = data.type;
            const itemData = data.data;

            this.itemToDelete = data;

            if (itemType == "product") {
                this.itemToDeleteInfo = `product`;
                this.itemToDeleteName = `${itemData.title} (${itemData._id})`;
            } else if (itemType == "report") {
                this.itemToDeleteInfo = `report`;
                this.itemToDeleteName = `(${itemData._id})`;
            } else if (itemType == "user") {
                this.itemToDeleteInfo = `user`;
                this.itemToDeleteName = `${itemData.username} (${itemData._id})`;
            } else if (itemType == "rating") {
                this.itemToDeleteInfo = `rating`;
                this.itemToDeleteName = `${itemData.title} (${itemData._id})`;
            } else if (itemType == "sale") {
                this.itemToDeleteInfo = `sale`;
                this.itemToDeleteName = `(${itemData._id})`;
            }

            this.deleteModalIsShown = true;
        });

        this.emitter.on("show-edit-modal", (data) => {
            const itemType = data.type;
            let itemData = data.data;

            if (itemType == "user") {
                this.itemToEditInfo = `user`;
                this.itemToEditName = `${itemData.username} (${itemData._id})`;
            } else if (itemType == "rating") {
                this.itemToEditInfo = `rating`;
                this.itemToEditName = `${itemData.title} (${itemData._id})`;
                itemData = ({
                    ...itemData,
                    ratedByUser: this.allUsers.find(usr => usr._id == data.data.fromUserId),
                    ratedUser: this.allUsers.find(usr => usr._id == data.data.toUserId),
                    ratedProduct: data.data.productId ? this.allProducts.find(prd => prd._id == data.data.productId) : null
                });
            } else if (itemType == "sale") {
                this.itemToEditInfo = "sale";
                this.itemToEditName = `(${itemData._id})`;
                itemData = ({
                    ...itemData,
                    buyer: this.allUsers.find(usr => usr._id == data.data.userId)
                });
            }
            const dataEdit = ({ type: itemType, data: itemData});
            console.log("wat", dataEdit);

            this.itemToEdit = dataEdit;
            this.editModalIsShown = true;
        });

        this.emitter.on("user-ban-success", () => this.getUsers());
    },

    unmounted() {
        this.emitter.off("show-delete-modal");
        this.emitter.off("show-edit-modal");
        this.emitter.off("confirmed-report");
        this.emitter.off("user-ban-success");
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
    z-index: 52;
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

.edit-modal-body .edit-content {
    margin-top: 48px;
}

.modal-el .user-avatar-cont {
    transition: filter 0.2s ease-in;
}

.modal-el .user-avatar-cont, .default-avatar-cont {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    max-width: 24px;
    max-height: 24px;
    border-radius: 50%;
}

.modal-el .user-avatar-cont.bigger, .default-avatar-cont.bigger {
    width: 48px;
    height: 48px;
    max-width: 48px;
    max-height: 48px;
}

.modal-el .user-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    aspect-ratio: 1 / 1;
}

.modal-el .default-avatar-cont {
    font-size: 16px;
    background: var(--white-5a);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-el .user-avatar-wrapper:hover .avatar-overlay {
    opacity: 1;
}

.modal-el .user-name {
    line-height: 100%;
}

.modal-el .admin-badge-small {
    margin-left: 8px;
}

.description-cont textarea {
    min-height: 100px;
    max-height: 25vh;
}

.item-content-list {
    min-height: 500px;
}
</style>