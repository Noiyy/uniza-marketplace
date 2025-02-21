<template>
    <div class="product-edit">
      <ProductEditContent></ProductEditContent>
    </div>
  </template>
  
  <script>
import ProductEditContent from '../../src/components/product/ProductEditContent.vue';
  
  export default {
    head() {
        return {
            title: `Product edit - UNIZA Marketplace`,
            meta: [
                { name: "robots", content: "noindex, nofollow" },
            ]
        }
    },
  
    name: 'ProductEditView',
    
    components: {
        ProductEditContent
    },
  }
  </script>  