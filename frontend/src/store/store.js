import { createStore } from 'vuex'
import miscModule from './modules/miscModule'
import productModule from './modules/productModule'
import userModule from './modules/userModule'

export default createStore({
  modules: {
    misc: miscModule,
    product: productModule,
    user: userModule
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
