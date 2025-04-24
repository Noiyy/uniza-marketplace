export default {
    namespaced: true,

    state() {
        return {
            user: null,
            checked: false,
            unreadCount: 0
        }
    },

    getters: {
        getUser(state) {
            return state.user;
        },

        getChecked(state) {
            return state.checked;
        },

        getUnreadCount(state) {
            return state.unreadCount;
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

        setUnreadCount({commit}, count) {
            commit("setUnreadCount", count);
        }
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
        },

        setUnreadCount(state, data) {
            state.unreadCount = data;
        }
    }
}