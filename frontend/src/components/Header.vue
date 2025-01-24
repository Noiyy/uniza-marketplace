<template>
    <header class="d-flex flex-column">
        <div class="container">
            <div class="main-header d-flex justify-content-between align-items-center">
                <router-link to="/" class="header-left d-flex a-plain">
                    <template v-if="!IS_MOBILE">
                        <img :src="getAssetUrl('img/logo-w_dark.svg')" alt="UNIZA Marketplace logo" class="img-fluid"> 
                    </template>
                    <template v-else>
                        <img :src="getAssetUrl('img/logo-sm_dark.svg')" alt="UNIZA Marketplace logo" class="img-fluid">
                    </template>
                </router-link>
        
                <div class="header-right d-flex align-items-center gap-48">
                    <LangSelector></LangSelector>
    
                    <div class="d-flex align-items-center menu gap-8" @click="toggleSidebarMenu">
                        {{ $t("Menu").toUpperCase() }}
                        <div class="menu-btn">
                            <Icon icon="material-symbols-light:menu" class="menu-icon open" v-if="!sidebarMenuOpened"/>
                            <Icon icon="material-symbols-light:close" class="menu-icon close" v-else />
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
                            <div class="categories"> 
                                <div class="selected">
                                    All main categories
                                    <Icon icon="mdi:chevron-down" class="chevron-icon" />     
                                </div>
                                <div class="filters-dropdown-content scrollbar">
                                    <div class="option"> Clothing </div>
                                    <div class="option"> Tickets </div>
                                    <div class="option"> Tickets </div>
                                    <div class="option"> Tickets </div>
                                    <div class="option"> Tickets </div>
                                    <div class="option"> Tickets </div>
                                    <div class="option"> Tickets </div>
                                    <div class="option"> Tickets </div>
                                    <div class="option"> Tickets </div>
                                    <div class="option"> Tickets </div>
                                    <div class="option"> Tickets </div>
                                </div>
                            </div>
                            <div class="price d-flex gap-8 align-items-center"> 
                                Price
                                <div class="d-flex align-items-center">
                                    <span> > 0€ </span>
                                    <!-- <div class="d-flex gap-8 price-range align-items-center">
                                        30€
                                        <span> - </span>
                                        50€
                                    </div> -->
                                    <Icon icon="mdi:chevron-down" class="chevron-icon" />     
                                </div>
                            </div>
                            <div class="location"> 
                                Anywhere
                                <Icon icon="mdi:chevron-down" class="chevron-icon" />     
                            </div>
                        </div>
                    </div>
        
                    <div class="right">
                        <button class="btn"> Search </button>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- <SidebarMenu></SidebarMenu> -->
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Icon } from '@iconify/vue';

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
        Icon
    },

    data() {
        return {
            sidebarMenuOpened: false,
            glassImgSrc: this.getAssetUrl("img/header_texture.png")
        }
    },

    methods: {
        toggleSidebarMenu() {
            const sidebarMenu = document.getElementById("sidebar-menu");
            const menuBtn = document.querySelector(".menu-icon");

            sidebarMenu.classList.toggle("open");
            menuBtn.classList.toggle("animate");
            document.body.classList.toggle("openedSidebar");
            menuBtn.style = "color: var(--white);";
            setTimeout(() => {
                this.sidebarMenuOpened = !this.sidebarMenuOpened;
            }, 350);
        },
    },
    
    computed: {
        ...mapGetters(
            {
                IS_MOBILE: 'misc/getIsMobile'
            }
        ),

        glassBgStyle() {
            return `
                background: url(${this.glassImgSrc}) 0% 0% / 1000px 1000px repeat,
                linear-gradient(90deg, var(--primary) 0%, rgba(255, 154, 158, 0.50) 101.11%)`;
        }
    },

    created() {
        this.emitter.on('toggle-sidebarMenu', () => this.toggleSidebarMenu());
        this.emitter.on('close-sidebarMenu', () => {
            document.body.classList.remove("openedSidebar");
            this.sidebarMenuOpened = false;
        });
    },

    mounted() {

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

.filters .chevron-icon {
    font-size: 24px;
    transition: transform 0.2s ease-out;
}

.filters .categories, .filters .price, .filters .location {
    cursor: pointer;
    position: relative;
}

.filters .categories:hover .filters-dropdown-content {
    display: block;
}

.filters-dropdown-content {
    display: none;
    position: absolute;
    background-color: var(--black);
    color: var(--white);
    min-width: 100%;
    box-shadow: 0px 8px 16px rgba(255, 154, 158, 0.1); 
    z-index: 1;
    max-height: 250px;
    overflow-y: auto;
    padding: 8px;
}

.filters-dropdown-content .option {
    padding: 8px;
    background-color: var(--black);
}
.filters-dropdown-content .option:hover {
    background-color: rgba(255, 255, 255, 0.05);
}

.filters .open .chevron-icon {
    transform: rotate(90deg);
}
.filters .price .price-range {
    font-weight: 700;
}
.filters .price .price-range span {
    font-weight: initial;
}
</style>