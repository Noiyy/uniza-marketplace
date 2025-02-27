import { createStore } from 'vuex'
import miscModule from './modules/miscModule'
import productModule from './modules/productModule'
import userModule from './modules/userModule'
import browseModule from './modules/browseModule'

export default createStore({
  modules: {
    misc: miscModule,
    product: productModule,
    user: userModule,
    browse: browseModule
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
