import Vue from 'vue';
import Vuex from 'vuex';
import enemy from './store/enemy.js'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    enemy
  },
})
