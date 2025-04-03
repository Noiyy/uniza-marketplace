<template>
    <div class="product-edit-content content-wrapper">
        <Header></Header>

        <section id="product-edit">
            <div class="container">
                <div class="content" v-if="product">

                    <div class="product-editable">
                        <div class="heading-cont d-flex flex-column gap-8">
                            <div class="edit-heading d-flex justify-content-between gap-32">
                                <router-link :to="`/product/${product._id}`" class="heading-title d-flex gap-8 align-items-end">
                                    <h1> Edit Product </h1>
                                    <Icon icon="prime:arrow-up-right" class="arrow-icon" />
                                </router-link>

                                <div class="edit-options d-flex gap-32 align-items-center">
                                    <div class="nav-btns-wrapper d-flex">
                                        <button class="btn nav-btn"> Preview </button>
                                        <button class="btn nav-btn active"> Editor </button>
                                    </div>

                                    <button class="btn primary" @click="saveProduct()"> Save </button>
                                </div>
                            </div>

                            <div class="line-divider"></div>
                        </div>
                        <div class="under-heading d-flex gap-32 justify-content-between align-items-center">
                            <div class="back d-flex align-items-center" @click="$router.back()">
                                <Icon icon="mdi:arrow-left-top" class="back-icon" />
                                back
                            </div>

                            <div class="sales-view-link d-flex justify-content-end flex-1">
                                <a role="button" class="btn" href="#sales" @click.prevent="scrollToSales()">
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
                                    <div class="images-count montserrat"> {{ productImages ? productImages.length : 0 }} </div>
                                </div>

                                <div class="images-wrapper">
                                    <div v-for="(img, index) in productImages" :key="index" class="img-cont">
                                        <div class="main-img-tag" v-if="index == 0"> Main </div>
                                        <div class="remove-img-cont" @click="removeImg(img, index)">
                                            <Icon icon="material-symbols:close" class="remove-icon" />
                                        </div>

                                        <img :src="img && img.url ? img.url : getAssetUrl(`img/products/${img}`)" class="img-fluid"  alt="product img" />
                                    </div>

                                    <form enctype="multipart/form-data" class="add-img-cont d-flex justify-content-center align-items-center"
                                        :title="'Add image'"
                                        @submit.prevent="uploadImages" @click="triggerFileInput">
                                        <input ref="imageInput" name="imageFiles" @change="onFileChange" style="display: none"
                                            type="file" multiple accept=".jpg, .jpeg, .png, .webp" />
                                        <div class="add-img-icon-cont">
                                            <Icon icon="ic:baseline-plus" class="plus-icon" />
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div class="info-edit flex-1 d-flex flex-column gap-32">
                                <div class="input-cont d-flex flex-column gap-8">
                                    <div class="input-tag"> Title </div>
                                    <input v-model="product.title" type="text" class="styled" :placeholder="'Title'" required>
                                </div>

                                <div class="input-row d-flex gap-24 align-items-center justify-content-between">
                                    <div class="input-cont d-flex flex-column gap-8 flex-1">
                                        <div class="input-tag"> Category </div>
                                        <Multiselect
                                            v-model="productMainCtg"
                                            :options="mainCategories"
                                            :track-by="'_id'"
                                            :allow-empty="false"
                                            :label="'name'"
                                            :multiple="false"
                                            :show-labels="false"
                                        ></Multiselect>
                                    </div>

                                    <Icon icon="mdi:arrow-right" class="input-row-divider icon" />

                                    <div class="input-cont d-flex flex-column gap-8 flex-1">
                                        <div class="input-tag"> Sub category </div>
                                        <Multiselect
                                            v-model="productSubCtg"
                                            :options="subCategories"
                                            :track-by="'_id'"
                                            :allow-empty="true"
                                            :label="'name'"
                                            :multiple="false"
                                            :show-labels="false"
                                        ></Multiselect>
                                    </div>
                                </div>

                                <div class="input-row d-flex gap-24 align-items-center justify-content-between">
                                    <div class="input-cont d-flex flex-column gap-8 flex-1">
                                        <div class="input-tag"> Price </div>
                                        <input v-model="productPrice" type="number" class="styled" :placeholder="'Price'">
                                        <span class="price-currency"> € </span>
                                    </div>

                                    <span class="input-row-divider montserrat"> Or </span>

                                    <div class="input-cont d-flex flex-column gap-8 flex-1">
                                        <Multiselect
                                            v-model="productSpecialPrice"
                                            :options="getSpecialPrices"
                                            :allow-empty="false"
                                            :multiple="false"
                                            :show-labels="false"
                                        ></Multiselect>
                                        <div class="input-tag"> Special Price </div>
                                    </div>
                                </div>

                                <div class="input-row-cont d-flex flex-column gap-24">
                                    <div>
                                        <Checkbox
                                            :text="'Use the same address as your account'"
                                            v-model:is-checked="product.address.asProfile"
                                        ></Checkbox>
                                    </div>

                                    <div class="input-row d-flex gap-24 align-items-center justify-content-between" :class="product.address.asProfile ? 'disabled' : ''">
                                        <div class="input-cont d-flex flex-column gap-8 flex-1">
                                            <div class="input-tag"> Address </div>
                                            <input type="text" class="styled" :placeholder="'Address'" :disabled="product.address.asProfile">
                                        </div>
    
                                        <span class="input-row-divider montserrat"> Or </span>
    
                                        <div class="input-cont d-flex flex-column gap-8 flex-1">
                                            <div class="input-tag"> Dorm </div>
                                            <Multiselect
                                                :disabled="product.address.asProfile"
                                                v-model="productDorm"
                                                :options="getDorms"
                                                :allow-empty="false"
                                                :multiple="false"
                                                :show-labels="false"
                                            ></Multiselect>
                                        </div>
                                    </div>
                                </div>

                                <div class="input-row-cont d-flex flex-column gap-24">
                                    <div>
                                        <Checkbox
                                            :text="'Delete product automatically when count reaches 0'"
                                            v-model:is-checked="product.count.deleteOnZero"
                                        ></Checkbox>
                                       
                                    </div>

                                    <div class="input-row d-flex gap-8 align-items-center justify-content-between">
                                        <div class="input-cont d-flex flex-column gap-8 flex-1">
                                            <div class="input-tag"> Count </div>
                                            <input v-model="product.count.available" type="number" class="styled" :placeholder="'Count'" required>
                                        </div>
    
                                        <div class="product-stats d-flex justify-content-end gap-8 flex-2">
                                            sold:
                                            <span> {{ product.count.sold }} </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="product-description-edit">
                            <h2 class="input-tag"> Description </h2>
                            <Quill
                                v-model="productDescription"
                            ></Quill>
                        </div>
                    </div>

                    <div class="product-sales" id="sales">
                        <div class="sales-heading d-flex flex-column gap-8">
                            <div class="d-flex gap-32 justify-content-between align-items-center">
                                <h2> SALES </h2>
                                <Icon icon="ic:baseline-plus" class="plus-icon" />
                            </div>
                            <div class="line-divider"></div>
                        </div>
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
import Checkbox from '../Checkbox.vue';

import Quill from './Quill.vue';

import { mapGetters, mapActions } from 'vuex';

import Multiselect from 'vue-multiselect';
import "vue-multiselect/dist/vue-multiselect.min.css";

export default {
    name: 'ProducEditContent',

    inject: ['emitter', 'productApi'],
    emits: [],

    props: {

    },

    components: {
        Header,
        Footer,
        Checkbox,
        Quill,
        Icon,
        Multiselect
    },

    data() {
        return {
            product: null,
            productMainCtg: null,
            productSubCtg: null,

            prevImages: [],
            productImages: [],
            imageBlobs: [],

            productDescription: "",

            mainCategories: [],
            subCategories: [],

            productPrice: null,
            productSpecialPrice: null,

            productDorm: null,
            productAdress: null,
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

                this.productImages = this.product.images;
                this.productDescription = this.product.description;

                console.log("product", this.product);
            } catch (err) {
                console.error(err);
                // this.$router.push("/404");
            }
        },

        triggerFileInput() {
            this.$refs.imageInput.click();
        },

        onFileChange(event) {
            this.imageBlobs = [];

            const files = event.target.files;
            if (!files.length) return;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const blobUrl = URL.createObjectURL(file);

                this.imageBlobs.push({
                    file,
                    url: blobUrl
                });
            }
            event.target.value = "";

            this.productImages = [...this.productImages, ...this.imageBlobs];
        },

        removeImg(img, index) {
            console.log("wat", img);
            if (img.url) {
                URL.revokeObjectURL(this.productImages[index].url);
            } else {
                this.prevImages.push(this.productImages[index]);
            }
            this.productImages.splice(index, 1);
        },

        scrollToSales() {
            console.log("scroll");
            const el = document.getElementById("sales");
            el.scrollIntoView();
        },

        async uploadImages() {
            const imageFiles = this.productImages.filter(img => img.url).map(img => img.file);

            const imageFormData = new FormData();
            imageFormData.append('productId', this.product._id);

            for (let i = 0; i < this.prevImages.length; i++) {
                imageFormData.append('prevImages[]', this.prevImages[i]);
            }
            for (let i = 0; i < imageFiles.length; i++) {
                imageFormData.append('imageFiles', imageFiles[i]);
            }

            try {
                const uploadResp = await this.productApi.uploadProductImages(imageFormData);
                console.log("upload?", uploadResp);
                return uploadResp.data.filenames;

            } catch (err) {
                console.error(err);
            }
        },

        async saveProduct() {
            this.emitter.emit("show-loader");
            console.log("save?", this.product);
            // console.log(this.productDescription);
    
            const newImages = await this.uploadImages();
            console.log("heh", newImages);
            let images = this.productImages.filter(img => !img.url && img);
            images = [...images, ...newImages];
            console.log("joj", images);

            const post = {
                ...this.product,
                description: this.productDescription,
                images
            }
            console.log("post", post);

            const resp = await this.productApi.updateProduct(this.product._id, post);
            console.log("did?", resp);
            if (resp.data._id) {
                this.$toast.success("ProductEditSuccess");
                // this.$router.push({ name: "ProductDetail", params: { id: resp.data._id } });
            } else {
                this.$toast.error("ProductEditFailed");
            }

            this.emitter.emit("hide-loader");
        }
    },
    
    computed: {
        ...mapGetters(
            {
                getAllCategories: "product/getAllCategories",
                getMainCategories: "product/getMainCategories",
                getSubCategories: "product/getSubCategories",

                getSpecialPrices: "product/getSpecialPrices",
                getDorms: "product/getDorms",
            }
        ),
    },

    async created() {
        this.emitter.emit("show-loader");   
        await this.getProductDetail();

        this.productMainCtg = this.getAllCategories.find(ctg => ctg._id == this.product.category.mainCategory);
        if (this.product.category.subCategory) this.productSubCtg = this.getAllCategories.find(ctg => ctg._id == this.product.category.subCategory);

        this.productPrice = this.product.price.value.$numberDecimal ? this.product.price.value.$numberDecimal : null;
        this.productSpecialPrice = this.product.specialValue ? this.product.specialValue : null;

        this.emitter.emit("hide-loader");
    },

    mounted() {
        this.mainCategories = this.getMainCategories;
        this.subCategories = this.getSubCategories;

        setTimeout(() => {
            if (this.$route.hash) this.scrollToSales();
        }, 200);
    },

    watch: {
        productPrice(newVal) {
            if (newVal !== null) this.productSpecialPrice = null;
        },
        productSpecialPrice(newVal) {
            if (newVal !== null) this.productPrice = null;
        },

        productAdress(newVal) {
            if (newVal !== null) this.productDorm = null;
        },
        productDorm(newVal) {
            if (newVal !== null) this.productAdress = null;
        }

    }
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

.under-heading {
    margin-top: 2px;
}

.back {
    gap: 4px;
    cursor: pointer;
}

.back-icon {
    font-size: 24px;
    color: var(--primary);
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

.images-edit h2, .product-description-edit h2 {
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
    grid-auto-rows: minmax(90px, auto);
    gap: 16px;
    overflow: auto;
    max-height: 340px;
}

.images-wrapper img {
    object-fit: cover;
    height: 100%;
    width: 100%;
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
    position: relative;
}

.info-edit {
    margin-top: 28px;
}

.input-row.disabled, .input-cont.disabled {
    opacity: 0.33;
    cursor: not-allowed;
}

.input-row-divider {
    opacity: 0.5;
    text-transform: uppercase;
    font-size: 14px;
}
.input-row-divider.icon {
    font-size: 20px;
}

.product-stats {
    opacity: 0.66;
}
.product-stats span {
    font-weight: bold;
}

.remove-img-cont {
    position: absolute;
    top: 4px;
    right: 4px;
    filter: drop-shadow(0px 0px 3px #000000);
    font-size: 20px;
    cursor: pointer;
    transition: transform 0.2s ease-in;
    user-select: none;
}
.remove-img-cont:hover {
    transform: rotate(90deg);
}

.images-wrapper .img-cont {
    position: relative;
}

.main-img-tag {
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    padding: 2px 6px;
    text-transform: uppercase;
    font-size: 14px;
}

.quill-wrapper {
    margin-top: 8px;
}

.price-currency {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    opacity: 0.5;
}

.input-cont input {
    width: 100%;
}

.product-sales {
    margin-top: 48px;
}

.product-sales .plus-icon {
    font-size: 32px;
}

.sales-heading h2 {
    font-size: 20px;
    font-weight: bold;
    line-height: 100%;
}
</style>