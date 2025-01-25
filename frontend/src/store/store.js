import { createStore } from 'vuex'
import miscModule from './modules/miscModule'
import productModule from './modules/productModule'

export default createStore({
  modules: {
    misc: miscModule,
    product: productModule
  },

  state: {
  },

  getters: {
  },

  mutations: {
  },

  actions: {
  },
})
