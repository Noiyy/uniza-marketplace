<template>
    <div class="product-edit-content content-wrapper">
        <Header></Header>

        <section id="product-edit">
            <div class="container">
                <div class="content" v-if="product">

                    <div class="product-editable">
                        <div class="heading-cont d-flex flex-column gap-8">
                            <div class="edit-heading d-flex justify-content-between gap-32">
                                <div class="heading-title d-flex align-items-end">
                                    <h1> Edit Product </h1>
                                </div>

                                <div class="edit-options d-flex gap-32 align-items-center">
                                    <div class="view-options d-flex">
                                        <button class="btn"> Preview </button>
                                        <button class="btn active"> Editor </button>
                                    </div>

                                    <button class="btn primary"> Save </button>
                                </div>
                            </div>

                            <div class="line-divider"></div>
                        </div>
                        <div class="under-heading">
                            <div class="sales-view-link d-flex justify-content-end">
                                <a role="button" class="btn" href="#sales">
                                    <Icon icon="material-symbols:shopping-cart" class="sales-icon" />
                                    Sales
                                    <Icon icon="mdi:arrow-down" class="arrow-icon" />
                                </a>
                            </div>
                        </div>

                        <div class="product-main-edit d-flex gap-48">
                            <div class="images-edit flex-1">
                                <div class="images-heading d-flex gap-32 justify-content-between align-items-center">
                                    <h2> Images </h2>
                                    <div class="images-count montserrat"> {{ product.images ? product.images.length : 0 }} </div>
                                </div>

                                <div class="images-wrapper">
                                    <div v-for="img in product.images" :key="img" class="img-cont">
                                        <img :src="getAssetUrl(`img/products/${img}`)" class="img-fluid"  alt="product img" />
                                    </div>

                                    <div class="add-img-cont d-flex justify-content-center align-items-center">
                                        <div class="add-img-icon-cont">
                                            <Icon icon="ic:baseline-plus" class="plus-icon" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="info-edit flex-1">

                            </div>
                        </div>

                        <div class="product-description-edit">
                            description
                        </div>
                    </div>

                    <div class="product-sales" id="sales">
                        sales
                    </div>

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

export default {
    name: 'ProducEditContent',

    inject: ['emitter', 'productApi'],
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
            product: null,
            productMainCtg: null,
            productSubCtg: null,
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
#product-edit {
    margin-top: 72px;
}

.edit-heading .heading-title h1 {
    font-size: 32px;
    font-weight: bold;
    text-transform: uppercase;
    line-height: 100%;
}

.under-heading {
    margin-top: 2px;
}

.view-options {
    background-color: var(--white-5a);
    border-radius: 8px;
    padding: 8px;
    gap: 4px;
}

.view-options .btn {
    text-transform: capitalize;
    transition: background-color 0.2s ease-in;
    padding: 2px 24px;
}
.view-options .btn:hover {
    background-color: var(--white-5a);
}

.view-options .btn.active {
    background-color: var(--white-10a);
    border-color: transparent;
}

.sales-view-link {
    border-radius: 8px;
    background: linear-gradient(90deg, rgba(15, 11, 7, 0.00) 33%, rgba(240, 237, 234, 0.10) 100%);
}

.sales-view-link .btn {
    border: 3px solid rgba(240, 237, 234, 0.2);
    padding: 4px 16px;
    border-radius: 8px;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 20px;
    gap: 4px;
    opacity: 0.33;
}
.sales-view-link .btn:hover {
    opacity: 1;
}

.sales-view-link .btn .sales-icon {
    font-size: 24px;
}

.sales-view-link .btn .arrow-icon {
    color: var(--primary);
    font-size: 24px;
    margin-left: 8px;
}

.product-main-edit {
    margin-top: 24px;
}

.images-heading {
    margin-bottom: 12px;
}

.images-edit h2 {
    font-size: 16px;
    color: var(--primary);
    text-transform: uppercase;
    font-weight: bold;
}

.images-edit .images-count {
    opacity: 0.66;
    font-size: 14px;
}

.images-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: minmax(100px, auto);
    gap: 16px;
}

.images-wrapper img {
    height: 100%;
    object-fit: cover;
}

.add-img-cont {
    cursor: pointer;
}
.add-img-cont:hover .add-img-icon-cont {
    background-color: var(--white-7a);
}

.add-img-icon-cont {
    font-size: 48px;
    border-radius: 50%;
    border: 2px solid var(--white-7a);
    transition: background-color 0.15s ease-out;
}

.product-description-edit {
    margin-top: 64px;
}




.product-sales {
    margin-top: 48px;
}
</style>