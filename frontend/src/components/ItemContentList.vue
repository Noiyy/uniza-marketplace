<template>
    <div class="item-content-list d-flex flex-column">
        <div class="list-heading d-flex flex-column gap-8">
            <div class="list-heading-content d-flex gap-16 justify-content-between">
                <div class="list-title-cont d-flex justify-content-between"
                    :class="IS_MOBILE ? mobileTitleReposSorter ? 'flex-1' : '' : ''">
                    <div class="list-title d-flex align-items-center gap-8">
                        <h1 class="title"> {{ listTitle.toUpperCase() }} </h1>
    
                        <span v-if="listAllItemsCount"> {{ listAllItemsCount }} </span>
                    </div>

                    <div class="mobile-sorter" v-if="IS_MOBILE && mobileTitleReposSorter">
                        <ItemsSorter
                            :option-callback="sorterOptionCallback"
                            :selected-sort-filter="selectedSortFilter"
                            :show-special-prices="showSorterSpecialPrices"
                            :custom-filters="sorterCustomFilters"
                        ></ItemsSorter>
                    </div>
                </div>

                <div class="list-options d-flex gap-64 align-items-center" :class="`${listOptionsClass} ${IS_MOBILE && mobileTitleReposSorter ? 'flex-1 justify-content-start' : ''}`">
                    <slot name="heading-right">
                        <ItemsSorter v-if="!IS_MOBILE || !mobileTitleReposSorter"
                            :option-callback="sorterOptionCallback"
                            :selected-sort-filter="selectedSortFilter"
                            :show-special-prices="showSorterSpecialPrices"
                            :custom-filters="sorterCustomFilters"
                        ></ItemsSorter>
        
                        <slot name="heading-right-other">
                            <div class="result-views d-flex gap-8" v-if="localActiveViewType">
                                <div class="view-icon-cont" :class="localActiveViewType == 'grid' ? 'active' : ''"
                                    @click="localActiveViewType = 'grid'">
                                    <Icon icon="mingcute:grid-fill" class="view-icon" />
                                </div>
                                <div class="view-icon-cont" :class="localActiveViewType == 'list' ? 'active' : ''"
                                    @click="localActiveViewType = 'list'">
                                    <Icon icon="ph:rows-fill" class="view-icon" />
                                </div>
                            </div>
                        </slot>
                    </slot>
                </div>
            </div>

            <div class="line-divider"></div>
        </div>
        <div class="list-body d-flex flex-column gap-32 pos-relative">
            <div class="under-header d-flex justify-content-between">
                <div class="list-filters d-flex gap-8">
                    <div v-for="(fltr) in itemFilters" :key="fltr.name" class="filter-opt d-flex align-items-center gap-8"
                        :class="fltr.active ? 'active' : ''" @click="filterClickCallback(fltr)">
                        {{ fltr.name }} 
                        <span> {{ fltr.count }} </span>
                    </div>
                </div>

                <slot name="under-header-right">
                    <div class="list-searchbar pos-relative">
                        <input type="text" class="search-input" name="searchQuery" v-model="localSearchQuery">
                        <Icon icon="material-symbols:search" class="search-icon" />
                    </div>
                </slot>
            </div>
            <div class="body-content">
                <slot name="content"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex/dist/vuex.cjs.js';
import ItemsSorter from './ItemsSorter.vue';
import { Icon } from '@iconify/vue';

export default {
    name: 'ItemContentList',

    inject: ['axios', 'emitter'],
    emits: ['update:searchQuery', 'update:activeViewType'],

    props: {
        listTitle: {
            type: String,
            default: "List"
        },

        itemFilters: {
            type: Array,
            default: []
        },

        searchQuery: {
            type: String,
            default: ""
        },

        activeViewType: {
            type: String,
            default: null
        },

        selectedSortFilter: {
            type: String,
            default: "latest"
        },

        filterClickCallback: {
            type: Function,
            default: null
        },

        sorterOptionCallback: {
            type: Function,
            default: null
        },

        showSorterSpecialPrices: {
            type: Boolean,
            default: false
        },

        sorterCustomFilters: {
            type: Array,
            default: null
        },

        listOptionsClass: {
            type: String,
            default: null
        },

        listAllItemsCount: {
            type: Number,
            default: 0
        },

        mobileTitleReposSorter: {
            type: Boolean,
            default: false
        }
    },

    components: {
        ItemsSorter,
        Icon
    },

    data() {
        return {

        }
    },

    methods: {

    },
    
    computed: {
        ...mapGetters({
            IS_MOBILE: 'misc/getIsMobile',
        }), 

        localSearchQuery: {
            get() { return this.searchQuery; },
            set(newValue) {
                this.$emit('update:searchQuery', newValue);
            }
        },

        localActiveViewType: {
            get() { return this.activeViewType; },
            set(newValue) {
                this.$emit('update:activeViewType', newValue);
            }
        }
    },

    created() {

    },

    mounted() {

    }
}
</script>

<style scoped>
.item-content-list {
    /* padding: 16px; */
    background-color: var(--white-5a);
    border-radius: 16px;
}

.list-heading {
    padding: 16px;
    padding-bottom: 0;
}

.list-body {
    padding: 16px;
    padding-top: 0;
}

.list-heading .title {
    font-weight: bold;
    font-size: 24px;
    text-transform: uppercase;
}

.under-header {
    margin-top: 8px;
}

.list-filters {

}

.list-filters .filter-opt {
    border-radius: 8px;
    padding: 8px 16px;
    transition: background-color 0.2s ease-out;
    cursor: pointer;
}
.list-filters .filter-opt.active {
    background-color: var(--white-5a);
}
.list-filters .filter-opt:not(.active):hover {
    background-color: var(--white-2a);
}

.list-filters .filter-opt span, .list-title span {
    padding: 4px 16px;
    border-radius: 8px;
    background-color: var(--white-5a);
    color: var(--white-50a);
    font-weight: bold;
}

.list-searchbar {
}

.list-searchbar input {
    padding: 8px 16px;
    border-radius: 8px;
    background-color: var(--white-5a);
    outline: none;
    border: none;
    color: var(--white);
}

.list-searchbar .search-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 8px;
    font-size: 24px;
    opacity: 0.5;
    z-index: 1;
}

/* SMALL - Mobile */
@media(max-width: 640px) { 
    .list-heading-content {
        flex-wrap: wrap;
    }

    .list-heading .title {
        font-size: 18px;
    }

    .list-options {
        gap: 16px !important;
        flex-wrap: wrap;
    }

    .under-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .list-filters .filter-opt {
        font-size: 13px;
        padding: 4px 8px;
    }

    .list-filters .filter-opt span {
        padding: 2px 8px;
    }

    .list-searchbar .search-icon {
        font-size: 20px;
    }
}

/* MEDIUM - Tablet */
@media(min-width: 641px) and (max-width: 992px) { 

}
</style>