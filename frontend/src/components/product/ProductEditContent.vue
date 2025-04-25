<template>
    <div class="product-edit-content content-wrapper">
        <Header></Header>

        <section id="product-edit" :class="isAdd ? 'add' : ''">
            <div class="container">
                <div class="content" v-if="product || isAdd">

                    <div class="heading-cont d-flex flex-column gap-8">
                        <div class="edit-heading d-flex justify-content-between gap-32">
                            <router-link :to="`/product/${product._id}`" class="heading-title d-flex gap-8 align-items-end" v-if="!isAdd">
                                <h1> {{ $t('EditProduct') }} </h1>
                                <Icon icon="prime:arrow-up-right" class="arrow-icon" />
                            </router-link>
                            <div class="heading-title d-flex gap-8 align-items-end" v-else>
                                <h1> {{ $t('CreateProduct') }} </h1>
                            </div>

                            <div class="edit-options d-flex gap-32 align-items-center">
                                <div class="nav-btns-wrapper d-flex">
                                    <button class="btn nav-btn" 
                                        @click="showProductDetail()"
                                        :class="shownComponent === 'ProductDetail' ? 'active' : ''"
                                    > 
                                        {{ $t('Preview ') }}
                                    </button>
                                    <button class="btn nav-btn" 
                                        @click="showProductEditor()"
                                        :class="shownComponent === 'ProductEdit' ? 'active' : ''"
                                    > 
                                        {{ $t('Editor') }}
                                    </button>
                                </div>

                                <button class="btn primary" @click="isAdd ? addProduct() : saveProduct()"> 
                                    {{ isAdd ? $t('Create') : $t('Save') }}
                                </button>
                            </div>
                        </div>

                        <div class="line-divider"></div>
                    </div>

                    <Transition name="fade" mode="out-in" @after-leave="changedComponent">
                        <KeepAlive>
                            <component :is="shownComponent"
                                v-if="shownComponent === 'ProductDetail' && loadedCategories"
                                :product="isAdd ? newProductData : productEditedData"
                                :product-main-ctg="productMainCtg"
                                :product-sub-ctg="productSubCtg"
                                :is-preview="true"
                                :is-add="isAdd"
                            ></component>
                        </KeepAlive>
                    </Transition>

                    <Transition name="fade" mode="out-in" @after-leave="changedComponent">
                        <KeepAlive>
                            <component :is="shownComponent"
                                v-if="shownComponent === 'ProductEdit' && loadedCategories"
                                :product="isAdd ? newProductData : product"
                                :product-main-ctg="productMainCtg"
                                :product-sub-ctg="productSubCtg"
                                :is-add="isAdd"
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
        isAdd: {
            type: Boolean,
            default: false
        }
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
            productEditedData: null,

            newProductData: {
                address: {
                    asProfile: false,
                    custom: null
                },
                category: {
                    mainCategory: null,
                    subCategory: null
                },
                count: {
                    available: 1,
                    sold: 0,
                    deleteOnZero: false
                },
                description: null,
                history: [],
                images: [],
                price: {
                    value: {
                        $numberDecimal: null
                    },
                    specialValue: null
                },
                seenCount: 0,
                sellerId: null,
                title: null
            }
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

            if (!this.isAdd)
                this.emitter.emit("get_prod-edited-data");
            else {
                // setup data when adding new product
                this.emitter.on("get_new-prod-data-2", (data) => {
                    this.updateNewProductData(data);
                });
                this.emitter.emit("get_new-prod-data");
                this.shownComponent = 'ProductDetail';
            }
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
        },

        addProduct() {
            if (this.shownComponent !== "ProductEdit") {
                this.shownComponent = "ProductEdit";
                setTimeout(() => {
                    this.emitter.emit("add-product");
                }, 500);
            } else {
                this.emitter.emit("add-product");
            }
        },

        updateNewProductData(data) {
           this.newProductData.images = data.images;
           this.newProductData.address = data.address;
           this.newProductData.description = data.description;
           this.newProductData.category.mainCategory = data.ctg;
           this.newProductData.category.subCategory = data.subCtg;
           this.newProductData.price = data.price;
           console.log("hm", data);
        },

        async setupProductDetail() {
            if (this.isAdd) {
                this.loadedCategories = true;
                return;
            }
            await this.getProductDetail();

            this.productMainCtg = this.getAllCategories.find(ctg => ctg._id == this.product.category.mainCategory);
            if (this.product.category.subCategory) this.productSubCtg = this.getAllCategories.find(ctg => ctg._id == this.product.category.subCategory);
            this.loadedCategories = true;
        },

        setupProductAdd() {
            if (!this.isAdd) return;

            this.newProductData.sellerId = this.getLoggedUser._id;
            console.log("heh", this.newProductData);
        }
    },
    
    computed: {
        ...mapGetters(
            {
                getAllCategories: "product/getAllCategories",
                getMainCategories: "product/getMainCategories",
                getSubCategories: "product/getSubCategories",

                getLoggedUser: "user/getUser",
            }
        ),
    },

    async created() {
        this.emitter.emit("show-loader");

        await this.setupProductDetail();
        this.setupProductAdd();

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
#product-edit.add .edit-heading .heading-title:hover {
    color: var(--white);
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