export default {
    namespaced: true,

    state() {
        return {
            user: null
        }
    },

    getters: {
        getUser(state) {
            return state.user;
        },
    },

    actions: {
        setUser ({commit}, user) {
            commit("setUser", user);
        },
    },

    mutations: {
        setUser(state, data) {
            state.user = data;
        },
    }
}