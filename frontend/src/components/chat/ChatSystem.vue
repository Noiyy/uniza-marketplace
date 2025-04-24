<template>
    <div class="system-chat">
        
        <div class="bought-products-confirmations d-flex flex-column gap-8">
            <template v-if="unconfirmedSales && unconfirmedSales.length">
                <div class="notification d-flex gap-8" v-for="(sale, index) in unconfirmedSales" :key="index">
                    <div class="noti-heading d-flex gap-24 flex-1 align-items-center">
                        <div class="alert-icon-cont">
                            <Icon icon="ion:alert" class="alert-icon" />
                        </div>
    
                        <div class="sale-info d-flex gap-24 align-items-center">
                            <div>
                                Bought {{ sale.count }}x <router-link :to="`/product/${sale.productId}`" class="gradient-text" > {{ sale.productDetail.title }} </router-link>
                            </div>
    
                            <div class="item-date d-flex gap-8 align-items-center montserrat">
                                <Icon icon="lets-icons:date-fill" class="date-icon" />
                                <span class="date"> {{ isoToDateString( sale.createdAt) }}  </span>
                                <span class="time"> {{ isoToDayTime(sale.createdAt) }} </span>
                            </div>
                        </div>
                    </div>
    
                    <div class="noti-body d-flex align-items-center">
                        <button class="btn primary smaller" @click="confirmSale(sale)"> Confirm </button>
                    </div>
                </div>
            </template>

            <div class="no-notifications text-center" v-else>
                Seems like there are no notifications for you yet!
            </div>
        </div>

    </div>
</template>

<script>
import { Icon } from '@iconify/vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'ChatSystem',

    inject: ['emitter', 'productApi'],
    emits: ['has-unread'],

    props: {

    },

    components: {
        Icon
    },

    data() {
        return {
            unconfirmedSales: []
        }
    },

    methods: {
        ...mapActions(
            {

            }
        ),

        async getUserUnconfirmedSales() {
            const resp = await this.productApi.getUserUnconfirmedSales(this.getLoggedUser._id);
            const sales = resp.data;
            if (!sales) return;

            const uniqueProductIds = sales.filter((sale, index, self) =>
                index === self.findIndex(o => o.productId === sale.productId)
            ).map(sale => sale.productId);
            const products = [];

            await Promise.all(
                uniqueProductIds.map(async (prodId) => {
                    const resp = await this.productApi.getProduct(prodId);
                    if (resp.data) {
                        products.push(resp.data);
                    }
                })
            );

            this.unconfirmedSales = sales.map(sale => ({
                ...sale,
                productDetail: products.find(prod => prod._id == sale.productId)
            }));
            console.log("unconfirmed sales?", this.unconfirmedSales);
            this.$emit("has-unread", this.unconfirmedSales && this.unconfirmedSales.length ? true : false);
        },

        async confirmSale(sale) {
            this.emitter.emit("show-loader");

            const resp = await this.productApi.confirmSale(sale._id);
            console.log("did?", resp);
            if (resp.data.success) {
                this.$toast.success("ConfirmSaleSuccess");
                await this.getUserUnconfirmedSales();
            } else
                this.$toast.error("ConfirmSaleFailed");

            this.emitter.emit("hide-loader");
        }
    },
    
    computed: {
        ...mapGetters(
            {
                getLoggedUser: "user/getUser"
            }
        ),
    },

    created() {

    },

    async mounted() {
        this.emitter.emit("show-loader");

        await this.getUserUnconfirmedSales();

        this.emitter.emit("hide-loader");
    }
}
</script>

<style scoped>
.notification {
    padding: 16px;
    background-color: var(--white-5a);
    border-radius: 16px;
}
.notification:nth-child(even) {
    background-color: var(--white-7a);
}

.alert-icon-cont {
    font-size: 24px;
    background: var(--white-10a);
    border-radius: 50%;
    padding: 8px;
}

.sale-info a {
    font-weight: bold;
    transition: filter 0.15s ease-in-out;
    padding: 0 8px;
}
.sale-info a:hover {
    filter: brightness(0.7);
}

.item-date {
    font-size: 14px;
}

.item-date .date-icon {
    font-size: 20px;
    opacity: 0.5;
}

.item-date .date {
    font-weight: bold;
}

.item-date .time {
    font-weight: 100;
}

.no-notifications {
    margin-top: 16px;
    opacity: 0.5;
}

</style>