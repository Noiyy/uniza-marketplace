<template>
    <div class="product-detail-content content-wrapper">
        <Header></Header>

        <section id="product-detail">
            <div class="container">
                <div class="content">

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
                                        <button class="btn primary btn-icon" @click="deleteProduct()">
                                            <Icon icon="mdi:trash" class="opt-icon" />
                                        </button>
                                        <button class="btn primary btn-icon" @click="editProduct()">
                                            <Icon icon="mdi:pencil" class="opt-icon" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="line-divider"></div>
                        </div>

                        <div class="product-main">
                            <div class="product-showcase d-flex gap-32">
                                <div class="main-img-cont pos-relative">
                                    <img v-if="product.images && product.images.length" :src="getMainImg()" class="img-fluid" />
                                    <span> {{ shownMainImgIndex+1 }}/{{ product.images.length }} </span>

                                    <Icon icon="gridicons:fullscreen" class="main-img-icon fullscreen" />
                                    <Icon icon="material-symbols:bookmark-outline" class="main-img-icon bookmark" />

                                    <Icon icon="material-symbols:chevron-left" class="main-img-icon prev" @click="showPrevImage()" />
                                    <Icon icon="material-symbols:chevron-right" class="main-img-icon next" @click="showNextImage()" />
                                </div>
                                <div class="images-price d-flex flex-column gap-24 align-items-end">
                                    <div class="price d-flex gap-24 align-items-center">
                                        <h3 class="gradient-text"> Price </h3>
                                        <span v-if="product.price.specialValue"> {{ product.price.specialValue }} </span>
                                        <span v-else> {{ product.price.value.$numberDecimal }}€ </span>      
                                    </div>
                                    <div class="other-images-wrapper d-flex flex-wrap gap-8 scrollbar">
                                        <template v-if="product.images && product.images.length">
                                            <img v-for="(image, index) in product.images" :key="index" 
                                                :src="getAssetUrl(`img/products/${image}`)" class="img-fluid"
                                                @mouseover="shownMainImgIndex = index"
                                    
                                            /> <!--  @mouseleave="shownMainImgIndex = null" -->
                                        </template>
                                    </div>
                                </div>
                            </div>
                            <div class="under-showcase">

                            </div>
                        </div>

                        <div class="product-description">

                        </div>

                        <div class="product-misc-options">

                        </div>
                    </div>

                    <div class="product-history">

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
    name: 'ProducDetailContent',

    inject: ['emitter', 'productApi'],
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
        Icon
    },

    data() {
        return {
            pageTitle: null,
            product: null,
            productMainCtg: null,
            productSubCtg: null,

            shownMainImgIndex: 0
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

        deleteProduct() {

        },

        editProduct() {

        }
    },
    
    computed: {
        ...mapGetters(
            {
                getAllCategories: "product/getAllCategories",
            }
        ),
    },

    async created() {
        this.emitter.emit("show-loader");   
        await this.getProductDetail();

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
    background: rgba(255, 255, 255, 0.05);
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
    font-family: "Montserrat", serif;
}

.other-images-wrapper img {
    border-radius: 8px;
    max-width: 112px; 
}
</style>