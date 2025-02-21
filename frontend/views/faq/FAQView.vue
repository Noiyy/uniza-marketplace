<template>
    <div class="faq">
      <FAQContent></FAQContent>
    </div>
  </template>
  
  <script>
import FAQContent from '../../src/components/faq/FAQContent.vue';
  
  export default {
    head() {
      return {
        title: `FAQ - UNIZA Marketplace`,
        meta: [
          { name: "description", content: "" },
          // { name: "image", content: "https://picsum.photos/seed/picsum/500/300" },
          { name: "robots", content: "index, follow" },
          
          { property: "og:title", content: `FAQ - UNIZA Marketplace` },
          { property: "og:type", content: "website" },
          { property: "og:description", content: "" },
          // { property: "og:image", content: "https://picsum.photos/seed/picsum/500/300" },
          
          { name: "twitter:title", content: `FAQ - UNIZA Marketplace` },
          { name: "twitter:description", content: "" },
          { name: "twitter:card", content: "summary" },
          // { name: "twitter:image", content: "https://picsum.photos/seed/picsum/500/300" }
        ],
        link: []
      }
    },
  
    name: 'FAQView',
    
    components: {
        FAQContent
    },
  }
  </script>  