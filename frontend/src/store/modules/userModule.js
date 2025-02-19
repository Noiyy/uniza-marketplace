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
            console.log("saving user to:", data);
            state.user = data;
        },
    }
}