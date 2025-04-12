<template>
    <div class="prod-edit">
        <div class="product-editable">
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
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Icon } from '@iconify/vue';

import Checkbox from '../Checkbox.vue';
import Quill from './Quill.vue';
import Multiselect from 'vue-multiselect';
import "vue-multiselect/dist/vue-multiselect.min.css";

export default {
    name: 'ProductEdit',

    inject: ['emitter'],
    emits: [],

    props: {

    },

    components: {
        Checkbox,
        Quill,
        Icon,
        Multiselect
    },

    data() {
        return {

        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),
    },
    
    computed: {
        ...mapGetters(
            {

            }
        ),
    },

    created() {

    },

    mounted() {

    }
}
</script>

<style scoped>
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
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    grid-auto-rows: 90px;
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