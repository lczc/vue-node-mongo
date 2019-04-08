import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import modules from './stores'
Vue.use(Vuex)
const store = new Vuex.Store({
  plugins: [createPersistedState({
    storage: window.localStorage
  })],
  modules
})

export default store
