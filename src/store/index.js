import Vue from 'vue'
import Vuex from 'vuex'
import grid from './grid'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  getters : {},
  modules: {
    grid: grid
  }
})
