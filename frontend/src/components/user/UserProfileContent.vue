<template>
    <div class="user-profile-content content-wrapper">
        <Header></Header>

        <section id="user-profile">
            <div class="container">
                <div class="content" v-if="user">

                    <div class="user-main-info d-flex gap-64">
                        <div class="user-avatar-cont pos-relative">
                            <img :src="getAssetUrl(`img/userAvatars/${user.avatarPath}`)" class="user-avatar" alt="User avatar" v-if="user.avatarPath">
                            <div class="default-avatar-cont" v-else>
                                <Icon icon="akar-icons:person" class="default-avatar-icon" />
                            </div>

                            <div class="upload-overlay" v-if="getLoggedUser && (getLoggedUser._id == $route.params.id || getLoggedUser.isAdmin)"
                                @click="showAvatarUpload()">
                                <Icon icon="mdi:camera-outline" class="upload-icon" />
                            </div>
                        </div>

                        <div class="user-info d-flex flex-column gap-64 justify-content-between">
                            <div class="user-heading d-flex gap-16 justify-content-between">
                                <div class="name d-flex gap-24 align-items-center">
                                    <h1 class="gradient-text"> {{ user.username }} </h1>
                                    <div class="admin-badge" v-if="user.isAdmin">
                                        ADMIN
                                    </div>
                                </div>

                                <div class="joined-on d-flex gap-32 align-items-center">
                                    <span> 27.12.2024 </span>
                                    Joined on
                                </div>
                            </div>

                            <div class="user-other d-flex flex-column gap-40">
                                <div class="user-rating d-flex justify-content-between pos-relative">
                                    <div class="rating-heading d-flex gap-32 align-items-center">
                                        <div class="heading">Rating</div>
                                        <div class="rating-values d-flex gap-8 align-items-center">
                                            <div> 4,7 </div>
                                            <div class="stars d-flex">
                                                <Icon icon="material-symbols:star" class="star-icon" />
                                                <Icon icon="material-symbols:star" class="star-icon" />
                                                <Icon icon="material-symbols:star" class="star-icon" />
                                                <Icon icon="material-symbols:star" class="star-icon" />
                                                <Icon icon="material-symbols:star-half" class="star-icon" />
                                            </div>
                                        </div>
                                    </div>
            
                                    <div class="stats">
                                        <span class="gradient-text">27</span> ratings
                                    </div>

                                    <div class="user-other-divider d-flex justify-content-center align-items-center">
                                        <button class="btn secondary"> View </button>
                                        <div class="divider"></div>
                                    </div>
                                </div>
            
                                <div class="user-products d-flex justify-content-between pos-relative">
                                    <div class="products-heading d-flex gap-32 align-items-center">
                                        <div class="heading">Products</div>
                                    </div>
            
                                    <div class="stats d-flex gap-24">
                                        <div> <span class="gradient-text">12</span> sold </div>
                                        <div> <span class="gradient-text">3</span> on sale </div>
                                        <div> <span class="gradient-text">7</span> bought </div>
                                    </div>

                                    <div class="user-other-divider d-flex justify-content-center align-items-center">
                                        <button class="btn secondary"> View </button>
                                        <div class="divider"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                </div>
            </div>
        </section>

        <Footer></Footer>
    </div>
</template>

<script>
import Header from '../Header.vue';
import Footer from '../Footer.vue';
import { Icon } from '@iconify/vue';

import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'UserProfileContent',

    inject: ['emitter', 'userApi'],
    emits: [],

    props: {

    },

    components: {
        Header,
        Footer,
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

            }
        ),

        async getUser() {
            this.emitter.emit("show-loader");

            try {
                const resp = await this.userApi.getUserById(this.$route.params.id);
                this.user = resp.data;
                console.log("eh", this.user);
            } catch (err) {
                console.error(err);
                // this.$router.push("/404");
            }

            this.emitter.emit("hide-loader");
        },

        showAvatarUpload() {
            
        }
    },
    
    computed: {
        ...mapGetters(
            {
                getLoggedUser: "user/getUser"
            }
        ),
    },

    created() {
        this.getUser();
    },

    mounted() {

    }
}
</script>

<style scoped>
.user-main-info {
    margin-top: 72px;
}

.user-avatar-cont, .default-avatar-cont {
    flex: 1;
    width: 224px;
    height: 224px;
    max-width: 224px;
    max-height: 224px;
    border-radius: 50%;
}
.user-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    aspect-ratio: 1 / 1;
}

.default-avatar-cont {
    font-size: 96px;
    background: var(--white-5a);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.user-avatar-cont:hover .upload-overlay {
    opacity: 1;
}

.upload-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.75);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 72px;
    opacity: 0;
    transition: opacity 0.2s ease-out;
    cursor: pointer;
}

.user-info {
    flex: 3;
}

.name h1 {
    font-weight: bold;
    font-size: 32px;
    
}

.admin-badge {
    padding: 4px 24px;
    font-weight: bold;
    background-color: var(--accent);
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--black);
}

.joined-on span {
    font-weight: 300;
    letter-spacing: 4.8px;
    line-height: normal;
}

.stats {
    font-size: 14px;
}

.stats span {
    font-weight: 800;
}

.user-other .heading {
    font-size: 18px;
    font-weight: bold;
    text-transform: uppercase;
}

.stars {
    gap: 4px;
}

.user-other-divider {
    position: absolute;
    bottom: -24px;
    left: 0;
    width: 100%;
}

.user-other-divider .divider {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
    height: 1px;
    background-color: var(--white-15a);
}

.user-other-divider .btn {
    padding: 2px 24px;
    font-weight: 600;
    text-transform: capitalize;
}
</style>