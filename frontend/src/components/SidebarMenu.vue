<template>
     <div id="sidebar-menu" class="d-flex">
        <a role="button" class="close-btn">
            <Icon icon="material-symbols-light:close" class="menu-icon close" @click="emitter.emit('close-sidebarMenu')"/>
        </a>

        <div class="pattern" :style="patternBgStyle"></div>

        <div class="d-flex content gap-16 justify-content-between flex-1">
            <div class="avatar-wrapper gap-8 d-flex flex-column align-items-center">
                <div class="admin-badge" v-if="user && user.isAdmin">
                    ADMIN
                </div>

                <router-link :to="user ? `/user/${user._id}` : ''" class="user-avatar-cont" >
                    <img :src="getAssetUrl('img/logo-sm_dark.svg')" alt="UNIZA Marketplace logo" v-if="!user">
                    <template v-else>
                        <div class="avatar-overlay"></div>
                        <img :src="getAssetUrl(`img/userAvatars/${user.avatarPath}`)" class="user-avatar" alt="User avatar" v-if="user.avatarPath">
                        <div class="default-avatar-cont" v-else>
                            <Icon icon="akar-icons:person" class="default-avatar-icon" />
                        </div>
                    </template>
                </router-link>

                <a class="logout d-flex gap-8" v-if="user" @click.prevent="logoutUser()">
                    logout
                    <Icon icon="material-symbols:logout" class="logout-icon" />
                </a>
            </div>

            <nav class="d-flex flex-column flex-1 align-items-end gap-64 montserrat">
                <div class="d-flex flex-column gap-32">
                    <div class="d-flex flex-column gap-16">
                        <router-link to="/" class="highlightActive" > Home </router-link>
                        <router-link to="/browse" class="highlightActive" > Browse </router-link>

                        <template v-if="user">
                            <router-link to="/favoriteProducts/" class="highlightActive" > Favourites </router-link>
                            <!-- <router-link to="/browse" > Auction </router-link> -->
                            <router-link :to="{ path: `/user/${user._id}`, hash: '#products' }" class="highlightActive" > My products </router-link>
                            <router-link to="/product/add"  class="add-product-link">
                                <Icon icon="ic:baseline-plus" class="plus-icon" />
                            </router-link>
                            <router-link to="/chat"  class="d-flex gap-8 align-items-center chat-link highlightActive"> 
                                Chat
                                <div class="notification-count" v-if="getUnreadMsgsCount"> {{ getUnreadMsgsCount }} </div>
                            </router-link>
                        </template>
                    </div>
    
                    <div class="d-flex flex-column gap-16" v-if="!user">
                        <router-link to="/login" class="btn primary" role="" > Login </router-link>
                        <router-link to="/signUp" class="btn secondary" > Sign up </router-link>
                    </div>
                </div>
    
                <div>
                    <div class="d-flex flex-column gap-16">
                        <router-link to="/admin" v-if="user && user.isAdmin" class="d-flex gap-8 align-items-center admin-panel-link highlightActive"> 
                            ADMIN PANEL
                            <div class="notification" v-if="unconfirmedReports.length"> ! </div>
                            <!-- <Icon icon="material-symbols:person" class="admin-icon" /> -->
                        </router-link>

                        <router-link to="/support" class="highlightActive" > Support </router-link>
                        <router-link to="/faq" class="highlightActive" > FAQ </router-link>
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

import { forceDisconnect, socket } from '../socket';

export default {
    name: 'SidebarMenu',

    inject: ['userApi', 'emitter', 'feedbackApi'],
    emits: [],

    props: {

    },

    components: {
        Icon
    },

    data() {
        return {
            user: null,
            patternImgSrc: this.getAssetUrl("img/noise_texture.png"),

            unconfirmedReports: []
        }
    },

    methods: {
        ...mapActions(
            {
                setUser: "user/setUser",
                setCheckedForUser: "user/setChecked"
            }
        ),

        async logoutUser() {
            this.emitter.emit("show-loader");
            const resp = await this.userApi.logoutUser();

            if (resp.data.success) {
                this.setUser(null);
                this.setCheckedForUser(false);
                this.user = null;

                forceDisconnect();

                this.emitter.emit('close-sidebarMenu')
                this.$toast.success("LogoutSuccess");
                this.$router.push({name: "Home"});
            } else {
                this.$toast.error("LogoutFailed");
            }
            this.emitter.emit("hide-loader");
        },

        async getAllReports() {
            const resp = await this.feedbackApi.getAllReports();
            this.unconfirmedReports = resp.data.filter(rp => !rp.viewed);
        },
    },
    
    computed: {
        ...mapGetters(
            {
                getUser: 'user/getUser',
                getUnreadMsgsCount: "user/getUnreadCount"
            }
        ),

        patternBgStyle() {
            return `
                background: url(${this.patternImgSrc}) 0% 0% / 150% 100% repeat`;
        }
    },

    created() {
        this.user = this.getUser;
        console.log("logged user", this.user);

        this.emitter.on("sidebar-menu-btn-pos", (pos) => {
            const sidebarMenu = document.getElementById("sidebar-menu");
            const btn = sidebarMenu.querySelector(".close-btn");

            // btn.style.display = "flex";
            btn.style.top = `${pos.y}px`;
            btn.style.left = `${pos.x}px`;
        });
    },

    mounted() {
        this.emitter.on("check-sidebar-outside-click", (e) => {
            const sidebarMenu = document.getElementById("sidebar-menu");
            const headerRight = document.querySelector(".header-right");

            if (!sidebarMenu.contains(e.target) && !headerRight.contains(e.target)) {
                this.emitter.emit("close-sidebarMenu");
            }
        });

        this.emitter.on("toggle-sidebar-menu-close-btn", () => {
            const sidebarMenu = document.getElementById("sidebar-menu");
            const btn = sidebarMenu.querySelector(".close-btn");
            btn.style.display = btn.style.display == "initial" ? "none" : 'initial';
            // btn.style.display == "initial" ? btn.style.display = "none" : btn.style.display = "initial";
        });

        if (this.user && this.user.isAdmin) {
            this.getAllReports();
            this.emitter.on("confirmed-report", () => {
                this.getAllReports();
            });
        }
    },

    unmounted() {
        this.emitter.off("check-sidebar-outside-click");
        this.emitter.off("toggle-sidebar-menu-close-btn");
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
    z-index: 55;
    box-shadow: 39px 4px 24.2px 35px var(--primary, #FF9A9E);
}

#sidebar-menu .content {
    margin-top: 120px;
    z-index: 2;
}

#sidebar-menu.open {
    right: 0;
}

nav {
    font-size: 16px;
    text-transform: uppercase;
    text-align: right;
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
    z-index: 2;
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

.user-avatar-cont {
    position: relative;
}

.user-avatar-cont:hover .avatar-overlay {
    opacity: 1;
}

.avatar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.33);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.15s ease-in;
}

.user-avatar {
    border-radius: 50%;
    object-fit: cover;
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
    color: var(--black);
    font-weight: 600;
    border-radius: 16px;
    padding: 2px 10px;
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
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

nav .highlightActive.router-link-active {
    font-weight: 800;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}
nav .highlightActive.router-link-active::after {
    content: "";
    width: 8px;
    height: 100%;
    min-height: 16px;
    background: var(--gradient-angle);
    border-radius: 4px;
}

.pattern {
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}
.pattern::before {
    content: "";
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    background: rgba(26, 21, 18, 0.98);
    backdrop-filter: blur(40px);
}

.close-btn {
    position: fixed;
    top: 16px;
    right: 32px;
    color: var(--white);
    z-index: 2;
    font-size: 48px;
    display: none;
    cursor: pointer;
}
</style>