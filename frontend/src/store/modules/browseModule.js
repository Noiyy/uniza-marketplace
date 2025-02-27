export default {
    namespaced: true,

    state() {
        return {
            searchQuery: "",
            category: null,
            subCategory: null,
            priceRange: [0, 9999],
            location: null
        }
    },

    getters: {
        getBrowseOptions(state) {
            return {
                searchQuery: state.searchQuery,
                category: state.category,
                subCategory: state.subCategory,
                priceRange: state.priceRange,
                location: state.location
            }
        },
    },

    actions: {
        setBrowseOptions ({commit}, options) {
            commit('setBrowseOptions', options);
        },
    },

    mutations: {
        setBrowseOptions(state, data) {
            state.searchQuery = data.searchQuery;
            state.category = data.category;
            state.subCategory = data.subCategory;
            state.priceRange = data.priceRange;
            state.location = data.location;
        },
    }
}