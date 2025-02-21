<template>
    <div class="product-detail">
      <ProductDetailContent></ProductDetailContent>
    </div>
  </template>
  
  <script>
import ProductDetailContent from '../../src/components/product/ProductDetailContent.vue';
  
  export default {
    head() {
      return {
        title: `Product - UNIZA Marketplace`,
        meta: [
          { name: "description", content: "" },
          // { name: "image", content: "https://picsum.photos/seed/picsum/500/300" },
          { name: "robots", content: "index, follow" },
          
          { property: "og:title", content: `Product - UNIZA Marketplace` },
          { property: "og:type", content: "website" },
          { property: "og:description", content: "" },
          // { property: "og:image", content: "https://picsum.photos/seed/picsum/500/300" },
          
          { name: "twitter:title", content: `Product - UNIZA Marketplace` },
          { name: "twitter:description", content: "" },
          { name: "twitter:card", content: "summary" },
          // { name: "twitter:image", content: "https://picsum.photos/seed/picsum/500/300" }
        ],
        link: []
      }
    },
  
    name: 'ProductDetailView',
    
    components: {
        ProductDetailContent
    },
  }
  </script>  