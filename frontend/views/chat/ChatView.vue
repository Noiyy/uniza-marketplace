<template>
    <div class="chat">
      <ChatContent :chat-mode="mode"></ChatContent>
    </div>
  </template>
  
  <script>
import ChatContent from '../../src/components/chat/ChatContent.vue';
  
  export default {
    head() {
      return {
        title: `Chat - UNIZA Marketplace`,
        meta: [
          { name: "description", content: "" },
          // { name: "image", content: "https://picsum.photos/seed/picsum/500/300" },
          { name: "robots", content: "index, follow" },
          
          { property: "og:title", content: `Chat - UNIZA Marketplace` },
          { property: "og:type", content: "website" },
          { property: "og:description", content: "" },
          // { property: "og:image", content: "https://picsum.photos/seed/picsum/500/300" },
          
          { name: "twitter:title", content: `Chat - UNIZA Marketplace` },
          { name: "twitter:description", content: "" },
          { name: "twitter:card", content: "summary" },
          // { name: "twitter:image", content: "https://picsum.photos/seed/picsum/500/300" }
        ],
        link: []
      }
    },
  
    name: 'ChatView',

    props: {
      mode: {
        type: String,
        default: "chat"
      }
    },
    
    components: {
        ChatContent
    },
  }
  </script>  