<template>
    <div class="item-content-list d-flex flex-column">
        <div class="list-heading d-flex flex-column gap-8">
            <div class="list-heading-content d-flex gap-16 justify-content-between">
                <h1 class="title"> PRODUCTS </h1>
                <div class="list-options d-flex gap-64 align-items-center">
                    <slot name="heading-right">
                        <ItemsSorter
                            :option-callback="sorterOptionCallback"
                            :selected-sort-filter="selectedSortFilter"
                            :show-special-prices="true"
                        ></ItemsSorter>
        
                        <slot name="heading-right-other">
                            <div class="result-views d-flex gap-8">
                                <div class="view-icon-cont" :class="activeViewType == 'grid' ? 'active' : ''"
                                    @click="activeViewType = 'grid'">
                                    <Icon icon="mingcute:grid-fill" class="view-icon" />
                                </div>
                                <div class="view-icon-cont" :class="activeViewType == 'list' ? 'active' : ''"
                                    @click="activeViewType = 'list'">
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
                        <input type="text" class="search-input" name="searchQuery" :value="searchQuery" @input="$emit('search-changed')">
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
import ItemsSorter from './ItemsSorter.vue';
import { Icon } from '@iconify/vue';

import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'ItemContentList',

    inject: ['axios', 'emitter'],
    emits: ['search-changed'],

    props: {
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
            default: "list"
        },

        selectedSortFilter: {
            type: String,
            default: "latest"
        },

        filterClickCallback: {
            type: Function,
            default: null,
            required: true
        },

        sorterOptionCallback: {
            type: Function,
            default: null,
            required: true
        },
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
        ...mapActions(
            {

            }
        ),
    },
    
    computed: {
        ...mapGetters(
            {

            }
        ),
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

.list-filters .filter-opt span {
    padding: 4px 16px;
    border-radius: 8px;
    background-color: var(--white-5a);
    color: var(--white-50a);
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
</style>