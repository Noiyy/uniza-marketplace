<template>
    <div class="products-wrapper" :class="wrapperClasses" v-if="products.length">
        <template v-for="(prod, index) in products" :key="index">
            <ProductItem v-if="prod"
                :prod-data="prod"
                :view-type="activeViewType"
                :is-in-admin="isInAdmin"
                :is-in-favorites="isInFavorites"
                :seller-data="sellerData"
                @remove-bookmark="removeBookmark"
            ></ProductItem>
        </template>
    </div>

    <div class="products-wrapper no-items text-center pos-relative" v-else>
        <span> {{ $t('NoProductsFound') }} </span>
        <Icon icon="game-icons:capybara" class="no-items-icon" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex/dist/vuex.cjs.js';
import ProductItem from './ProductItem.vue';
import { Icon } from '@iconify/vue';

export default {
    name: 'ProductsList',

    inject: ['emitter', 'userApi'],
    emits: ["removed-bookmark"],

    props: {
        products: {
            type: Array,
            default: []
        },

        activeViewType: {
            type: String,
            default: "list"
        },

        wrapperClass: {
            type: String,
            default: null
        },

        isInAdmin: {
            type: Boolean,
            default: false
        },

        isInFavorites: {
            type: Boolean,
            default: false
        },

        sellerData: {
            type: Object,
            default: null
        }
    },

    components: {
        ProductItem,
        Icon
    },

    data() {
        return {

        }
    },

    methods: {
        async removeBookmark(prodData) {
            console.log("remove b", prodData);
            if (this.getLoggedUser) {
                this.emitter.emit("show-loader");

                const resp = await this.userApi.bookmarkProduct(this.getLoggedUser._id, prodData._id);
                console.log("gh", resp);
                if (resp.data.removed) {
                    if (resp.data.success) {
                        this.$toast.success(this.$t("BookmarkRemoveSuccess"));
                        this.emitter.emit("update-user-data");
                        this.$emit("removed-bookmark", prodData._id);
                    } else {
                        this.$toast.error(this.$t("BookmarkRemoveFailed"));
                    }
                } else
                    this.$toast.error(this.$t("BookmarkRemoveFailed"));
    
                this.emitter.emit("hide-loader");
            } 
        },
    },

    computed: {
        ...mapGetters(
            {
                getLoggedUser: "user/getUser"
            }
        ),

        wrapperClasses() {
            let classes = "";
            classes += this.activeViewType && this.activeViewType == 'list' ? 'list ' : 'grid ';
            classes += this.wrapperClass ? `${this.wrapperClass} ` : '';

            return classes;
        }
    }
}
</script>

<style scoped>
.products-wrapper.list {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.products-wrapper.grid {
    display: grid;
    row-gap: 24px;
    column-gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}

.products-wrapper.grid.smaller {
    grid-template-columns: repeat(auto-fit, minmax(150px, 178px));
}
</style>