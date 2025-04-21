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

                            <form enctype="multipart/form-data" class="upload-overlay" v-if="canEdit"
                                @submit.prevent="uploadUserAvatar" @click="triggerFileInput">
                                <input ref="avatarInput" name="image" @change="onFileChange" style="display: none"
                                    type="file" accept=".jpg, .jpeg, .png, .webp" />
                                <Icon icon="mdi:camera-outline" class="upload-icon" />
                            </form>
                        </div>

                        <div class="user-info d-flex flex-column gap-64 justify-content-between">
                            <div class="d-flex flex-column gap-8">
                                <div class="user-heading d-flex gap-16 justify-content-between">
                                    <div class="name d-flex gap-24 align-items-center">
                                        <h1 class="gradient-text"> {{ user.username }} </h1>
                                        <div class="admin-badge" v-if="user.isAdmin">
                                            ADMIN
                                        </div>
                                        <div class="admin-badge banned-badge" v-if="user.ban && user.ban.isBanned">
                                            BANNED
                                        </div>
                                    </div>
    
                                    <div class="joined-on d-flex gap-32 align-items-center">
                                        <span> {{ isoToDateString(user.createdAt) }} </span>
                                        Joined on
                                    </div>
                                </div>

                                <div class="user-misc-info d-flex gap-16 justify-content-between">
                                    <div class="location d-flex gap-8 align-items-center">
                                        <Icon icon="mdi:location" class="location-icon" />
                                        {{ getUserLocation }}
                                    </div>

                                    <div class="d-flex gap-24">
                                        <div class="contact-info d-flex gap-8">
                                            <button class="btn btn-icon" @click="openChatWithUser()" v-if="getLoggedUser"
                                                :disabled="!getLoggedUser || getLoggedUser._id == user._id || user.ban && user.ban.isBanned"
                                                style="border: none">
                                                <Icon icon="humbleicons:chat" class="chat-icon" />
                                            </button>
                                            <button class="btn primary smaller" @click="copyTelNumber()" v-if="user.phone"> 
                                                <Icon icon="ic:baseline-phone" class="phone-icon" />
                                                {{ user.phone }}
                                            </button>
                                        </div>

                                        <div class="settings-btn-cont" v-if="canEdit">
                                            <button class="btn btn-icon" @click="settingsModalIsShown = true">
                                                <Icon icon="mdi:cog" class="settings-icon" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="user-other d-flex flex-column gap-40">
                                <div class="user-rating d-flex justify-content-between pos-relative">
                                    <div class="rating-heading d-flex gap-32 align-items-center">
                                        <div class="heading">Rating</div>
                                        <div class="rating-values d-flex gap-8 align-items-center">
                                            <span> {{ userRatingAvg >= 0 ? userRatingAvg : "?" }} </span>
                                            <div class="stars d-flex">
                                                <template v-for="fullStar in Math.floor(userRatingAvg)" :key="fullStar">
                                                    <Icon icon="material-symbols:star" class="star-icon" />
                                                </template>
                                                <template v-if="(userRatingAvg - (Math.floor(userRatingAvg))) > 0">
                                                    <Icon icon="material-symbols:star-half" class="star-icon" />
                                                </template>
                                                <template v-for="emptyStar in (5 - (Math.floor(userRatingAvg) + Math.ceil((userRatingAvg - (Math.floor(userRatingAvg))))))" :key="emptyStar">
                                                    <Icon icon="material-symbols:star-outline" class="star-icon empty" />
                                                </template>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="stats">
                                        <span class="gradient-text"> {{ userRatings.filter(rt => rt.type__ == "self").length }} </span>
                                        {{ userRatings.filter(rt => rt.type__ == "self").length > 1 ? 'ratings' : 'rating' }}
                                    </div>

                                    <div class="view-divider full d-flex justify-content-center align-items-center">
                                        <button class="btn secondary" @click="viewRatings()"> View </button>
                                        <div class="divider"></div>
                                    </div>
                                </div>

                                <div class="user-products d-flex justify-content-between pos-relative">
                                    <div class="products-heading d-flex gap-32 align-items-center">
                                        <div class="heading">Products</div>
                                    </div>

                                    <div class="stats d-flex gap-24">
                                        <div> <span class="gradient-text"> {{ getSoldProductsCount() }} </span> sold </div>
                                        <div> <span class="gradient-text"> {{ userProducts.filter(pr => pr.status == "onSale").length }} </span> on sale </div>
                                        <div> <span class="gradient-text"> {{ user.boughtProducts }} </span> bought </div>
                                    </div>

                                    <div class="view-divider full d-flex justify-content-center align-items-center">
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
                        :user="user"
                    ></UserItems>

                </div>
            </div>
        </section>

        <!-- settings modal -->
        <Modal v-if="canEdit"
            v-model:is-shown="settingsModalIsShown"
            :header-text="modalHeading"
            :modal-id="'user-settings-modal'"
            @close="closeSettingsModal()">
            <template #body>
                <div class="d-flex flex-column gap-32">
                    <div class="input-row address-inputs d-flex gap-32 align-items-center justify-content-between">
                        <div class="input-cont d-flex flex-column gap-8 flex-1">
                            <div class="input-tag"> Address </div>
                            <Multiselect
                                v-model="userAddress"
                                :options="filteredAddresses"
                                @search-change="onAddressSearchChange"
                                :internal-search="false"
                                :allow-empty="true"
                                :multiple="false"
                                :show-labels="false"
                                :track-by="'_id'"
                                >
                                <template #option="props">
                                    {{ props.option.city }} - {{ props.option.region }} - {{ props.option.postalCode }}
                                </template>
                                <template #singleLabel="props">
                                    {{ props.option.city }} - {{ props.option.region }} - {{ props.option.postalCode }}
                                </template>
                            </Multiselect>
                        </div>
    
                        <span class="input-row-divider montserrat"> Or </span>
    
                        <div class="input-cont d-flex flex-column gap-8 flex-1">
                            <div class="input-tag"> Dorm </div>
                            <Multiselect
                                v-model="userDorm"
                                :options="getDorms"
                                :allow-empty="true"
                                :multiple="false"
                                :show-labels="false"
                            ></Multiselect>
                        </div>
                    </div>
    
                    <div>
                        <div class="input-cont d-flex flex-column gap-8">
                            <div class="input-tag"> Phone number </div>
                            <VueTelInput
                                v-model="userPhone"

                                :inputOptions="telInputOptions"
                                :preferred-countries="preferredCountries"
                                :mode="telInputMode"
                                :valid-characters-only="telInputValidCharactersOnly"
                                @input="telInputHandler"
                                @validate="validatePhone">
                            </VueTelInput>
                        </div>
                    </div>
    
                    <div class="btns-cont d-flex gap-16 justify-content-center">
                        <button class="btn secondary" @click="closeSettingsModal()"> Cancel </button>
                        <button class="btn primary" @click="saveUserSettings()"> Save </button>
                    </div>
                </div>
            </template>
        </Modal>

        <Footer></Footer>
    </div>
</template>

<script>
import Header from '../Header.vue';
import Footer from '../Footer.vue';
import UserItems from './UserItems.vue';
import Modal from '../Modal.vue';

import Multiselect from 'vue-multiselect';
import "vue-multiselect/dist/vue-multiselect.min.css";

import { VueTelInput } from 'vue-tel-input';
import 'vue-tel-input/vue-tel-input.css';

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
        Icon,
        Modal,
        Multiselect,
        VueTelInput
    },

    data() {
        return {
            user: null,
            userProducts: [],
            userRatings: [],
            loadedProducts: false,
            loadedRatings: false,
            userRatingAvg: null,

            selectedAvatarFile: null,

            pageTitle: null,

            settingsModalIsShown: false,
            modalHeading: "User settings",
            filteredAddresses: [],

            userAddress: null,
            userDorm: null,
            userPhone: null,

            userPhoneNumIsValid: false,
            telInputOptions: {
                placeholder: 'CisloPlaceholder',
                showSearchBox: true,
                searchBoxPlaceholder: "HladajKrajinu",
                required: false,
            },
            telInputValidCharactersOnly: true,
            telInputMode: "international",
            preferredCountries: [
                "sk", "cz", "ua", "pl", "at", "hu", "ro", "de", "fr"
            ]
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

                this.userAddress = resp.data.address && !resp.data.address.dorm ? resp.data.address : null;
                this.userDorm = resp.data.address && resp.data.address.dorm ? resp.data.address.dorm : null;
                this.userPhone = resp.data.phone;

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
                this.userProducts = [];
                this.loadedProducts = true;
            }
        },

        async getUserRatings() {
            try {
                const resp = await this.feedbackApi.getUserRatings(this.$route.params.id);
                const ratings = [...resp.data.self.map(rt => ({...rt, type__: "self"})), ...resp.data.others.map(rt => ({...rt, type__: "others"}))];
                this.userRatings = ratings;
                this.loadedRatings = true;
                console.log("user ratings", this.userRatings);

                this.userRatingAvg = this.getUserRatingAvg(ratings.filter(rt => rt.type__ == "self"));

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
                console.log("man", resp);
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
            this.emitter.emit("show-hidden-user-products");
        },

        viewRatings() {
            const el = document.querySelector(".user-ratings");
            el.scrollIntoView();
            this.emitter.emit("show-hidden-user-ratings");
        },

        getSoldProductsCount() {
            return this.userProducts.reduce((acc, current) => acc + current.count.sold, 0);
        },

        closeSettingsModal() {
            this.settingsModalIsShown = false;
        },

        openChatWithUser() {

        },

        copyTelNumber() {
            navigator.clipboard.writeText(this.userPhone)
                .then(() => {
                    this.$toast.info(`PhoneCopySuccess: ${this.userPhone}`)
                })
                .catch(err => {
                    this.$toast.error("PhoneCopyFailed");
                    console.error('Failed to copy: ', err);
                });
        },

        telInputHandler(event) {
            console.log(this.userPhone);
            if (this.userPhone.length > 16) {
                this.phoneNum = this.phoneNum.slice(0, this.phoneNum.length-2);
            }
        },

        validatePhone(phoneObj) {
            if (!phoneObj || !phoneObj.valid) this.userPhoneNumIsValid = false;
            else this.userPhoneNumIsValid = true;
        },

        onAddressSearchChange(searchQuery) {
            this.filteredAddresses = this.getSearchedAddresses(this.userAddress, this.getAllPSC, searchQuery);
        },

        async saveUserSettings() {
            const address = {
                dorm: this.userDorm ? this.userDorm.dorm : null,
                region: this.userAddress ? this.userAddress.region : null,
                city: this.userAddress ? this.userAddress.city : null,
                postalCode: this.userAddress ? this.userAddress.postalCode : null
            }

            if (this.userPhone && !this.userPhoneNumIsValid) {
                this.$toast.error("InvalidPhoneNumber");
                return;
            }
            if (!this.userDorm && !this.userAddress && !this.userPhone) {
                this.$toast.error("NothingToSave");
                return;
            }

            this.emitter.emit("show-loader");

            const post = {
                address,
                phone: this.userPhone
            };
            console.log("save post", post);

            try {
                const resp = await this.userApi.updateUserSettings(this.user._id, post);
                console.log("did?", resp);
                if (resp.data.success) {
                    this.$toast.success("UpdateUserSettingsSuccess");
                    await this.getUserData();
                    this.closeSettingsModal();
                } else {
                    this.$toast.error("UpdateUserSettingsFailed");
                }

                this.emitter.emit("hide-loader");
            } catch (err) {
                this.$toast.error("UpdateUserSettingsFailed");
                this.emitter.emit("hide-loader");
                console.error(err);
            }
        },

        async getUserData(addedRating) {
            this.emitter.emit("show-loader");
            await this.getUser();
            await this.getUserProducts();
            await this.getUserRatings();
            if (addedRating) this.emitter.emit("added-rating2");

            this.emitter.emit("hide-loader");
        }
    },

    computed: {
        ...mapGetters(
            {
                getLoggedUser: "user/getUser",
                getDorms: "product/getDorms",
                getAllPSC: 'misc/getAllPSC',
            }
        ),

        canEdit() {
            const user = this.getLoggedUser;
            if (!user || !this.user) return false;

            return user && user._id == this.user._id || user && user.isAdmin;
        },

        getUserLocation() {
            if (this.user) {
                const customAddress = this.user.address;
                if (customAddress && !customAddress.dorm) {
                    return `${customAddress.city} - ${customAddress.region} - ${customAddress.postalCode}`;
                } else if (customAddress && customAddress.dorm) {
                    return customAddress.dorm;
                } else {
                    return "-";
                }
            }
        }
    },

    async created() {
        this.getUserData();
    },

    mounted() {
        setTimeout(() => {
            if (this.$route.hash) this.viewProducts();
        }, 200);

        this.filteredAddresses = this.getAllPSC;
        this.emitter.on("added-rating", () => this.getUserData(true));
    },

    watch: {
        userAddress(newVal) {
            if (newVal !== null) this.userDorm = null;
        },
        userDorm(newVal) {
            if (newVal !== null) this.userAddress = null;
        }
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

.banned-badge {
    background-color: var(--red);
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

.location-icon {
    opacity: 0.66;
    font-size: 24px;
}

.chat-icon {
    font-size: 32px;
}

.settings-btn-cont .btn {
    background-color: var(--white-15a);
    color: rgba(255, 255, 255, 0.8);
}

.address-inputs {
    margin-top: 32px;
}
/* .view-divider.full {
    bottom: 16px;
} */

.contact-info .btn {
    font-size: 14px;
}
</style>

<style>
.vue-tel-input {
    padding: 4px 8px;
    background-color: var(--black);
    color: var(--white);
    border: 2px solid var(--primary);
    border-radius: 8px;
}
.vue-tel-input:focus-within {
    box-shadow: none;
    border: 2px solid var(--secondary);
}

.vue-tel-input input {
    background: transparent;
}

.vue-tel-input .vti__dropdown-arrow {
    color: var(--white-50a);
    transition: color 0.15s ease-in;
}

.vue-tel-input .vti__dropdown:hover, .vue-tel-input .vti__dropdown.open {
    background-color: initial;
}

.vue-tel-input .vti__dropdown:hover .vti__dropdown-arrow {
    color: var(--white);
}

.vue-tel-input .vti__dropdown-list {
    background-color: var(--black);
    border: none;
    color: var(--white);
}

.vue-tel-input .vti__dropdown-item.highlighted {
    background-color: var(--white-5a);
}
</style>