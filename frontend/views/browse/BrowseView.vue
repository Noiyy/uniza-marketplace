<template>
    <div class="browse">
      <BrowseContent></BrowseContent>
    </div>
  </template>
  
  <script>
 import BrowseContent from '../../src/components/browse/BrowseContent.vue';
  
  export default {
    head() {
      return {
        title: `Browse - UNIZA Marketplace`,
        meta: [
          { name: "description", content: "" },
          // { name: "image", content: "https://picsum.photos/seed/picsum/500/300" },
          { name: "robots", content: "index, follow" },
          
          { property: "og:title", content: `Browse - UNIZA Marketplace` },
          { property: "og:type", content: "website" },
          { property: "og:description", content: "" },
          // { property: "og:image", content: "https://picsum.photos/seed/picsum/500/300" },
          
          { name: "twitter:title", content: `Browse - UNIZA Marketplace` },
          { name: "twitter:description", content: "" },
          { name: "twitter:card", content: "summary" },
          // { name: "twitter:image", content: "https://picsum.photos/seed/picsum/500/300" }
        ],
        link: []
      }
    },
  
    name: 'BrowseView',
    
    components: {
        BrowseContent
    },
  }
  </script>  