<template>
    <div class="product-wrapper" :class="isPreview ? 'preview' : ''">
        <div class="product-heading d-flex flex-column gap-8">
            <div class="heading-main d-flex justify-content-between gap-32">
                <div class="product-title d-flex flex-column gap-8 ">
                    <div class="breadcrumbs d-flex gap-8" v-if="!isPreview">
                            <router-link to="/browse"> Browse </router-link>
                            <span> > </span>
                            <router-link :to="`/browse?ctg=${productMainCtg.name}`" v-if="productMainCtg">
                                {{ productMainCtg.name }}
                            </router-link>
                            <span v-if="productSubCtg"> > </span>
                            <router-link :to="`/browse?ctg=${productSubCtg.name}`" v-if="productSubCtg">
                                {{ productSubCtg.name }} 
                            </router-link>
                        </div>
                    <div class="product-title-text">
                        <h1 class="gradient-text"> {{ product.title }} </h1>
                    </div>
                </div>

                <div class="product-heading-options d-flex align-items-center">
                    <div class="options-wrapper d-flex gap-16 align-items-center" v-if="!isPreview">
                        <div class="back d-flex align-items-center" @click="$router.back()">
                            <Icon icon="mdi:arrow-left-top" class="back-icon" />
                            back
                        </div>
                        <template v-if="getLoggedUser && (getLoggedUser._id == product.sellerId || getLoggedUser.isAdmin)">
                            <button class="btn primary btn-icon" @click="deleteProduct()">
                                <Icon icon="mdi:trash" class="opt-icon" />
                            </button>
                            <router-link :to="`/product/${product._id}/edit`" role="button" class="btn primary btn-icon">
                                <Icon icon="mdi:pencil" class="opt-icon" />
                            </router-link>
                            <router-link :to="{ path: `/product/${product._id}/edit`, hash: '#sales' }" role="button" class="btn primary btn-icon">
                                <Icon icon="material-symbols:shopping-cart" class="opt-icon" />
                            </router-link>
                        </template>
                    </div>
                </div>
            </div>

            <div class="line-divider" v-if="!isPreview"></div>
        </div>

        <div class="product-main">
            <div class="product-showcase d-flex gap-48">
                <div class="main-img-cont pos-relative">
                    <img v-if="productHasImages" :src="getMainImg()" class="img-fluid" />
                    <img v-else :src="getAssetUrl('img/logo-sm_dark.svg')" aria-hidden="true" class="no-img img-fluid">
                    <span v-if="productHasImages" class="product-images-count"> 
                        {{ shownMainImgIndex+1 }}/{{ product.images.length }}
                    </span>

                    <Icon v-if="productHasImages" icon="gridicons:fullscreen" class="main-img-icon fullscreen" @click="imgLightboxVisible = true" />
                    <Icon v-if="!isPreview && getLoggedUser" icon="material-symbols:bookmark-outline" class="main-img-icon bookmark" @click="bookmarkProduct()" />

                    <Icon v-if="productHasImages" icon="material-symbols:chevron-left" class="main-img-icon prev" @click="showPrevImage()" />
                    <Icon v-if="productHasImages" icon="material-symbols:chevron-right" class="main-img-icon next" @click="showNextImage()" />
                </div>
                <div class="images-price d-flex flex-column gap-24 align-items-end">
                    <div class="price d-flex gap-24 align-items-center">
                        <h3 class="gradient-text"> Price </h3>
                        <span class="montserrat" v-if="product.price.specialValue"> {{ product.price.specialValue }} </span>
                        <span class="montserrat" v-else> {{ product.price.value && typeof product.price.value === "string" ?
                            product.price.value :
                            product.price.value.$numberDecimal
                        }}€ </span>      
                    </div>
                    <div class="other-images-wrapper" :class="!loadedData ? 'loading' : ''">
                        <template v-if="productHasImages && loadedData">
                            <img v-for="(image, index) in product.images" :key="index" 
                                :src="image.url ? image.url : getAssetUrl(`img/products/${image}`)" class="img-fluid"
                                @mouseover="shownMainImgIndex = index"
                                @click="imgLightboxVisible = true"
                    
                            /> <!--  @mouseleave="shownMainImgIndex = null" -->
                        </template>
                    </div>
                </div>

                <VueEasyLightbox
                    :visible="imgLightboxVisible"
                    :imgs="product.images.map(img => img.url ? img.url : getAssetUrl(`img/products/${img}`))"
                    :index="shownMainImgIndex"
                    @hide="imgLightboxVisible = false"
                ></VueEasyLightbox>
            </div>
            <div class="under-showcase d-flex gap-32 justify-content-between">
                <div class="product-stats d-flex gap-32 align-items-end">
                    <div class="stat-cont d-flex flex-column">
                        <span> Location </span>
                        <div class="location d-flex gap-8 align-items-center">
                            <Icon icon="mdi:location" class="location-icon detail-icon" />
                            {{ getProductLocation }}
                        </div>
                    </div>

                    <div class="stat-cont d-flex flex-column">
                        <span> Views </span>
                        <div class="views d-flex gap-8 align-items-center">
                            <Icon icon="mdi:eye" class="views-icon detail-icon" />
                            2719x
                        </div>
                    </div>

                    <div class="stat-cont d-flex flex-column">
                        <span> Count </span>
                        <div class="count d-flex gap-8 align-items-center">
                            <Icon icon="fluent:book-number-24-regular" class="count-icon detail-icon" />
                            {{ product.count.available }}
                        </div>
                    </div>
                </div>

                <div class="product-seller-info d-flex gap-32">
                    <div class="seller-btns d-flex gap-16 align-items-end">
                        <button class="btn secondary smaller" :disabled="isPreview" @click="openChatWithSeller()" v-if="getLoggedUser"> MESSAGE </button>
                        <button class="btn primary smaller" :disabled="isPreview" @click="copyTelNumber()" v-if="userPhone"> 
                            <Icon icon="ic:baseline-phone" class="phone-icon" />
                            {{ userPhone }}
                        </button>
                    </div>
                    <router-link :to="`/user/${product.sellerId}`" class="seller d-flex flex-column gap-8 text-end">
                        <span> Seller </span>

                        <div class="d-flex gap-8">
                            <div class="rating-values d-flex gap-8 align-items-end">
                                <span> {{ userRatingAvg }} </span>
                                <Icon icon="material-symbols:star" class="star-icon" v-if="userRatingAvg >= 1" />
                                <Icon icon="material-symbols:star-half" class="star-icon" v-else-if="userRatingAvg > 0" />
                                <Icon icon="material-symbols:star-outline" class="star-icon" v-else />
                            </div>
                            <div class="user-avatar-cont pos-relative">
                                <img :src="getAssetUrl(`img/userAvatars/${userAvatarPath}`)" class="user-avatar" alt="User avatar" v-if="userAvatarPath">
                                <div class="default-avatar-cont" v-else>
                                    <Icon icon="akar-icons:person" class="default-avatar-icon" />
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>

        <div class="product-description ql-editor">
            <div v-html="product.description"></div>
        </div>

        <div class="product-misc-options pos-relative" v-if="!isPreview">
            <div class="options-wrapper d-flex gap-32">
                <div class="pattern" :style="patternBgStyle"></div>

                <div class="option d-flex gap-8 align-items-center" @click="viewSimilarProducts()">
                    <Icon icon="lsicon:tree-filled" class="opt-icon" />
                    <span class="montserrat"> View similar </span>
                </div>

                <div class="option pos-relative">
                    <div class="d-flex gap-8 align-items-center share-btn"  @click="shareIsOpen = !shareIsOpen">
                        <Icon icon="mdi:share" class="opt-icon" />
                        <span class="montserrat"> Share </span>
                    </div>

                    <ShareButtons v-if="shareIsOpen"
                        :classes="shareIsOpen ? 'open' : ''"
                        :product-data="product"
                        :share-is-open="shareIsOpen"
                    ></ShareButtons>
                </div>

                <div class="option d-flex gap-8 align-items-center" @click="doPrint()">
                    <Icon icon="material-symbols:print" class="opt-icon" />
                    <span class="montserrat"> Print </span>
                </div>

                <div class="option d-flex gap-8 align-items-center" @click="doReport()">
                    <Icon icon="mdi:alert" class="opt-icon" />
                    <span class="montserrat"> Report </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ShareButtons from './ShareButtons.vue';
import VueEasyLightbox from 'vue-easy-lightbox';

import { Icon } from '@iconify/vue';

import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'ProductDetail',

    inject: ['emitter', 'userApi', 'feedbackApi'],
    emits: [],

    props: {
        product: {
            type: Object,
            default: null
        },

        productMainCtg: {
            type: Object,
            default: null
        },

        productSubCtg: {
            type: Object,
            default: null
        },

        isPreview: {
            type: Boolean,
            default: false
        }
    },

    components: {
        ShareButtons,
        VueEasyLightbox,
        Icon
    },

    data() {
        return {
            shownMainImgIndex: 0,
            imgLightboxVisible: false,

            patternImgSrc: this.getAssetUrl("img/noise_texture.png"),

            shareIsOpen: false,
                        
            userAddress: null,
            userAvatarPath: null,
            userRatingAvg: null,
            userPhone: null,

            loadedData: false
        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),

        async getUser() {
            try {
                const resp = await this.userApi.getUserById(this.product.sellerId);
                this.userAddress = resp.data.address;
                this.userAvatarPath = resp.data.avatarPath;
                this.userPhone = resp.data.phone;
            } catch (err) {
                console.error(err);
                // this.$router.push("/404");
            }
        },

        async getUserRatings() {
            try {
                const resp = await this.feedbackApi.getUserRatings(this.product.sellerId);
                const ratings = [...resp.data.self.map(rt => ({...rt, type__: "self"}))];

                this.userRatingAvg = this.getUserRatingAvg(ratings);

            } catch (err) {
                console.error(err);
            }
        },

        getMainImg() {
            const indx = this.shownMainImgIndex;
            const shownImg = this.product.images[indx ? indx : 0];
            return shownImg.url ? shownImg.url : this.getAssetUrl(`img/products/${shownImg}`);
        },

        showPrevImage() {
            if (this.shownMainImgIndex > 0) this.shownMainImgIndex--;
            else this.shownMainImgIndex = this.product.images.length-1;
        },

        showNextImage() {
            if (this.shownMainImgIndex+1 < this.product.images.length) this.shownMainImgIndex++;
            else this.shownMainImgIndex = 0;
        },

        bookmarkProduct() {

        },

        async deleteProduct() {
            this.emitter.emit("show-loader");
            try {
                const resp = await this.productApi.deleteProduct(this.product._id);

                if (resp.data.delProductId) {
                    this.$toast.success("ProductDeleteSuccess");
                    this.$router.push({ name: "Browse" });
                } else this.$toast.error("ProductDeleteFailed");

            } catch (err) {
                console.error(err);
                this.$toast.error("ProductDeleteFailed");
            }

            this.emitter.emit("hide-loader");
        },

        doPrint() { window.print(); },

        doReport() {

        },

        viewSimilarProducts() {
            
        },

        openChatWithSeller() {

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
    },
    
    computed: {
        ...mapGetters(
            {
                getLoggedUser: "user/getUser"
            }
        ),

        patternBgStyle() {
            return `
                background: url(${this.patternImgSrc}) 0% 0% / 80% 150% repeat`;
        },

        productHasImages() {
            return this.product && this.product.images && this.product.images.length;
        },

        getProductLocation() {
            if (this.product) {
                const customAddress = this.product.address.custom;
                if (customAddress) {
                    return customAddress.dorm ? 
                        customAddress.dorm :
                        `${customAddress.city} - ${customAddress.region} - ${customAddress.postalCode}`;
                } else if (this.product.address.asProfile) {
                    let address = this.userAddress;
                    if (address) {
                        return address.dorm ?
                            address.dorm :
                            `${address.city} - ${address.region} - ${address.postalCode}`;
                    } else return "invalid";
                } else {
                    return "-";
                }
            }
        }
    },

    async created() {
        await this.getUser();
        await this.getUserRatings();

        this.emitter.emit("hide-loader");
    },

    mounted() {
        this.loadedData = true;
        this.emitter.on("loaded-edit-component", (name) => {
            if (name !== 'ProductDetail') {
                this.loadedData = false;
                return;
            }

            setTimeout(() => {
                this.loadedData = true;
                console.log("more",this.product);
            }, 500);
        });
    }
}
</script>

<style scoped>
.product-wrapper.preview {
    margin-top: 48px;
}

.back {
    gap: 4px;
    cursor: pointer;
}

.back-icon {
    font-size: 24px;
    color: var(--primary);
}

.product-title-text h1 {
    font-size: 24px;
    line-height: 16px;
    font-weight: bold;
}

.product-main {
    margin-top: 32px;
}

.product-showcase > div {
    min-width: 45%;
}

.product-showcase .main-img-cont {
    flex: 1.5;
    max-width: 500px;
    border-radius: 16px;
    overflow: hidden;
    height: 25vw;
}

.main-img-icon {
    position: absolute;
    color: var(--white);
    font-size: 32px;
    filter: drop-shadow(0px 0px 5px #000000);
    cursor: pointer;
    transition: scale 0.2s ease-out;
}
.main-img-icon:hover {
    scale: 1.2;
}
.main-img-icon.fullscreen {
    top: 8px;
    right: 8px;
}
.main-img-icon.bookmark {
    bottom: 8px;
    right: 8px;
}
.main-img-icon.next {
    top: 50%;
    transform: translateY(-50%);
    right: 8px;
}
.main-img-icon.prev {
    top: 50%;
    transform: translateY(-50%);
    left: 8px;
}

.main-img-cont span {
    position: absolute;
    top: 16px;
    left: 16px;
    color: var(--white);
    font-size: 14px;
    filter: drop-shadow(0px 0px 5px #000000);
}

.product-showcase img {
    object-fit: cover;
    background: rgba(255, 255, 255, 0.075);
}

.product-showcase .main-img-cont img {
    height: 100%;
    width: 100%;
}

.product-showcase .images-price {
    flex: 1;
}

.product-showcase .images-price .price h3 {
    font-size: 18px;
    font-weight: 800;
}

.product-showcase .images-price .price span {
    background: var(--white);
    color: var(--black);
    padding: 4px 16px;
    line-height: 100%;
    border-bottom-left-radius: 16px;
    font-size: 24px;
    font-weight: 800;
}

.other-images-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    grid-auto-rows: 60px;
    gap: 12px;

    width: 100%;
    min-height: 15vw;
    max-height: 21vw;
    overflow: auto;
}
.other-images-wrapper.loading {
    background-color: var(--white-5a);
}

.other-images-wrapper img {
    border-radius: 8px;
    cursor: pointer;
    object-fit: cover;
    height: 100%;
    width: 100%;
}

.under-showcase {
    margin-top: 8px;
}

.stat-cont {
    gap: 4px;
}

.stat-cont span {
    font-weight: 200;
    font-size: 14px;
}

.stat-cont .detail-icon {
    opacity: 0.33;
    font-size: 24px;
}

.user-avatar-cont {
    transition: filter 0.2s ease-in;
}
.seller:hover .user-avatar-cont {
    filter: brightness(0.66);
}

.user-avatar-cont, .default-avatar-cont {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    max-width: 48px;
    max-height: 48px;
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
    font-size: 24px;
    background: var(--white-5a);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.seller:hover {
    color: var(--white);
}

.seller > span {
    margin-right: 6px;
}

.product-description {
    margin-top: 40px;
}

.product-misc-options .option {
    cursor: pointer;
}

.product-misc-options .option span {
    font-weight: bold;
}

.product-misc-options .opt-icon {
    font-size: 24px;
    color: var(--primary);
}

.product-misc-options {
    margin-top: 32px;
    padding: 1px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(255, 154, 158, 0) 0%, rgba(255, 154, 158, 0.5) 100%);
}

.product-misc-options .options-wrapper {
    padding: 18px 30px;
    border-radius: 16px;
    position: relative;
}

.product-misc-options .options-wrapper .option {
    z-index: 2;
    user-select: none;
    transition: color 0.15s ease-in;
}
.product-misc-options .options-wrapper .option:hover {
    color: rgba(255, 255, 255, 0.66);
}

.product-misc-options .pattern {
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    border-radius: 100px;
}
.product-misc-options .pattern::before {
    border-radius: 14px;
    content: "";
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    background: rgba(26, 21, 18, 0.97);
    backdrop-filter: blur(20px);
}

.location {
    font-size: 14px;
}

.product-images-count {
    user-select: none;
}

.seller-btns .btn {
    font-size: 14px;
}

.rating-values {
    margin-bottom: 6px;
}

/* XL */
@media(min-width: 1400px) { 
    .product-showcase .main-img-cont {
        height: 20vw;
    }
}
</style>