<template>
    <div class="products-wrapper" :class="wrapperClasses" v-if="products.length">
        <template v-for="(prod, index) in products" :key="index">
            <ProductItem v-if="prod"
                :prod-data="prod"
                :view-type="activeViewType"
            ></ProductItem>
        </template>
    </div>

    <div class="products-wrapper no-items text-center pos-relative" v-else>
        <span> No products were found! :( </span>
        <Icon icon="game-icons:capybara" class="no-items-icon" />
    </div>
</template>

<script>
import ProductItem from './ProductItem.vue';
import { Icon } from '@iconify/vue';

export default {
    name: 'ProductsList',

    inject: ['axios', 'emitter'],
    emits: [],

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

    computed: {
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