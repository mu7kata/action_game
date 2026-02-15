import { createStore } from 'vuex';
import enemy from './store/enemy.js'
import player from './store/player.js'

export default createStore({
  modules: {
    enemy,
    player
  },
})
