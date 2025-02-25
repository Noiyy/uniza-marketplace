<template>
  <Loader v-show="isLoader"></Loader>

  <router-view v-slot="{ Component, route }">
    <component :is="Component" :key="route.path" v-if="isLoaded"></component>
  </router-view>

  <div class="scroll-to-top" id="scrollToTopBtn" @click="scrollToHeader()">
    <Icon icon="mdi:arrow-up" class="scroll-btn-img" />
  </div>

  <router-link to="/chat" class="chat-bubble" v-if="getUser">
    <div class="notification-count d-flex justify-content-center align-items-center"> 2 </div>
    <Icon icon="humbleicons:chat" class="chat-bubble-icon" />
  </router-link>
</template>

<script>
import { mapActions } from 'vuex';

import Loader from './components/Loader.vue';
import { Icon } from '@iconify/vue';
import { mapGetters } from 'vuex/dist/vuex.cjs.js';

export default {
  name: "MainApp",

  inject: ['emitter', 'userApi', 'productApi', 'miscApi'],

  components: {
    Icon,
    Loader
  },

  data() {
    return {
      isLoader: false,
      isLoaded: false,
      appName: this.APP_NAME,

      rootElement: document.documentElement,
    }
  },

  methods: {
    ...mapActions(
      {
        setIsMobile: "misc/setIsMobile",
        setCategories: "product/setAllCategories",
        setAllPSC: "misc/setAllPSC",

        setUser: 'user/setUser'
      }
    ),

    showLoader() {
      this.isLoader = true;
    },

    hideLoader() {
      this.isLoader = false;
    },

    handleScroll() {
      const scrollTotal = this.rootElement.scrollHeight - this.rootElement.clientHeight;
      const scrollRatio = this.rootElement.scrollTop / scrollTotal;
      const fullPageHeight = Math.max(
          document.body.scrollHeight, document.body.offsetHeight, 
          document.documentElement.clientHeight, document.documentElement.scrollHeight, 
          document.documentElement.offsetHeight
      );

      if (fullPageHeight > 1400 && scrollRatio > 0.55) scrollToTopBtn.classList.add("active");
      else if (scrollToTopBtn.classList.contains("active")) scrollToTopBtn.classList.remove("active");
    },

    scrollToHeader() {
      if (!scrollToTopBtn) return;
      if (!scrollToTopBtn.classList.contains("active")) return;
      document.querySelector('header').scrollIntoView({ 
          behavior: 'smooth' 
      });
    },
  },

  created() {
    this.setIsMobile(screen.width <= 760);
    
    window.onresize = (e) => {
      console.log("Resized window!", screen.width);
      this.setIsMobile(screen.width <= 760);
      this.emitter.emit("resized-window");
    };

    document.addEventListener('scroll', () => {
      this.handleScroll();
    });

    document.addEventListener("click", (e) => {
      this.emitter.emit("check-header-filters", e);
      this.emitter.emit("check-browse-filters", e);
      this.emitter.emit("check-sidebar-outside-click", e);
    });
  },

  async mounted() {
    this.emitter.on('show-loader', this.showLoader);
    this.emitter.on('hide-loader', this.hideLoader);

    this.isLoaded = true;

    this.emitter.emit("show-loader");
    // const usersResp = await this.userApi.getAllUsers();

    const categoriesResp = await this.productApi.getAllCategories();
    if (categoriesResp.data) {
      this.setCategories(categoriesResp.data);
    }

    const pscResp = await this.miscApi.getAllPSC();
    if (pscResp.data) {
      this.setAllPSC(pscResp.data);
    }
    this.emitter.emit("hide-loader");
  },

  computed: {
    ...mapGetters(
      {
        getUser: 'user/getUser'
      }
    )
  },

  unmounted() {
    this.emitter.off('show-loader', this.showLoader);
    this.emitter.off('hide-loader', this.hideLoader);
  },
}
</script>

<style>
.scroll-to-top {
    position: fixed;
    border-radius: 50%;
    border: 1px solid var(--primary);
    padding: 5px;
    bottom: 32px;
    left: 32px;
    opacity: 0;
    z-index: 10;
    display: flex;
    transition: opacity 0.2s ease-in-out;
    color: var(--secondary);
    filter: drop-shadow(0px 0px 15px #fff);
}
.scroll-to-top.active {
    opacity: 0.33;
}

.scroll-to-top.active:hover {
    cursor: pointer;
    opacity: 0.75;
}

.scroll-btn-img {
    width: 24px;
    height: 24px;
}

.chat-bubble {
  position: fixed;
  border-radius: 50%;
  padding: 4px;
  bottom: 32px;
  right: 32px;
  z-index: 10;
  display: flex;
  color: var(--black);
  background-color: var(--accent);
  filter: drop-shadow(0px 0px 5px #fff);
  font-size: 40px;
  cursor: pointer;
  transition: transform 0.2s ease-out;
}
.chat-bubble:hover {
  color: var(--black);
  transform: scale(1.2);
}

.chat-bubble .notification-count {
  position: absolute;
  top: -8px;
  right: -8px;
  color: var(--white);
  background-color: var(--red);
  font-size: 16px;
  font-weight: 800;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

/* Scrollbar
width */
.scrollbar::-webkit-scrollbar {
  width: 4px;
}
/* Track */
.scrollbar::-webkit-scrollbar-track {
  background: var(--black);
}
/* Handle */
.scrollbar::-webkit-scrollbar-thumb {
  background: var(--primary);
}
/* Handle on hover */
.scrollbar::-webkit-scrollbar-thumb:hover {
  background: #d57579;
}

.vue-slider .vue-slider-process {
  background-color: var(--primary);
}

.content-wrapper {
  min-height: 100vh;
  min-height: 100svh;
}

.content-wrapper > section {
  min-height: 100vh;
  min-height: 100svh;
}

.Vue-Toastification__toast.Vue-Toastification__toast--success {
  background-color: var(--green) !important;
}
.Vue-Toastification__toast.Vue-Toastification__toast--error {
  background-color: var(--red) !important;
}
.Vue-Toastification__toast.Vue-Toastification__toast--info {
  background-color: var(--blue) !important;
}
.Vue-Toastification__toast.Vue-Toastification__toast--warning {
  background-color: var(--accent) !important;
}

.line-divider {
  width: 100%;
  height: 1px;
  background-color: var(--white-15a);
}
</style>
