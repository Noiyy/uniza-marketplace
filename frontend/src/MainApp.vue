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
      console.log(scrollToTopBtn);
      if (!scrollToTopBtn) return;
      if (!scrollToTopBtn.classList.contains("active")) return;
      window.scrollTo({ top: 0, left: 0, behavior: "smooth"});
    },

    
    async updateLoggedUser() {
      const resp = await this.userApi.getUserById(this.getUser._id);
      let user = resp.data;
      if (user) {
        this.setUser(user);
      }
    }
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
      console.log("all psc", pscResp.data);
      this.setAllPSC(pscResp.data);
    }
    this.emitter.emit("hide-loader");

    this.emitter.on("update-user-data", () => this.updateLoggedUser());
  },

  computed: {
    ...mapGetters(
      {
        getUser: 'user/getUser',
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
  filter: drop-shadow(0px 0px 5px rgba(255, 255, 255, 0.5));
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
  opacity: 0.75;
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

.star-icon {
  color: var(--primary);
  font-size: 20px;
}
.star-icon.empty {
  color: rgba(255, 255, 255, 0.5);
}

.sort-icon {
    color: var(--primary);
    font-size: 20px;
}

.selected-cont .selected {
    font-size: 14px;
    gap: 2px;
    user-select: none;
}

.chevron-icon {
    font-size: 18px;
}

.sort-filters {
    cursor: pointer;
}

.filters-dropdown-content {
    top: 32px;
    right: 0;
    cursor: initial;
}
.filters-dropdown-content .option {
    cursor: pointer;
}

.result-views .view-icon-cont {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    font-size: 20px;
    color: var(--black);
    background: var(--gradient-angle);
    opacity: 0.33;
    cursor: pointer;
    transition: all 0.2s ease-out;
}
.result-views .view-icon-cont:hover {
    opacity: 0.5;
}
.result-views .view-icon-cont.active {
    opacity: 1;
}

.view-divider {
    position: absolute;
    bottom: -24px;
    left: 0;
    width: 100%;
}

.view-divider .divider {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
    height: 1px;
    background-color: var(--white-15a);
}

.view-divider .btn {
    padding: 2px 24px;
    font-weight: 600;
    text-transform: capitalize;
}

.no-items {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.no-items span {
    font-weight: 200;
    font-size: 18px;
}

.no-items-icon {
    font-size: 56px;
    opacity: 0.33;
    transition: transform 0.6s ease-in-out;
}
.no-items-icon:hover {
    transform: rotate(360deg);
}

.breadcrumbs {
  opacity: 0.5;
  font-size: 14px;
  line-height: 100%;
}

.view-divider.shorter {
    bottom: 16px;
    width: 80%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
}

.view-divider.shorter .divider {
    background-color: var(--white-33a);
}

.view-divider-cont .hidden-overlay {
    position: absolute;
    top: 104px;
    left: 0;
    width: 100%;
    height: 72%;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 100%);
}

.nav-btns-wrapper {
    background-color: var(--white-5a);
    border-radius: 8px;
    padding: 8px;
    gap: 4px;
}

.nav-btns-wrapper .btn.nav-btn {
    text-transform: capitalize;
    transition: background-color 0.2s ease-in;
    padding: 2px 24px;
}
.nav-btns-wrapper .btn.nav-btn:hover {
    background-color: var(--white-5a);
}
.nav-btns-wrapper .btn.nav-btn:active {
  border: none;
}

.nav-btns-wrapper .btn.nav-btn.active {
    background-color: var(--white-10a);
    border-color: transparent;
}

.list-item-cont .item-id-info {
    opacity: 0.33;
    color: var(--white);
    font-weight: 200;
    font-size: 12px;
    position: absolute;
    bottom: -18px;
    left: 64px;
}

.list-item-cont .list-item {
    border-radius: 16px;
    background-color: var(--white-2a);
    transition: box-shadow 0.2s ease-out;
    position: relative;
}

.list-item-cont:nth-child(even) .list-item {
    background-color: var(--white-7a);
}

.list-item-cont .list-item-controls .btn {
    background-color: var(--primary);
    color: var(--black);
}
.list-item-cont .list-item-controls .btn:hover {
    filter: brightness(0.7);
}

.list-item-cont:nth-child(even) .list-item-controls .btn {
    background-color: var(--secondary);
}

.multiselect {
  color: var(--white);
  border: 2px solid var(--primary);
  border-radius: 8px;
}

.multiselect__placeholder {
  color: var(--white) !important;
  opacity: 0.4;
  font-size: 16px !important;
  padding-left: 5px;
}

.multiselect__tags {
  background-color: var(--black) !important;
  border: none !important;
}

.multiselect__input {
  background-color: var(--black) !important;
  color: var(--white) !important;
}
.multiselect__input::placeholder {
  color: rgba(255, 255, 255, 0.5) !important;
} 

.multiselect__content-wrapper {
  border: none !important;
  background: var(--black) !important;
  color: var(--white) !important;
}


.multiselect__content-wrapper {
  box-shadow: 0px 8px 16px rgba(255, 154, 158, 0.2);
}

.multiselect__select::before {
  border-width: 7px 7px 0 !important;
  top: 70% !important;
}

.multiselect__single {
  background: var(--black) !important;
  color: var(--white) !important;
  font-weight: bold;
}

.input-cont:has(.multiselect--active) .input-tag {
  z-index: 51;
}

.input-cont:has(.multiselect--above) .input-tag {
  z-index: 1;
}

.multiselect__option--selected {
  background: rgba(255, 255, 255, 0.1) !important;
  color: var(--white) !important;
}

.multiselect__option--highlight {
  background: var(--green) !important;
}

.multiselect__option--selected.multiselect__option--highlight {
  background: var(--red) !important;
}

.multiselect--disabled .multiselect__current, .multiselect--disabled .multiselect__select {
  background: var(--black) !important;
}

.admin-badge-small {
  font-size: 12px;
  font-weight: bold;
  border-radius: 8px;
  background-color: var(--accent);
  color: var(--black);
  padding: 0 8px;
}
.banned-badge {
  background-color: var(--red);
}
</style>
