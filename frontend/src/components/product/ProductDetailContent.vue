<template>
    <div class="product-detail-content content-wrapper">
        <Header></Header>

        <section id="product-detail">
            <div class="container">
                <div class="content">

                    <div class="printable logo-for-print">
                        <img :src="getAssetUrl('img/logo-w_light.svg')" aria-hidden="true" class="img-fluid"> 
                    </div>

                    <template v-if="product">
                        <ProductDetail
                            :product="product"
                            :product-main-ctg="productMainCtg"
                            :product-sub-ctg="productSubCtg"
                        ></ProductDetail>
    
                        <div class="product-history">
                            <div class="history-heading d-flex flex-column gap-8">
                                <div class="d-flex gap-32 justify-content-between align-items-center">
                                    <h2> {{ $t('ProductHistory').toUpperCase() }} </h2>
                                    <div class="created-at d-flex gap-24 align-items-center">
                                        {{ $t('CreatedAt') }}
                                        <span> {{ isoToDateString(product.createdAt) }} </span> 
                                    </div>
                                </div>
                                <div class="line-divider"></div>
                            </div>
                        </div>
    
                        <div class="history-content d-flex flex-column gap-24">
                            <div class="sale-ended d-flex flex-column text-center" v-if="product.status === 'saleEnded'">
                                <div class="sale-ended-title pos-relative" >
                                    <h2 class="pos-relative"> {{ $t("SaleEnded") }} </h2>
                                    <div class="line-divider"></div>
                                </div>
                                <div class="date montserrat"> {{ getSaleEndedDate }} </div>
                            </div>
    
                            <div class="history-wrapper d-flex flex-column gap-16 pos-relative" :class="shownHistory ? 'shown' : ''">
                                <template v-for="(hist, index) in productHistory" :key="index">
                                    <HistoryItem v-if="hist.historyType !== 'saleEnded'"
                                        :history-data="hist"
                                        :product-data="product"
                                    ></HistoryItem>
                                </template>

                                <div class="no-history text-center" v-if="!productHistory || !productHistory.length">
                                   {{ $t("NoHistoryInfo") }}
                                </div>

                                <div class="view-divider-cont" v-if="!shownHistory && productHistory.length && productHistory.length > 3">
                                    <div class="view-divider shorter d-flex justify-content-center align-items-center">
                                        <button class="btn secondary" @click="shownHistory = !shownHistory"> {{ $t("View") }} </button>
                                        <div class="divider"></div>
                                    </div>
                        
                                    <div class="hidden-overlay"></div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </section>

        <Footer></Footer>
    </div>
</template>

<script>
import Header from '../Header.vue';
import Footer from '../Footer.vue';
import HistoryItem from './HistoryItem.vue';
import ProductDetail from './ProductDetail.vue';
import { Icon } from '@iconify/vue';

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
        HistoryItem,
        ProductDetail
    },

    data() {
        return {
            pageTitle: null,
            product: null,
            productMainCtg: null,
            productSubCtg: null,

            shownHistory: false,
            productHistory: []
        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),

        async getProductDetail() {
            try {
                const resp = await this.productApi.getProduct(this.$route.params.id, 1);
                this.product = resp.data;
                this.pageTitle = `${this.product.title} - UNIZA Marketplace`;
                console.log("product", this.product);
            } catch (err) {
                console.error(err);
            }
        },

        async getProductHistory() {
            try {
                const resp = await this.productApi.getProductHistory(this.$route.params.id);
                this.productHistory = resp.data;
                this.productHistory.sort((a, b) => {
                    const aEpoch = new Date(a.timestamp).getTime();
                    const bEpoch = new Date(b.timestamp).getTime();

                    return bEpoch - aEpoch;
                });
                console.log("history", this.productHistory);
            } catch (err) {
                console.error(err);
            }
        },
    },
    
    computed: {
        ...mapGetters(
            {
                getAllCategories: "product/getAllCategories",

                getLoggedUser: "user/getUser"
            }
        ),

        productHasImages() {
            return this.product && this.product.images && this.product.images.length;
        },

        getSaleEndedDate() {
            const endSaleHistories = this.productHistory.filter(his => his.historyType == "saleEnded");
            endSaleHistories.sort((a, b) => {
                const aEpoch = new Date(a.timestamp).getTime();
                const bEpoch = new Date(b.timestamp).getTime();

                return bEpoch - aEpoch;
            });

            let hist = endSaleHistories[0];
            if (hist)
                return `${this.isoToDateString(hist.timestamp)} ${this.isoToDayTime(hist.timestamp)}`;
        }
    },

    async created() {
        this.emitter.emit("show-loader");   
        await this.getProductDetail();
        await this.getProductHistory();

        this.productMainCtg = this.getAllCategories.find(ctg => ctg._id == this.product.category.mainCategory);
        if (this.product.category.subCategory) this.productSubCtg = this.getAllCategories.find(ctg => ctg._id == this.product.category.subCategory);

        this.emitter.on("sale-add-success", () => {
            this.getProductDetail();
            this.getProductHistory();
        });
    },

    mounted() {

    }
}
</script>

<style scoped>
#product-detail {
    margin-top: 72px;
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

.no-history {
    opacity: 0.66;
}

</style>

<style>
.product-description a {
    text-decoration: underline;
}
</style>