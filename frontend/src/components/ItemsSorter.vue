<template>
    <div class="sort-filters pos-relative" :class="sortFiltersOpened ? 'open' : ''"
        @click="(e) => toggleSortFilterDropdown(e)"
    >
        <div class="selected-cont d-flex gap-8">
            <Icon icon="bx:sort" class="sort-icon" />
            <div class="selected d-flex align-items-center">
                {{ selectedSortFilter }}
                <Icon icon="mdi:chevron-down" class="chevron-icon" />
            </div>
        </div>
        <div class="filters-dropdown-content scrollbar">
            <div class="option d-flex gap-8" v-for="fltr in sortFilters" :key="fltr.name"
                :class="selectedSortFilter && selectedSortFilter == fltr.name ? 'selected' : ''"
                @click="optionCallback(fltr)"> 
                <Icon :icon="fltr.icon" class="filter-sort-option-icon" v-if="fltr.icon"/>
                {{ fltr.name }}
            </div>
        </div>
    </div>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
    name: 'ItemsSorter',

    inject: ['axios', 'emitter'],
    emits: [],

    props: {
        optionCallback: {
            type: Function,
            default: null,
            required: true
        },

        selectedSortFilter: {
            type: String,
            default: "latest"
        },

        showSpecialPrices: {
            type: Boolean,
            default: false
        }
    },

    components: {
        Icon
    },

    data() {
        return {
            sortFiltersOpened: false,
            sortFilters: [
                { name: "latest" },
                { name: "oldest" },
                { name: "minPrice" },
                { name: "maxPrice" }
            ],
        }
    },

    methods: {
        toggleSortFilterDropdown(e) {
            if (e.target.classList.contains("option") || e.target.classList.contains("chevron-icon") ||
                e.target.classList.contains("selected") || e.target.classList.contains("sort-icon") ||
                e.target.classList.contains("sort-filters")) {
                    this.sortFiltersOpened = !this.sortFiltersOpened;
            }
        }
    },

    created() {
        if (this.showSpecialPrices) {
            this.sortFilters.push(...[
                { name: "agreement", icon: "icomoon-free:price-tags" },
                { name: "offer", icon: "icomoon-free:price-tags" },
                { name: "inText", icon: "icomoon-free:price-tags" },
                { name: "free", icon: "icomoon-free:price-tags" }
            ]);
        }
    }
}
</script>

<style scoped>
.sort-filters.open .filters-dropdown-content {
    display: block;
}
.sort-filters.open .chevron-icon {
    transform: rotate(180deg);
}

.chevron-icon {
    font-size: 24px;
    transition: transform 0.2s ease-out;
}
</style>