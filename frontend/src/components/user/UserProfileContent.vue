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

                            <form enctype="multipart/form-data" class="upload-overlay" v-if="getLoggedUser && (getLoggedUser._id == $route.params.id || getLoggedUser.isAdmin)"
                                @submit.prevent="uploadUserAvatar" @click="triggerFileInput">
                                <input ref="avatarInput" name="image" @change="onFileChange" style="display: none"
                                    type="file" accept=".jpg, .jpeg, .png, .webp" />
                                <Icon icon="mdi:camera-outline" class="upload-icon" />
                            </form>
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
                                            <span> 4,7 </span>
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
                                        <span class="gradient-text"> {{ userRatings.filter(rt => rt.type__ == "self").length }} </span>
                                        {{ userRatings.filter(rt => rt.type__ == "self").length > 1 ? 'ratings' : 'rating' }}
                                    </div>

                                    <div class="view-divider d-flex justify-content-center align-items-center">
                                        <button class="btn secondary" @click="viewRatings()"> View </button>
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

                                    <div class="view-divider d-flex justify-content-center align-items-center">
                                        <button class="btn secondary" @click="viewProducts()"> View </button>
                                        <div class="divider"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <UserItems v-if="loadedProducts && loadedRatings"
                        :products="userProducts"
                        :ratings="userRatings"
                    ></UserItems>

                </div>
            </div>
        </section>

        <Footer></Footer>
    </div>
</template>

<script>
import Header from '../Header.vue';
import Footer from '../Footer.vue';
import UserItems from './UserItems.vue';
import { Icon } from '@iconify/vue';

import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'UserProfileContent',

    inject: ['emitter', 'userApi', 'productApi', 'feedbackApi'],
    emits: [],

    head() {
        return {
            title: this.pageTitle
        }
    },

    props: {

    },

    components: {
        Header,
        Footer,
        UserItems,
        Icon
    },

    data() {
        return {
            user: null,
            userProducts: [],
            userRatings: [],
            loadedProducts: false,
            loadedRatings: false,

            selectedAvatarFile: null,

            pageTitle: null
        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),

        async getUser() {
            try {
                const resp = await this.userApi.getUserById(this.$route.params.id);
                this.user = resp.data;
                this.pageTitle = `${this.user.username} - UNIZA Marketplace`;
                console.log("user", this.user);
            } catch (err) {
                console.error(err);
                // this.$router.push("/404");
            }
        },

        async getUserProducts() {
            try {
                const resp = await this.productApi.getUserProducts(this.$route.params.id);
                this.userProducts = resp.data;
                this.loadedProducts = true;
                console.log("user products", this.userProducts);

            } catch (err) {
                console.error(err);
            }
        },

        async getUserRatings() {
            try {
                const resp = await this.feedbackApi.getUserRatings(this.$route.params.id);
                const ratings = [...resp.data.self.map(rt => ({...rt, type__: "self"})), ...resp.data.others.map(rt => ({...rt, type__: "others"}))];
                this.userRatings = ratings;
                this.loadedRatings = true;
                console.log("user ratings", this.userRatings);

            } catch (err) {
                console.error(err);
            }
        },

        triggerFileInput() {
            this.$refs.avatarInput.click();
        },

        onFileChange(event) {
            this.selectedAvatarFile = event.target.files[0];

            if (this.selectedAvatarFile) {
                this.uploadUserAvatar();
            }
        },

        async uploadUserAvatar() {
            if (!this.selectedAvatarFile) return this.$toast.warning("PleaseSelectFile");

            const formData = new FormData();
            formData.append('image', this.selectedAvatarFile);
            formData.append('prevFilename', this.user.avatarPath);
            formData.append('userId', this.user._id);

            try {
                const resp = await this.userApi.uploadAvatar(formData);
                if (resp.data.file) {
                    this.user.avatarPath = resp.data.file.filename;
                    this.$toast.success("SavedAvatarSuccess");
                } else {
                    this.$toast.error("SavedAvatarFailed");
                }


            } catch (err) {
                console.error(err);
            }
        },

        viewProducts() {
            const el = document.querySelector(".user-products");
            el.scrollIntoView();
        },

        viewRatings() {
            const el = document.querySelector(".user-ratings");
            el.scrollIntoView();
        }
    },

    computed: {
        ...mapGetters(
            {
                getLoggedUser: "user/getUser"
            }
        ),
    },

    async created() {
        this.emitter.emit("show-loader");
        await this.getUser();
        await this.getUserProducts();
        await this.getUserRatings();

        this.emitter.emit("hide-loader");
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

.rating-values span {
    font-weight: 600;
}
</style>