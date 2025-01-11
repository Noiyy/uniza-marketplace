<template>
  <div class="home">
    <HomeContent></HomeContent>
  </div>
</template>

<script>
import HomeContent from '../../src/components/home/HomeContent.vue';

export default {
  head() {
    return {
      title: `UNIZA Marketplace`,
      meta: [
        { name: "description", content: "" },
        // { name: "image", content: "https://picsum.photos/seed/picsum/500/300" },
        { name: "robots", content: "index, follow" },
        
        { property: "og:title", content: `UNIZA Marketplace` },
        { property: "og:type", content: "website" },
        { property: "og:description", content: "" },
        // { property: "og:image", content: "https://picsum.photos/seed/picsum/500/300" },
        
        { name: "twitter:title", content: `UNIZA Marketplace` },
        { name: "twitter:description", content: "" },
        { name: "twitter:card", content: "summary" },
        // { name: "twitter:image", content: "https://picsum.photos/seed/picsum/500/300" }
      ],
      link: []
    }
  },

  name: 'HomeView',
  
  components: {
    HomeContent
  },
}
</script>
