export default {
    namespaced: true,

    state() {
        return {
            isMobile: screen.width <= 760,
            newItemName: null,
        }
    },

    getters: {
        getNewItemName(state) {
            return state.newItemName;
        },

        getIsMobile(state) {
            return state.isMobile;
        },
    },

    actions: {
        setNewItemName ({commit}, name) {
            commit('setNewItemName', name);
        },

        setIsMobile ({commit}, name) {
            commit("setIsMobile", name);
        },
    },

    mutations: {
        setNewItemName(state, data) {
            state.newItemName = data;
        },

        setIsMobile(state, flag) {
            state.isMobile = flag;
        },
    }
}