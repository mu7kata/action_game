import Vue from 'vue';
import Vuex from 'vuex';
import enemy from './store/enemy.js'
import player from './store/player.js'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    enemy,
    player
  },
})
