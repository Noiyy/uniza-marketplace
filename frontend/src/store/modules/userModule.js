export default {
    namespaced: true,

    state() {
        return {
            user: null,
            checked: false
        }
    },

    getters: {
        getUser(state) {
            return state.user;
        },

        getChecked(state) {
            return state.checked;
        }
    },

    actions: {
        setUser ({commit}, user) {
            commit("setUser", user);
        },

        setChecked({commit}, flag) {
            commit("setChecked", flag);
        }
    },

    mutations: {
        setUser(state, data) {
            state.user = data;
        },

        setChecked(state, data) {
            state.checked = data;
        }
    }
}