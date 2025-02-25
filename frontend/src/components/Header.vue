<template>
    <header class="d-flex flex-column pos-relative">
        <div class="pattern" :style="patternBgStyle"></div>

        <div class="container">
            <div class="main-header d-flex justify-content-between align-items-center">
                <router-link to="/" class="header-left d-flex a-plain pos-relative">
                    <template v-if="!IS_MOBILE">
                        <img :src="getAssetUrl('img/logo-w_dark.svg')" alt="UNIZA Marketplace logo" class="img-fluid"> 
                    </template>
                    <template v-else>
                        <img :src="getAssetUrl('img/logo-sm_dark.svg')" alt="UNIZA Marketplace logo" class="img-fluid">
                    </template>
                </router-link>
        
                <div class="header-right d-flex align-items-center gap-48">
                    <LangSelector></LangSelector>
    
                    <div class="d-flex align-items-center menu gap-8 pos-relative" @click="toggleSidebarMenu">
                        {{ $t("Menu").toUpperCase() }}
                        <div class="menu-btn">
                            <Icon 
                                :icon="!sidebarMenuOpened ? 'material-symbols-light:menu' : 'material-symbols-light:close'"
                                class="menu-icon"
                                :class="!sidebarMenuOpened ? 'open' : 'close'" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="header-search">
            <div class="glass" :style="glassBgStyle"></div>

            <div class="container">
                <div class="d-flex align-items-center justify-content-between">
                    <div class="left d-flex gap-32">
                        <div class="search">
                            <Icon icon="material-symbols:search" class="search-icon" />
                            <input type="text" class="search-input" name="searchQuery">
                        </div>
                        <div class="filters d-flex gap-32 align-items-center">
                            <div class="categories" :class="{ open: isOpen['categories'] }" @click="(e) => toggleDropdown('categories', e)"> 
                                <div class="selected">
                                    {{ selectedSearchCategory ? selectedSearchCategory : 'All main categories' }}
                                    <Icon icon="mdi:chevron-down" class="chevron-icon" />     
                                </div>
                                <div class="filters-dropdown-content scrollbar">
                                    <div class="option" v-for="(ctg, index) in getMainCategories" :key="index"
                                        :class="selectedSearchCategory && selectedSearchCategory == ctg.name ? 'selected' : ''"
                                        @click="selectedSearchCategory = ctg.name"> 
                                        {{ ctg.name }}
                                    </div>
                                    <Icon icon="material-symbols:refresh" class="refresh-icon" @click="selectedSearchCategory = null" />
                                </div>
                            </div>

                            <div class="price" :class="{ open: isOpen['price'] }" @click="(e) => toggleDropdown('price', e)"> 
                                <div class="d-flex gap-8 align-items-center price-selected">
                                    Price
                                    <div class="d-flex align-items-center">
                                        <span v-if="selectedPriceRange[0] == 0 && selectedPriceRange[1] == 9999"> > 0€ </span>
                                        <div class="d-flex gap-8 price-range align-items-center" v-else>
                                            {{ selectedPriceRange[0] }}€
                                            <span> - </span>
                                            {{ selectedPriceRange[1] }}€
                                        </div>
                                        <Icon icon="mdi:chevron-down" class="chevron-icon" />     
                                    </div>
                                </div>
                                <div class="filters-dropdown-content scrollbar" @click="(e) => e.stopPropagation()">
                                    <div class="price-range-info d-flex justify-content-between gap-32">
                                        <div class="price-input-cont d-flex gap-8 align-items-center">
                                            <input type="number" min="0" :value="selectedPriceRange[0]" @input="(e) => setPriceRange('from', e)">
                                            €
                                        </div>
                                        <div class="price-input-cont d-flex gap-8 align-items-center">
                                            <input type="number" max="9999" :value="selectedPriceRange[1]" @input="(e) => setPriceRange('to', e)">
                                            €
                                        </div>
                                        <Icon icon="formkit:arrowright" class="arrow-icon" />
                                    </div>
                                    <div class="slider-container">
                                        <VueSlider
                                            v-model="selectedPriceRange"
                                            :min-range="2"
                                            :min="0"
                                            :max="9999"
                                            @change="sliderChange"
                                            tooltip="none"
                                            @click="(e) => e.stopPropagation()">
                                        </VueSlider>
                                    </div>
                                    <Icon icon="material-symbols:refresh" class="refresh-icon" @click="selectedPriceRange = [0, 9999]" />
                                </div>
                            </div>

                            <div class="location" :class="{ open: isOpen['location'] }" @click="(e) => toggleDropdown('location', e)">
                                <div class="selected">
                                    {{ selectedLocation ? selectedLocation : 'Anywhere' }}
                                    <Icon icon="mdi:chevron-down" class="chevron-icon" />     
                                </div>
                                <div class="filters-dropdown-content scrollbar">
                                    <div class="option" @click="selectNearMeLocation">
                                        Near me
                                    </div>
                                    <div class="location-input-cont" @click="(e) => { e.preventDefault(); e.stopPropagation(); }">
                                        <input type="text" placeholder="search" v-model="locationSearch" @input="filterLocations()">
                                    </div>
                                    <div class="search-options" v-if="locationSearch">
                                        <div class="option" v-for="(loc, index) in filteredLocations" :key="index" @click="selectedLocation = `${loc.city}, ${loc.postalCode}`"
                                            :class="selectedLocation && selectedLocation == `${loc.city}, ${loc.postalCode}` ? 'selected' : ''">
                                            {{ loc.city }} - {{ loc.postalCode }} - {{ loc.region }}
                                        </div>
                                    </div>

                                   <Icon icon="material-symbols:refresh" class="refresh-icon" @click="selectedLocation = null" />
                                </div>
                            </div>
                        </div>
                    </div>
        
                    <div class="right">
                        <button class="btn" @click="doSearch"> Search </button>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <SidebarMenu></SidebarMenu>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Icon } from '@iconify/vue';
import VueSlider from 'vue-3-slider-component';

import SidebarMenu from './SidebarMenu.vue';
import LangSelector from './LangSelector.vue';

export default {
    name: 'Header',

    inject: ['axios', 'emitter'],
    emits: [],

    props: {

    },

    components: {
        SidebarMenu,
        LangSelector,
        Icon,
        VueSlider
    },

    data() {
        return {
            sidebarMenuOpened: false,
            glassImgSrc: this.getAssetUrl("img/header_texture.png"),
            patternImgSrc: this.getAssetUrl("img/noise_texture.png"),

            selectedSearchCategory: null,
            selectedPriceRange: [0, 9999],
            selectedLocation: null,
            isOpen: {
                categories: false,
                price: false,
                location: false
            },
            locationSearch: "",

            filteredLocations: [],
            userDeviceLocation: null,
        }
    },

    methods: {
        toggleDropdown(dropdown, e) {
            if (e.target.classList.contains("filters-dropdown-content")) return;

            for (const key in this.isOpen) {
                if (key !== dropdown) {
                this.isOpen[key] = false;
                }
            }

            this.isOpen[dropdown] = !this.isOpen[dropdown];
        },

        toggleSidebarMenu() {
            console.log("toggle");
            const sidebarMenu = document.getElementById("sidebar-menu");
            // const menuBtn = document.querySelector(".menu-btn");

            sidebarMenu.classList.toggle("open");
            // menuBtn.classList.toggle("animate");
            document.body.classList.toggle("openedSidebar");

            setTimeout(() => {
                this.sidebarMenuOpened = !this.sidebarMenuOpened;
            }, 200);
        },

        filterLocations() {
            if (!this.getAllPSC || !this.getAllPSC.length) return [];

            const filterByValue = (array, value) => {
                const regex = new RegExp(value.replace(/([!@#$%^&*()+=\[\]\\',./{}":<>?~_-])/g, "\\$1"));
                return array.filter(obj =>
                    Object.values(obj).some(val =>
                        (typeof val === 'string' || typeof val === 'number') &&
                        (regex.test(val.toString().toLowerCase()))
                    )
                );
            };

            this.filteredLocations = filterByValue(this.getAllPSC, this.locationSearch);
        },

        selectNearMeLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.selectedLocation = 'nearMe';
                    console.log("Latitude: " + position.coords.latitude);
                    console.log("Longitude: " + position.coords.longitude);

                }, (error) => {
                    console.error("Error obtaining location: ", error);
                    this.$toast.error(this.$t("LocationGetFailed"));
                });
            } else {
                console.warn("Geolocation is not supported by this browser.");
                this.$toast.warn(this.$t("BrowserGeoUnsupported"));
            }
        },

        sliderChange(val, index) {
            // console.log("oi", val);
        },

        setPriceRange(type, e) {
            if (type == "from") { 
                this.selectedPriceRange[0] = e.target.value ? e.target.value : 0;
            } else {
                this.selectedPriceRange[1] = e.target.value ? e.target.value : 0;
            }
        },

        doSearch() {
            
        }
    },
    
    computed: {
        ...mapGetters(
            {
                IS_MOBILE: 'misc/getIsMobile',
                getMainCategories: 'product/getMainCategories',
                getAllPSC: 'misc/getAllPSC'
            }
        ),

        glassBgStyle() {
            return `
                background: url(${this.glassImgSrc}) 0% 0% / 1000px 1000px repeat,
                linear-gradient(90deg, var(--primary) 0%, rgba(255, 154, 158, 0.50) 101.11%)`;
        },

        patternBgStyle() {
            return `
                background: url(${this.patternImgSrc}) 0% 0% / 80% 150% repeat`;
        }
    },

    created() {
        this.emitter.on('close-sidebarMenu', () => {
            const sidebarMenu = document.getElementById("sidebar-menu");
            // const menuBtn = document.querySelector(".menu-icon");

            sidebarMenu.classList.remove("open");
            // menuBtn.classList.toggle("animate");

            document.body.classList.remove("openedSidebar");
            this.sidebarMenuOpened = false;
        });

    },

    mounted() {
        this.emitter.on("check-header-filters", (e) => {
            let contEl;
            let optionEls;
            let selectedEl;

            if (this.isOpen.categories) {
                contEl = document.querySelector('.categories');
                optionEls = contEl.querySelectorAll('.option');
                selectedEl = contEl.querySelector(".selected");
            } else if (this.isOpen.price) {
                contEl = document.querySelector('.price');
                optionEls = contEl.querySelectorAll('.option');
                selectedEl = contEl.querySelector(".price-selected");
            } else if (this.isOpen.location) {
                contEl = document.querySelector('.location');
                optionEls = contEl.querySelectorAll('.option');
                selectedEl = contEl.querySelector(".selected");
            }
            if (!contEl) return;

            if (!contEl.contains(e.target) &&
                !Array.from(optionEls).some(option => option.contains(e.target)) &&
                !selectedEl.contains(e.target)
            ) {
                if (this.isOpen.categories) this.isOpen.categories = false;
                else if (this.isOpen.price) this.isOpen.price = false;
                else if (this.isOpen.location) this.isOpen.location = false;
            }
        });
    },

    unmounted() {
        this.emitter.off("check-header-filters");
    }
}
</script>

<style scoped>
/* header {

} */

.main-header {
    /* height: 96px; */
    padding: 8px 0;
}

.main-header img {
    height: 56px;
    width: auto;
}

.header-right {
    font-size: 20px;
}

.header-right .menu {
    line-height: 20%;
    font-weight: 200;
    cursor: pointer;
}

.header-right .menu-icon {
    font-size: 48px;
    transition: transform 0.5s ease-in-out;
}

.header-right .menu-icon.animate {
    transform: rotate(180deg);
}

.header-search {
    padding: 8px;
    flex-shrink: 0;
    color: var(--black);
    position: relative;
    border: 2px solid;
    border-image-slice: 1;
    border-width: 1px;
    border-image-source: linear-gradient(to right, rgba(255, 154, 158, 0), rgba(255, 154, 158, 1));
    z-index: 3;
}
.header-search .glass {
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(4px);
}

.header-search .container {
    position: relative;
    z-index: 2;
}

.header-search .search-icon {
    position: absolute;
    top: 50%;
    left: 8px;
    transform: translateY(-50%);
    opacity: 0.5;
}

.header-search .search {
    color: var(--white);
    position: relative;
}

.header-search .search-input {
    border-radius: 8px;
    background: var(--black);
    padding: 8px 8px 8px 32px;
    border: none;
    outline: none;
    color: var(--white);
    font-size: 14px;
}

.header-search .right .btn {
    color: var(--white);
    background-color: var(--black);
    border-radius: 8px;
    padding: 4px 24px;
    font-weight: 600;
    text-transform: uppercase;
}

.filters .categories, .filters .price, .filters .location {
    cursor: pointer;
    position: relative;
}

.filters > div {
    user-select: none;
}


.filters .price .price-range {
    font-weight: 700;
}
.filters .price .price-range span {
    font-weight: initial;
}

.filters .location input {
    background-color: var(--black);
    color: var(--white);
    outline: none;
    border: none;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    margin: 8px 0;
    width: 100%;
}

.filters .price-range-info {
    margin-top: 32px;
    position: relative;
}

.filters .price-range-info .arrow-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--white);
    opacity: 0.5;
}

.filters .price .slider-container {
    margin: 16px 0;
    padding: 0 8px;
}


.filters .price-input-cont input {
    max-width: 66px;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.05);
    color: var(--white);
    font-weight: 600;
    outline: none;
    padding: 8px;
    border: none;
    border-radius: 4px;
}

.filters .price-input-cont input::-webkit-outer-spin-button,
.filters .price-input-cont input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.header-search .right .btn:hover {
    background-color: #2c251f;
}

.filters .location .search-options .option,
.filters .categories .option {
    color: var(--primary);
}
.filters .location .search-options .option:nth-child(even),
.filters .categories .option:nth-child(even) {
    color: var(--secondary);
}

.header-right .menu-btn {
    z-index: 16;
}

.pattern {
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    /* z-index: 1; */
}
.pattern::before {
    content: "";
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    background: rgba(26, 21, 18, 0.94);
    backdrop-filter: blur(20px);
}

/* header > .container {
    z-index: 16;
} */
</style>

<style>
.filters > .open .filters-dropdown-content {
    display: block;
}

.filters-dropdown-content {
    display: none;
    position: absolute;
    background-color: var(--black);
    color: var(--white);
    min-width: 250px;
    box-shadow: 0px 8px 16px rgba(255, 154, 158, 0.1); 
    z-index: 5;
    max-height: 250px;
    overflow-y: auto;
    padding: 16px;
}

.filters-dropdown-content .option {
    padding: 8px;
    background-color: var(--black);
    cursor: pointer;
}
.filters-dropdown-content .option:hover {
    background-color: rgba(255, 255, 255, 0.05);
}

.filters-dropdown-content .option:nth-child(1) {
    margin-top: 16px;
}

.filters-dropdown-content .option.selected {
    background-color: rgba(255, 255, 255, 0.1);
}

.filters-dropdown-content .refresh-icon {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 20px;
    cursor: pointer;
    transition: transform 0.4s ease-out;
}
.filters-dropdown-content .refresh-icon:hover {
    transform: rotate(360deg);
}

.filters .filters-dropdown-content {
    cursor: initial;
}

.filters .chevron-icon {
    font-size: 24px;
    transition: transform 0.2s ease-out;
}

.filters .open .chevron-icon {
    transform: rotate(180deg);
}
</style>