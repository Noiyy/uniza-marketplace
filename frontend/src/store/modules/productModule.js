export default {
    namespaced: true,

    state() {
        return {
            categories: [],
            specialPrices: [ "agreement", "offer", "inText", "free"],
            dorms: ['VD-A', 'VD-B', 'VD-C', 'VD-D', 'VD-E', 'VD-F', 'VD-G', 'VD-H', 'HL-II', 'HL-III', 'HL-IV', 'HL-V', 'HL-VI', 'HL-VII', 'HL-VIII', 'HL-IX', 'HL-X'],
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
        },

        getSpecialPrices(state) {
            return state.specialPrices;
        },

        getDorms(state) {
            return state.dorms;
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