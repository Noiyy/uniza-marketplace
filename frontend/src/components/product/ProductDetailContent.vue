<template>
    <div class="product-detail-content content-wrapper">
        <Header></Header>

        <section id="product-detail">
            <div class="container">
                <div class="content">

                    <div class="printable logo-for-print">
                        <img :src="getAssetUrl('img/logo-w_light.svg')" aria-hidden="true" class="img-fluid"> 
                    </div>

                    <div class="product-wrapper" v-if="product">
                        <div class="product-heading d-flex flex-column gap-8">
                            <div class="heading-main d-flex justify-content-between gap-32">
                                <div class="product-title d-flex flex-column gap-8 ">
                                    <div class="breadcrumbs d-flex gap-8">
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
                                    <div class="options-wrapper d-flex gap-16 align-items-center">
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

                            <div class="line-divider"></div>
                        </div>

                        <div class="product-main">
                            <div class="product-showcase d-flex gap-32">
                                <div class="main-img-cont pos-relative">
                                    <img v-if="productHasImages" :src="getMainImg()" class="img-fluid" />
                                    <img v-else :src="getAssetUrl('img/logo-sm_dark.svg')" aria-hidden="true" class="no-img img-fluid">
                                    <span v-if="productHasImages"> {{ shownMainImgIndex+1 }}/{{ product.images.length }} </span>

                                    <Icon v-if="productHasImages" icon="gridicons:fullscreen" class="main-img-icon fullscreen" @click="imgLightboxVisible = true" />
                                    <Icon icon="material-symbols:bookmark-outline" class="main-img-icon bookmark" @click="bookmarkProduct()" />

                                    <Icon v-if="productHasImages" icon="material-symbols:chevron-left" class="main-img-icon prev" @click="showPrevImage()" />
                                    <Icon v-if="productHasImages" icon="material-symbols:chevron-right" class="main-img-icon next" @click="showNextImage()" />
                                </div>
                                <div class="images-price d-flex flex-column gap-24 align-items-end">
                                    <div class="price d-flex gap-24 align-items-center">
                                        <h3 class="gradient-text"> Price </h3>
                                        <span class="montserrat" v-if="product.price.specialValue"> {{ product.price.specialValue }} </span>
                                        <span class="montserrat" v-else> {{ product.price.value.$numberDecimal }}€ </span>      
                                    </div>
                                    <div class="other-images-wrapper">
                                        <template v-if="productHasImages">
                                            <img v-for="(image, index) in product.images" :key="index" 
                                                :src="getAssetUrl(`img/products/${image}`)" class="img-fluid"
                                                @mouseover="shownMainImgIndex = index"
                                                @click="imgLightboxVisible = true"
                                    
                                            /> <!--  @mouseleave="shownMainImgIndex = null" -->
                                        </template>
                                    </div>
                                </div>

                                <VueEasyLightbox
                                    :visible="imgLightboxVisible"
                                    :imgs="product.images.map(img => getAssetUrl(`img/products/${img}`))"
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
                                            Žilina
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
                                        <button class="btn secondary"> MESSAGE </button>
                                        <button class="btn primary"> 
                                            <Icon icon="ic:baseline-phone" class="phone-icon" />
                                            0901 632 913
                                        </button>
                                    </div>
                                    <router-link :to="`/user/${product.sellerId}`" class="seller d-flex flex-column gap-8 text-end">
                                        <span> Seller </span>

                                        <div class="d-flex gap-8">
                                            <div class="rating-values d-flex gap-8 align-items-center">
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

                        <div class="product-misc-options pos-relative">
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

                    <div class="product-history" v-if="product">
                        <div class="history-heading d-flex flex-column gap-8">
                            <div class="d-flex gap-32 justify-content-between align-items-center">
                                <h2> PRODUCT HISTORY </h2>
                                <div class="created-at d-flex gap-24 align-items-center">
                                    Created at
                                    <span> {{ isoToDateString(product.createdAt) }} </span> 
                                </div>
                            </div>
                            <div class="line-divider"></div>
                        </div>
                    </div>

                    <div class="history-content d-flex flex-column gap-24">
                        <div class="sale-ended d-flex flex-column text-center"> <!-- v-if="saleEnded" -->
                            <div class="sale-ended-title pos-relative">
                                <h2 class="pos-relative"> sale ended </h2>
                                <div class="line-divider"></div>
                            </div>
                            <div class="date montserrat"> 18.12.2024 </div>
                        </div>

                        <div class="history-wrapper d-flex flex-column gap-16 pos-relative" :class="shownHistory ? 'shown' : ''">
                            <div class="view-divider-cont"> <!-- v-if="!shownHistory && prod.history.length &&  prod.history.length > 5" -->
                                <div class="view-divider shorter d-flex justify-content-center align-items-center">
                                    <button class="btn secondary" @click="shownHistory = !shownHistory"> View </button>
                                    <div class="divider"></div>
                                </div>
                    
                                <div class="hidden-overlay"></div>
                            </div>

                            <template v-for="(hist, index) in 7" :key="index">
                                <HistoryItem
                                    :history-data="hist"
                                ></HistoryItem>
                            </template>
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
import ShareButtons from './ShareButtons.vue';
import HistoryItem from './HistoryItem.vue';
import { Icon } from '@iconify/vue';

import VueEasyLightbox from 'vue-easy-lightbox';

import { mapGetters, mapActions } from 'vuex';

import "quill/dist/quill.core.css";

export default {
    name: 'ProducDetailContent',

    inject: ['emitter', 'productApi', 'userApi', 'feedbackApi'],
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
        Icon,
        VueEasyLightbox,
        ShareButtons,
        HistoryItem,
    },

    data() {
        return {
            pageTitle: null,
            product: null,
            productMainCtg: null,
            productSubCtg: null,

            shownMainImgIndex: 0,
            imgLightboxVisible: false,

            userAvatarPath: null,
            userRatingAvg: null,

            patternImgSrc: this.getAssetUrl("img/noise_texture.png"),

            shareIsOpen: false,
            shownHistory: false
        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),

        async getProductDetail() {
            try {
                const resp = await this.productApi.getProduct(this.$route.params.id);
                this.product = resp.data;
                this.pageTitle = `${this.product.title} - UNIZA Marketplace`;
                console.log("product", this.product);
            } catch (err) {
                console.error(err);
                // this.$router.push("/404");
            }
        },

        async getUser() {
            try {
                const resp = await this.userApi.getUserById(this.product.sellerId);
                this.userAvatarPath = resp.data.avatarPath;
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
            return this.getAssetUrl(`img/products/${this.product.images[indx ? indx : 0]}`);
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
            
        }
    },
    
    computed: {
        ...mapGetters(
            {
                getAllCategories: "product/getAllCategories",

                getLoggedUser: "user/getUser"
            }
        ),

        patternBgStyle() {
            return `
                background: url(${this.patternImgSrc}) 0% 0% / 80% 150% repeat`;
        },

        productHasImages() {
            return this.product && this.product.images && this.product.images.length;
        }
    },

    async created() {
        this.emitter.emit("show-loader");   
        await this.getProductDetail();
        await this.getUser();
        await this.getUserRatings();

        this.productMainCtg = this.getAllCategories.find(ctg => ctg._id == this.product.category.mainCategory);
        if (this.product.category.subCategory) this.productSubCtg = this.getAllCategories.find(ctg => ctg._id == this.product.category.subCategory);

        this.emitter.emit("hide-loader");
    },

    mounted() {

    }
}
</script>

<style scoped>
#product-detail {
    margin-top: 72px;
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
    border-radius: 16px;
    overflow: hidden;
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
    height: 40vh;
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
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    grid-auto-rows: minmax(90px, auto);
    gap: 12px;

    width: 100%;
    max-height: 21vw;
    overflow: auto;
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

.product-history {
    margin-top: 88px;
}

.history-heading h2 {
    font-size: 20px;
    line-height: 16px;
    font-weight: bold;
}

.created-at {
    font-size: 14px;
}

.created-at span {
    font-weight: 300;
    letter-spacing: 4px;
    line-height: normal;
}

.logo-for-print {
    display: none;
}

.logo-for-print img {
    max-width: 20%;
}

.history-content {
    margin-top: 32px;
}

.sale-ended h2 {
    color: var(--red);
    font-size: 20px;
    text-transform: uppercase;
    padding: 4px 24px;
    background: var(--black);
    font-weight: bold;
    display: inline-flex;
    z-index: 2;
}

.sale-ended .date {
    font-weight: 100;
}

.sale-ended .line-divider {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgb(229, 88, 93, 0.5);
}

.history-wrapper {
    max-height: 345px;
    overflow: hidden;
}

.history-wrapper.shown {
    max-height: initial;
    overflow: initial;
}

.history-wrapper .hidden-overlay {
    top: 0;
    height: 100%;
}

.main-img-cont .no-img {
    object-fit: initial;
    height: 75%;
    opacity: 0.2;
}

</style>

<style>
.product-description a {
    text-decoration: underline;
}
</style>