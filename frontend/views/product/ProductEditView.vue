<template>
    <div class="product-edit">
      <ProductEditContent :is-add=isAdd></ProductEditContent>
    </div>
  </template>
  
  <script>
import ProductEditContent from '../../src/components/product/ProductEditContent.vue';
  
  export default {
    head() {
        return {
            title: `Product ${this.isAdd ? 'add' : 'edit'} - UNIZA Marketplace`,
            meta: [
                { name: "robots", content: "noindex, nofollow" },
            ]
        }
    },
  
    name: 'ProductEditView',

    props: {
      isAdd: {
        type: Boolean,
        default: false
      }
    },
    
    components: {
        ProductEditContent
    },
  }
  </script>  