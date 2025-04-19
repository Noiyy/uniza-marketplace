<template>
    <div class="product-favorites">
        <ProductFavoritesContent></ProductFavoritesContent>
    </div>
  </template>
  
  <script>
import ProductFavoritesContent from '../../src/components/product/ProductFavoritesContent.vue';
  
  export default {
    head() {
        return {
            title: `Favorites - UNIZA Marketplace`,
            meta: [
                { name: "robots", content: "noindex, nofollow" },
            ]
        }
    },
  
    name: 'ProductFavoritesView',
    
    components: {
        ProductFavoritesContent
    },
  }
  </script>  