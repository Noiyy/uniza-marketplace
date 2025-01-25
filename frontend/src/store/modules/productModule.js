export default {
    namespaced: true,

    state() {
        return {
            categories: [],
        }
    },

    getters: {
        getAllCategories(state) {
            return state.categories;
        },

        getMainCategories(state) {
            return state.categories && state.categories.length ? state.categories.filter(ctg => !ctg.parentName) : null;
        },

        getSubCategories(state) {
            return state.categories && state.categories.length ? state.categories.filter(ctg => ctg.parentName) : null;
        }
    },

    actions: {
        setAllCategories ({commit}, categories) {
            commit('setAllCategories', categories);
        },
    },

    mutations: {
        setAllCategories(state, data) {
            state.categories = data;
        },
    }
}