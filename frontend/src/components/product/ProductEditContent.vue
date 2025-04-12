<template>
    <div class="product-edit-content content-wrapper">
        <Header></Header>

        <section id="product-edit">
            <div class="container">
                <div class="content" v-if="product">

                    <div class="heading-cont d-flex flex-column gap-8">
                        <div class="edit-heading d-flex justify-content-between gap-32">
                            <router-link :to="`/product/${product._id}`" class="heading-title d-flex gap-8 align-items-end">
                                <h1> Edit Product </h1>
                                <Icon icon="prime:arrow-up-right" class="arrow-icon" />
                            </router-link>

                            <div class="edit-options d-flex gap-32 align-items-center">
                                <div class="nav-btns-wrapper d-flex">
                                    <button class="btn nav-btn" 
                                        @click="showProductDetail()"
                                        :class="shownComponent === 'ProductDetail' ? 'active' : ''"
                                    > 
                                        Preview 
                                    </button>
                                    <button class="btn nav-btn" 
                                        @click="showProductEditor()"
                                        :class="shownComponent === 'ProductEdit' ? 'active' : ''"
                                    > 
                                        Editor
                                    </button>
                                </div>

                                <button class="btn primary" @click="saveProduct()"> Save </button>
                            </div>
                        </div>

                        <div class="line-divider"></div>
                    </div>

                    <Transition name="fade" mode="out-in" @after-leave="changedComponent">
                        <KeepAlive>
                            <component :is="shownComponent"
                                v-if="shownComponent === 'ProductDetail' && loadedCategories"
                                :product="productEditedData"
                                :product-main-ctg="productMainCtg"
                                :product-sub-ctg="productSubCtg"
                                :is-preview="true"
                            ></component>
                        </KeepAlive>
                    </Transition>

                    <Transition name="fade" mode="out-in" @after-leave="changedComponent">
                        <KeepAlive>
                            <component :is="shownComponent"
                                v-if="shownComponent === 'ProductEdit' && loadedCategories"
                                :product="product"
                                :product-main-ctg="productMainCtg"
                                :product-sub-ctg="productSubCtg"
                                @scroll-to-sales="scrollToSales()"
                            ></component>
                        </KeepAlive>
                    </Transition>
                </div>
            </div>
        </section>

        <Footer></Footer>
    </div>
</template>

<script>
import { Icon } from '@iconify/vue';
import Header from '../Header.vue';
import Footer from '../Footer.vue';

import { mapGetters, mapActions } from 'vuex';

import ProductDetail from './ProductDetail.vue';
import ProductEdit from './ProductEdit.vue';

export default {
    name: 'ProducEditContent',

    inject: ['emitter', 'productApi'],
    emits: [],

    props: {

    },

    components: {
        Header,
        Footer,
        Icon,
        ProductEdit,
        ProductDetail
    },

    data() {
        return {
            product: null,
            productMainCtg: null,
            productSubCtg: null,

            loadedCategories: false,

            shownComponent: "ProductEdit",
            productEditedData: null
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

                console.log("product", this.product);
            } catch (err) {
                console.error(err);
                // this.$router.push("/404");
            }
        },

        scrollToSales() {
            console.log("scroll");
            const el = document.getElementById("sales");
            el.scrollIntoView();
        },

        showProductDetail() {
            if (this.shownComponent === "ProductDetail") return;
            this.emitter.on("get_prod-edited-data-2", (data) => {
                this.productEditedData = data;

                console.log(this.productEditedData);
                this.shownComponent = 'ProductDetail';
            });

            this.emitter.emit("get_prod-edited-data");
        },

        showProductEditor() {
            if (this.shownComponent === "ProductEdit") return;
            this.shownComponent = 'ProductEdit';
        },

        changedComponent() {
            this.emitter.emit("loaded-edit-component", this.shownComponent);
        },

        saveProduct() {
            if (this.shownComponent !== "ProductEdit") {
                this.shownComponent = "ProductEdit";
                setTimeout(() => {
                    this.emitter.emit("save-product");
                }, 500);
            } else {
                this.emitter.emit("save-product");
            }
        }
    },
    
    computed: {
        ...mapGetters(
            {
                getAllCategories: "product/getAllCategories",
                getMainCategories: "product/getMainCategories",
                getSubCategories: "product/getSubCategories",
            }
        ),
    },

    async created() {
        this.emitter.emit("show-loader");   
        await this.getProductDetail();

        this.productMainCtg = this.getAllCategories.find(ctg => ctg._id == this.product.category.mainCategory);
        if (this.product.category.subCategory) this.productSubCtg = this.getAllCategories.find(ctg => ctg._id == this.product.category.subCategory);
        this.loadedCategories = true;

        this.emitter.emit("hide-loader");
    },

    mounted() {
        setTimeout(() => {
            if (this.$route.hash) this.scrollToSales();
        }, 200);
    },
}
</script>

<style scoped>
#product-edit {
    margin-top: 72px;
}

.edit-heading .heading-title:hover {
    color: rgba(255, 255, 255, 0.66);
}

.edit-heading .heading-title .arrow-icon {
    font-size: 24px;
}

.edit-heading .heading-title h1 {
    font-size: 32px;
    font-weight: bold;
    text-transform: uppercase;
    line-height: 100%;
}


</style>