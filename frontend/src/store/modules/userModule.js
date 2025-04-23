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
        },

        addUserToChat({commit}, userId) {
            commit("addUserToChat", userId);
        },

        removeUserFromChat({commit}, userId) {
            commit("removeUserFromChat", userId);
        },
    },

    mutations: {
        setUser(state, data) {
            state.user = data;
        },

        setChecked(state, data) {
            state.checked = data;
        },

        addUserToChat(state, data) {
            state.user.openedChats.push(data);
        },

        removeUserFromChat(state, data) {
            state.user.openedChats = state.user.openedChats.filter(usr => usr != data);
        }
    }
}