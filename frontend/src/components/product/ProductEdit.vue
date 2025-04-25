<template>
    <div class="prod-edit">
        <div class="product-editable">
            <div class="under-heading d-flex gap-32 justify-content-between align-items-center">
                <div class="back d-flex align-items-center" @click="$router.back()">
                    <Icon icon="mdi:arrow-left-top" class="back-icon" />
                    {{ $t("Back").toLowerCase() }}
                </div>

                <div class="sales-view-link d-flex justify-content-end flex-1">
                    <a role="button" class="btn" :href="isAdd ? '' : '#sales'" @click.prevent="isAdd ? null : $emit('scroll-to-sales')"
                        :aria-disabled="isAdd ? true : false" :class="isAdd ? 'disabled' : ''">
                        <Icon icon="material-symbols:shopping-cart" class="sales-icon" />
                        {{ $t('Sales') }}
                        <Icon icon="mdi:arrow-down" class="arrow-icon" />
                    </a>
                </div>
            </div>

            <div class="product-main-edit d-flex gap-48">
                <div class="images-edit flex-1">
                    <div class="images-heading d-flex gap-32 justify-content-between align-items-center">
                        <h2> {{ $t('Images') }} </h2>
                        <div class="images-count montserrat"> {{ productImages ? productImages.length : 0 }} </div>
                    </div>

                    <VueDraggableNext :list="productImages" handle=".drag-icon"
                        class="images-wrapper" :class="!loadedData ? 'loading' : ''">
                        <template v-if="loadedData">
                            <div v-for="(img, index) in productImages" :key="index" class="img-cont">
                                <div class="main-img-tag" v-if="index == 0"> {{ $t("Main") }} </div>
                                <div class="remove-img-cont" @click="removeImg(img, index)">
                                    <Icon icon="material-symbols:close" class="remove-icon" />
                                </div>

                                <Icon icon="material-symbols:drag-pan" class="drag-icon" />
    
                                <img :src="img && img.url ? img.url : getAssetUrl(`img/products/${img}`)" class="img-fluid"  alt="product img" />
                            </div>
    
                            <form enctype="multipart/form-data" class="add-img-cont d-flex justify-content-center align-items-center"
                                :title="$t('AddImage')"
                                @submit.prevent="uploadImages" @click="triggerFileInput">
                                <input ref="imageInput" name="imageFiles" @change="onFileChange" style="display: none"
                                    type="file" multiple accept=".jpg, .jpeg, .png, .webp" />
                                <div class="add-img-icon-cont">
                                    <Icon icon="ic:baseline-plus" class="plus-icon" />
                                </div>
                            </form>
                        </template>
                    </VueDraggableNext>
                </div>
                <div class="info-edit flex-1 d-flex flex-column gap-32">
                    <div class="input-cont d-flex flex-column gap-8">
                        <div class="input-tag"> {{ $t('Title') }} </div>
                        <input v-model="product.title" type="text" class="styled" :placeholder="$t('Title')">
                    </div>

                    <div class="input-row d-flex gap-24 align-items-center justify-content-between">
                        <div class="input-cont d-flex flex-column gap-8 flex-1">
                            <div class="input-tag"> {{ ('Category') }} </div>
                            <Multiselect
                                v-model="localProductMainCtg"
                                :options="mainCategories"
                                :track-by="'_id'"
                                :allow-empty="false"
                                :label="'name'"
                                :multiple="false"
                                :show-labels="false"
                                @update:modelValue="mainCtgChangeHandler"
                            ></Multiselect>
                        </div>

                        <Icon icon="mdi:arrow-right" class="input-row-divider icon" />

                        <div class="input-cont d-flex flex-column gap-8 flex-1">
                            <div class="input-tag"> {{ ('SubCategory') }} </div>
                            <Multiselect
                                v-model="localProductSubCtg"
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
                            <div class="input-tag"> {{ $t("Price") }} </div>
                            <input v-model="productPrice" type="number" min="1" max="99999" class="styled" :placeholder="$t('Price')" @input="(e) => sanitizeInput(e, 'price')">
                            <span class="price-currency"> € </span>
                        </div>

                        <span class="input-row-divider montserrat"> {{ $t("Or") }} </span>

                        <div class="input-cont d-flex flex-column gap-8 flex-1">
                            <Multiselect
                                v-model="productSpecialPrice"
                                :options="getSpecialPrices"
                                :allow-empty="true"
                                :multiple="false"
                                :show-labels="false"
                            ></Multiselect>
                            <div class="input-tag"> {{ $t('SpecialPrice') }} </div>
                        </div>
                    </div>

                    <div class="input-row-cont d-flex flex-column gap-24">
                        <div>
                            <Checkbox
                                :text="$t('SameAddressInfo')"
                                v-model:is-checked="product.address.asProfile"
                            ></Checkbox>
                        </div>

                        <div class="input-row d-flex gap-24 align-items-center justify-content-between" :class="product.address.asProfile ? 'disabled' : ''">
                            <div class="input-cont address-cont d-flex flex-column gap-8 flex-1">
                                <div class="input-tag"> {{ $t("Address") }} </div>
                                <Multiselect
                                    :disabled="product.address.asProfile"
                                    v-model="productAddress"
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

                            <span class="input-row-divider montserrat"> {{ $t("Or") }} </span>

                            <div class="input-cont d-flex flex-column gap-8 flex-1">
                                <div class="input-tag"> {{ $t("Dorm") }} </div>
                                <Multiselect
                                    :disabled="product.address.asProfile"
                                    v-model="productDorm"
                                    :options="getDorms"
                                    :allow-empty="true"
                                    :multiple="false"
                                    :show-labels="false"
                                ></Multiselect>
                            </div>
                        </div>
                    </div>

                    <div class="input-row-cont d-flex flex-column gap-24">
                        <!-- <div>
                            <Checkbox
                                :text="'Delete product automatically when count reaches 0'"
                                v-model:is-checked="product.count.deleteOnZero"
                            ></Checkbox>
                            
                        </div> -->

                        <div class="input-row d-flex gap-8 align-items-center justify-content-between">
                            <div class="input-cont d-flex flex-column gap-8 flex-1">
                                <div class="input-tag"> {{ $t('Count') }} </div>
                                <input v-model="product.count.available" type="number" min="1" max="99999" class="styled" :placeholder="$t('Count')" @input="(e) => sanitizeInput(e)">
                            </div>

                            <div class="product-stats d-flex justify-content-end gap-8 flex-2">
                                <template v-if="!isAdd">
                                    {{ $t("Sold").toLowerCase() }}:
                                    <span> {{ product.count.sold }} </span>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="product-description-edit">
                <h2 class="input-tag"> {{ $t('Description') }} </h2>
                <Quill
                    v-model="productDescription"
                ></Quill>
            </div>
        </div>

        <div class="product-sales" id="sales" v-if="!isAdd">
            <div class="sales-heading d-flex flex-column gap-8">
                <div class="d-flex gap-32 justify-content-between align-items-center">
                    <h2> {{ $t("Sales").toUpperCase() }} </h2>
                    <Icon icon="ic:baseline-plus" class="plus-icon" @click="salesModalIsShown = true" />
                </div>
                <div class="line-divider"></div>
            </div>

            <div class="sales-wrapper d-flex flex-column gap-16 pos-relative" :class="shownSales ? 'shown' : ''">
                <div class="view-divider-cont" v-if="!shownSales && productSales.length && productSales.length > 3">
                    <div class="view-divider shorter d-flex justify-content-center align-items-center">
                        <button class="btn secondary" @click="shownSales = !shownSales"> {{ $t("View") }} </button>
                        <div class="divider"></div>
                    </div>
        
                    <div class="hidden-overlay"></div>
                </div>

                <template v-for="(sale, index) in productSales" :key="index">
                    <SaleItem
                        :sale-data="sale"
                    ></SaleItem>
                </template>

                <div class="no-sales text-center" v-if="!productSales || !productSales.length">
                    {{ $t("NoSalesInfo") }}
                </div>
            </div>
        </div>
        
        <SaleModal v-if="!isAdd && allUsers && allUsers.length"
            v-model:is-shown="salesModalIsShown"
            :available-users="availableUsersSale"
            :sale-data="selectedSaleData"
        ></SaleModal>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Icon } from '@iconify/vue';

import SaleModal from './SaleModal.vue';
import SaleItem from './SaleItem.vue';
import Checkbox from '../Checkbox.vue';
import Quill from './Quill.vue';

import Multiselect from 'vue-multiselect';
import "vue-multiselect/dist/vue-multiselect.min.css";

import { VueDraggableNext } from 'vue-draggable-next';

export default {
    name: 'ProductEdit',

    inject: ['emitter', 'productApi', 'userApi'],
    emits: ['scroll-to-sales'],

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

        isAdd: {
            type: Boolean,
            default: false
        }
    },

    components: {
        Checkbox,
        Quill,
        Icon,
        Multiselect,
        VueDraggableNext,
        SaleItem,
        SaleModal
    },

    data() {
        return {
            prevImages: [],
            productImages: [],
            imageBlobs: [],

            mainCategories: [],
            subCategories: [],

            productDescription: "",

            productPrice: null,
            productSpecialPrice: null,

            productDorm: null,
            productAddress: null,
            filteredAddresses: [],

            localProductMainCtg: null,
            localProductSubCtg: null,

            loadedData: false,
            
            prevProductPrice: null,
            prevProductCount: null,

            shownSales: false,
            salesModalIsShown: false,
            productSales: [],

            allUsers: [],
            availableUsersSale: [],
            selectedSaleData: null
        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),

        onAddressSearchChange(searchQuery) {
            this.filteredAddresses = this.getSearchedAddresses(this.productAddress, this.getAllPSC, searchQuery);
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

        async uploadImages() {
            const imageFiles = this.productImages.filter(img => img.url).map(img => img.file);

            const imageFormData = new FormData();
            imageFormData.append('productId', this.product._id);
            if (this.isAdd) imageFormData.append('isAdd', true);

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

        productDataIsValid() {
            // title, mainCategory, price, adresa, count
            let failed = false;
            if (!this.product.title) {
                failed = true;
                this.$toast.error("InvalidProductTitle");
            }
            if (!this.localProductMainCtg || !this.localProductMainCtg._id) {
                failed = true;
                this.$toast.error("InvalidProductMainCategory");
            }
            if (!this.productPrice && !this.productSpecialPrice) {
                failed = true;
                this.$toast.error("InvalidProductPrice");
            }
            if (!this.productAddress && !this.productDorm && !this.product.address.asProfile) {
                failed = true;
                this.$toast.error("InvalidProductAddress");
            }
            if (!this.product.count.available) {
                failed = true;
                this.$toast.error("InvalidProductCount");
            }

            console.log("nee",this.productAddress, this.productDorm, this.product.address.asProfile);

            return !failed;
        },

        setupEditedProductData(newImages = []) {
            let images = this.productImages.filter(img => !img.url && img);
            images = [...images, ...newImages];
            console.log(this.productImages);
            console.log(newImages);
            console.log("joj", images);

            if (this.product.address.asProfile) {
                this.product.address.custom = null;
                this.productAddress = null;
                this.productDorm = null;
            }

            const post = {
                ...this.product,
                category: {
                    mainCategory: this.localProductMainCtg._id
                },
                description: this.productDescription,
                images,
            }

            if (this.localProductSubCtg) post.category.subCategory = this.localProductSubCtg._id;
            if (this.productPrice) { 
                post.price.value = `${this.productPrice}`;
                post.price.specialValue = null;
            }
            if (this.productSpecialPrice) {
                post.price.specialValue = this.productSpecialPrice;
                post.price.value = 0;
            }
            if (this.productAddress) {
                post.address.custom = {
                    region: this.productAddress.region,
                    city: this.productAddress.city,
                    postalCode: this.productAddress.postalCode
                };
            }
            if (this.productDorm) {
                post.address.custom = { dorm: this.productDorm };
            }
            post.count.available = Math.round(post.count.available);

            // History
            if (this.prevProductCount != post.count.available && !this.isAdd) {
                post.prevCount = this.prevProductCount
            }
            if ((this.productPrice && this.prevProductPrice != this.productPrice) || (this.productSpecialPrice && this.prevProductPrice != this.productSpecialPrice)) {
                if (!this.isAdd) post.prevPrice = this.prevProductPrice;
            }

            return post;
        },

        async saveProduct() {
            this.emitter.emit("show-loader");
            console.log("save?", this.product);
            // console.log(this.productDescription);

            console.log(this.localProductMainCtg, this.localProductSubCtg);
    
            if (!this.productDataIsValid()) return;

            const newImages = await this.uploadImages();
            console.log("heh", newImages);

            const post = this.setupEditedProductData(newImages);
            if (!post) { 
                this.emitter.emit("hide-loader");
                return;
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
        },

        async addProduct() {
            this.emitter.emit("show-loader");
            console.log("add?", this.product);
            console.log(this.productDescription);

            console.log(this.localProductMainCtg, this.localProductSubCtg);

            this.emitter.emit("hide-loader");
            if (!this.productDataIsValid()) return;

            const newImages = await this.uploadImages();
            console.log("heh", newImages);

            const post = this.setupEditedProductData(newImages);
            if (!post) {
                this.emitter.emit("hide-loader");
                return;
            }
            console.log("post", post);

            try {
                const resp = await this.productApi.addProduct(post);
                console.log("added?", resp);
                if (resp.data.id) {
                    this.$toast.success("ProductAddSuccess");
                    this.$router.push({ name: "ProductDetail", params: { id: resp.data.id } });
                } else {
                    this.$toast.error("ProductAddFailed");
                }
            } catch (err) {
                this.$toast.error("ProductAddFailed");
                console.error(err);
            }

            this.emitter.emit("hide-loader");
        },

        mainCtgChangeHandler() {
            this.localProductSubCtg = null;
            this.subCategories = this.getSubCategories.filter(ctg => ctg.parentName == this.localProductMainCtg.name);
        },

        sanitizeInput(event, inputType) {
            let valueVar = inputType == "price" ? this.productPrice : this.product.count.available;

            let value = parseFloat(valueVar);
            if (value < 0.01) {
                if (inputType == "price") this.productPrice = null;
                else this.product.count.available = 1;
                event.preventDefault();
            }

            if (typeof valueVar == "string" && valueVar.includes('-')) {
                if (inputType == "price") this.productPrice = 1;
                else this.product.count.available = 1;
                event.preventDefault();
            }
        },

        async getProductSales() {
            try {
                const resp = await this.productApi.getProductSales(this.$route.params.id);
                this.productSales = resp.data;
                console.log("sales", this.productSales);
            } catch (err) {
                console.error(err);
            }
        },

        async getAllUsers() {
            const resp = await this.userApi.getAllUsers();
            this.allUsers = resp.data;
            this.availableUsersSale = resp.data.filter(usr => usr && usr._id != this.product.sellerId);
            console.log("users", this.availableUsersSale);
        },
    },
    
    computed: {
        ...mapGetters(
            {
                getMainCategories: "product/getMainCategories",
                getSubCategories: "product/getSubCategories",

                getSpecialPrices: "product/getSpecialPrices",
                getDorms: "product/getDorms",
                getAllPSC: 'misc/getAllPSC',
            }
        ),
    },

    async mounted() {
        if (!this.isAdd) await this.getProductSales();
        this.getAllUsers();

        this.filteredAddresses = this.getAllPSC;

        this.mainCategories = this.getMainCategories;

        this.productImages = this.product.images;
        this.productDescription = this.product.description;

        this.productPrice = +this.product.price.value.$numberDecimal ? +this.product.price.value.$numberDecimal : null;
        this.productSpecialPrice = this.product.price.specialValue ? this.product.price.specialValue : null;

        this.prevProductPrice = this.productPrice || this.productSpecialPrice;
        this.prevProductCount = JSON.parse(JSON.stringify(this.product.count.available));

        this.localProductMainCtg = this.productMainCtg;
        this.localProductSubCtg = this.productSubCtg;

        if (this.product.address.custom) {
            if (this.product.address.custom.dorm) this.productDorm = this.product.address.custom.dorm;
            else if (this.product.address.custom.region) this.productAddress = this.product.address.custom;
        }

        if (this.localProductMainCtg) {
            this.subCategories = this.getSubCategories.filter(ctg => ctg.parentName == this.localProductMainCtg.name);
        }

        this.loadedData = true;
        this.emitter.on("loaded-edit-component", (name) => {
            if (name !== 'ProductEdit') {
                this.loadedData = false;
                return;
            }

            setTimeout(() => {
                this.loadedData = true;
            }, 500);
        });

        this.emitter.on("save-product", () => this.saveProduct());
        this.emitter.on("add-product", () => this.addProduct());

        this.emitter.on("sale-add-success", async () => {
            this.getProductSales();
        });

        this.emitter.on("get_prod-edited-data", () => {
            const newImages = this.productImages.filter(img => img.url);
            let data = this.setupEditedProductData(newImages);

            this.emitter.emit("get_prod-edited-data-2", data);
        });

        this.emitter.on("get_new-prod-data", () => {
            let data = {};
            // adresa, description, price, ctg, subCtg, images
            data.address = {
                asProfile: this.product.address.asProfile,
                custom: this.productAddress || { dorm: this.productDorm }
            };
            data.description = this.productDescription;
            data.price = {
                specialValue: this.productSpecialPrice,
                value: this.productPrice ? {
                    $numberDecimal: this.productPrice
                } : null
            };
            data.ctg = this.localProductMainCtg;
            data.subCtg = this.localProductSubCtg;
            data.images = this.productImages;

            this.emitter.emit("get_new-prod-data-2", data);
        });
    },

    unmounted() {
        this.emitter.off("loaded-edit-component");
        this.emitter.off("save-product");
        this.emitter.off("add-product");
    },

    watch: {
        productPrice(newVal) {
            if (newVal !== null) this.productSpecialPrice = null;
        },
        productSpecialPrice(newVal) {
            if (newVal !== null) this.productPrice = null;
        },

        productAddress(newVal) {
            if (newVal !== null) this.productDorm = null;
        },
        productDorm(newVal) {
            if (newVal !== null) this.productAddress = null;
        }

    }
}
</script>

<style scoped>
#sales {
    scroll-margin-top: 139px;
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
    pointer-events: all;
}
.sales-view-link .btn:hover {
    opacity: 1;
}
.sales-view-link .btn.disabled:hover {
    opacity: 0.33;
    cursor: not-allowed;
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
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    grid-auto-rows: 90px;
    gap: 16px;
    overflow: auto;
    height: 340px;
}
.images-wrapper.loading {
    background-color: var(--white-5a);
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
    transition: transform 0.15s ease-in;
}
.product-sales .plus-icon:hover {
    transform: scale(1.3);
    cursor: pointer;
}

.sales-heading h2 {
    font-size: 20px;
    font-weight: bold;
    line-height: 100%;
}

.drag-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 32px;
    color: var(--primary);
    filter: drop-shadow(0px 0px 8px #000000);
    opacity: 0;
    transition: opacity 0.15s ease-in;
    cursor: grab;
}

.img-cont:hover .drag-icon {
    opacity: 1;
}

.sales-wrapper {
    margin-top: 16px;
    max-height: 250px;
    overflow: hidden;
}

.sales-wrapper.shown {
    max-height: initial;
    overflow: initial;
}

.sales-wrapper .hidden-overlay {
    top: 0;
    height: 100%;
}

.no-sales {
    opacity: 0.66;
}
</style>

<style>
.address-cont .multiselect__content-wrapper {
    width: 200%;
}
</style>