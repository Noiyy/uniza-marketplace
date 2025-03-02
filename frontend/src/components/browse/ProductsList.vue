<template>
    <div class="products-wrapper" :class="activeViewType == 'list' ? 'list' : 'grid'" v-if="products.length">
        <template v-for="(prod, index) in products" :key="index">
            <ProductItem v-if="prod"
                :prod-data="prod"
                :view-type="activeViewType"
            ></ProductItem>
        </template>
    </div>

    <div class="products-wrapper no-products text-center pos-relative" v-else>
        <span> No products were found! :( </span>
        <Icon icon="game-icons:capybara" class="no-products-icon" />
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

.no-products {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.no-products span {
    font-weight: 200;
    font-size: 18px;
}

.no-products-icon {
    font-size: 56px;
    opacity: 0.33;
    transition: transform 0.6s ease-in-out;
}
.no-products-icon:hover {
    transform: rotate(360deg);
}
</style>