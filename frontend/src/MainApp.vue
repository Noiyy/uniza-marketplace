<template>
  <!-- <Loader v-show="isLoader"></Loader> -->
  <router-view v-slot="{ Component, route }">
    <component :is="Component" :key="route.path" v-if="isLoaded"></component>
  </router-view>

  <div class="scroll-to-top" id="scrollToTopBtn" @click="scrollToHeader()">
    <Icon icon="mdi:arrow-up" class="scroll-btn-img" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { Icon } from '@iconify/vue';

export default {
  name: "MainApp",

  inject: ['emitter', 'userApi', 'productApi', 'miscApi'],

  components: {
    Icon
  },

  data() {
    return {
      isLoader: true,
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
        setAllPSC: "misc/setAllPSC"
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
      if (!scrollToTopBtn.classList.contains("active")) return;
      document.querySelector('header').scrollIntoView({ 
          behavior: 'smooth' 
      });
    },

    // async getLoggedInUser() {
    //   if (this.$isAdmin) return;
    //   try {
    //       const response = await this.axios.get(`${this.adminRoute}/getSessionUser`, { withCredentials: true });
    //       const respData = response.data;

    //       if (respData.user && respData.user.isAdmin) {
    //           this.emitter.emit('update-isAdmin', true);
    //           console.log("isAdmin",this.$isAdmin);
    //       }

    //   } catch (error) {
    //       console.log("err:", error);
    //       this.toast.error(error);
    //   }
    // },
  },

  created() {
    this.setIsMobile(screen.width <= 760);
    
    window.onresize = (e) => {
      console.log("Resized window!", screen.width);
      this.setIsMobile(screen.width <= 760);
    };

    document.addEventListener('scroll', () => {
      this.handleScroll();
    });
  },

  async mounted() {
    this.emitter.on('show-loader', this.showLoader);
    this.emitter.on('hide-loader', this.hideLoader);

    // this.getLoggedInUser();
    this.isLoaded = true;

    const usersResp = await this.userApi.getAllUsers();
    console.log("users", usersResp);

    const categoriesResp = await this.productApi.getAllCategories();
    if (categoriesResp.data) {
      this.setCategories(categoriesResp.data);
    }
    console.log("ctg", categoriesResp)

    const pscResp = await this.miscApi.getAllPSC();
    console.log("psc", pscResp);
    if (pscResp.data) {
      this.setAllPSC(pscResp.data);
    }
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
    border: 1px solid var(--black);
    padding: 5px;
    bottom: 32px;
    right: 32px;
    opacity: 0;
    z-index: 10;
    display: flex;
    transition: opacity 0.2s ease-in-out;
}
.scroll-to-top.active {
    opacity: 0.33;
}
.scroll-to-top.light {
  border: 1px solid var(--white);
}

.scroll-to-top.active:hover {
    cursor: pointer;
    opacity: 0.75;
}

.scroll-btn-img {
    width: 24px;
    height: 24px;
}
.scroll-to-top.light .scroll-btn-img {
  filter: invert(1);
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
</style>
