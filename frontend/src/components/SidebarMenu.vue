<template>
     <div id="sidebar-menu" class="d-flex">
        <div class="d-flex content gap-16 justify-content-between flex-1">
            <div class="avatar-wrapper gap-8 d-flex flex-column align-items-center">
                <div class="admin-badge" v-if="user && user.isAdmin">
                    ADMIN
                </div>

                <router-link :to="user ? `/user/${user._id}` : ''" @click="emitter.emit('close-sidebarMenu')">
                    <img :src="getAssetUrl('img/logo-sm_dark.svg')" alt="UNIZA Marketplace logo" v-if="!user">
                    <template v-else>
                        <img :src="getAssetUrl(`img/userAvatars/${user.avatarPath}`)" alt="User avatar" v-if="user.avatarPath">
                        <div class="default-avatar-cont" v-else>
                            <Icon icon="akar-icons:person" class="default-avatar-icon" />
                        </div>
                    </template>
                </router-link>

                <a class="logout" v-if="user" @click.prevent="logoutUser()"> logout </a>
            </div>

            <nav class="d-flex flex-column flex-1 align-items-end gap-64">
                <div class="d-flex flex-column gap-32">
                    <div class="d-flex flex-column gap-16">
                        <router-link to="/" @click="emitter.emit('close-sidebarMenu')"> Home </router-link>
                        <router-link to="/browse" @click="emitter.emit('close-sidebarMenu')"> Browse </router-link>

                        <template v-if="user">
                            <router-link to="/favourites" @click="emitter.emit('close-sidebarMenu')"> Favourites </router-link>
                            <!-- <router-link to="/browse" @click="emitter.emit('close-sidebarMenu')"> Auction </router-link> -->
                            <router-link to="/myProducts" @click="emitter.emit('close-sidebarMenu')"> My products </router-link>
                            <router-link to="/addProduct" @click="emitter.emit('close-sidebarMenu')" class="add-product-link">
                                <Icon icon="ic:baseline-plus" class="plus-icon" />
                            </router-link>
                            <router-link to="/chat" @click="emitter.emit('close-sidebarMenu')" class="d-flex gap-8 align-items-center chat-link"> 
                                Chat
                                <div class="notification-count"> 2 </div>
                            </router-link>
                        </template>
                    </div>
    
                    <div class="d-flex flex-column gap-16" v-if="!user">
                        <router-link to="/login" class="btn primary" role="" @click="emitter.emit('close-sidebarMenu')"> Login </router-link>
                        <router-link to="/signUp" class="btn secondary" @click="emitter.emit('close-sidebarMenu')"> Sign up </router-link>
                    </div>
                </div>
    
                <div>
                    <div class="d-flex flex-column gap-16">
                        <router-link to="/admin" v-if="user && user.isAdmin" class="d-flex gap-8 align-items-center admin-panel-link"
                            @click="emitter.emit('toggle-sidebarMenu')"> 
                            ADMIN PANEL
                            <div class="notification"> ! </div>
                            <!-- <Icon icon="material-symbols:person" class="admin-icon" /> -->
                        </router-link>

                        <router-link to="/support" @click="emitter.emit('close-sidebarMenu')"> Support </router-link>
                        <router-link to="/faq" @click="emitter.emit('close-sidebarMenu')"> FAQ </router-link>
                    </div>
                </div>
            </nav>
        </div>

        <div class="logo-bg">
            <img :src="getAssetUrl('img/logo-w_dark.svg')" alt="UNIZA Marketplace logo" class="img-fluid">
        </div>
    </div>
</template>

<script>
import { Icon } from '@iconify/vue';

import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'SidebarMenu',

    inject: ['userApi', 'emitter'],
    emits: [],

    props: {

    },

    components: {
        Icon
    },

    data() {
        return {
            user: null
        }
    },

    methods: {
        ...mapActions(
            {
                setUser: "user/setUser"
            }
        ),

        async logoutUser() {
            const resp = await this.userApi.logoutUser();

            if (resp.data.success) {
                this.setUser(null);
                this.user = null;

                this.$toast.success("LogoutSuccess");
                this.$router.push({name: "Home"});
            } else {
                this.$toast.error("LogoutFailed");
            }
        }
    },
    
    computed: {
        ...mapGetters(
            {
                getUser: 'user/getUser'
            }
        ),
    },

    created() {
        this.user = this.getUser;
        console.log("user", this.user);
    },

    mounted() {

    }
}
</script>

<style scoped>
#sidebar-menu {
    position: fixed;
    top: 0;
    right: -100%;
    bottom: 0;
    width: 40%;
    background-color: var(--black);
    color: var(--white);
    padding: 48px;
    transition: right 0.3s ease-in-out;
    z-index: 15;
    box-shadow: 39px 4px 24.2px 35px var(--primary, #FF9A9E);
}

#sidebar-menu .content {
    margin-top: 120px;
}

#sidebar-menu.open {
    right: 0;
}

nav {
    font-size: 16px;
    text-transform: uppercase;
    text-align: right;
    font-family: "Montserrat", sans-serif;
}

nav a {
    transition: color 0.2s ease-out;
}

nav a:hover {
    color: var(--secondary);
}

.logo-bg {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0.15;
    width: 25%;
    height: auto;
}

.btn {
    padding: 4px 16px;
    font-size: 14px;
}

.avatar-wrapper {
    /* position: relative; */
    position: absolute;
}

.avatar-wrapper img, .default-avatar-cont {
    width: 128px;
    height: 128px;
}

.default-avatar-cont {
    font-size: 56px;
    background: var(--white-5a);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.admin-badge {
    background: var(--accent);
    border-radius: 16px;
    padding: 2px 10px;
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
}

.logout {
    cursor: pointer;
}

.admin-panel-link {
    color: var(--accent);
    font-weight: 600;
    font-style: italic;
}

.admin-panel-link .notification {
    background-color: var(--red);
    color: var(--white);
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 20px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
}

.chat-link {
    justify-content: flex-end;
}

.chat-link .notification-count {
    color: var(--black);
    background-color: var(--primary);
    border-radius: 45px;
    padding: 2px 8px;
    font-weight: bold;
}

.add-product-link .plus-icon {
    font-size: 40px;
}

nav .router-link-active {
    font-weight: 800;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}
nav .router-link-active::after {
    content: "";
    width: 8px;
    height: 100%;
    min-height: 16px;
    background: var(--gradient-angle);
    border-radius: 4px;
}
</style>