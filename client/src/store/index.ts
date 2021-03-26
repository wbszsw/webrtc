import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    socket:null
  },
  mutations: {
    setSocket(obj) {
      // state.socket = obj
    }
  },
  actions: {
  },
  modules: {
  }
})
