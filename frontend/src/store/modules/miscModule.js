export default {
    namespaced: true,

    state() {
        return {
            isMobile: screen.width <= 760,
            allPSC: []
        }
    },

    getters: {
        getAllPSC(state) {
            return state.allPSC;
        },

        getIsMobile(state) {
            return state.isMobile;
        },
    },

    actions: {
        setAllPSC ({commit}, pscs) {
            commit('setAllPSC', pscs);
        },

        setIsMobile ({commit}, name) {
            commit("setIsMobile", name);
        },
    },

    mutations: {
        setAllPSC(state, data) {
            state.allPSC = data;
        },

        setIsMobile(state, flag) {
            state.isMobile = flag;
        },
    }
}