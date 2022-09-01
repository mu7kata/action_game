const state = {
  attack: 2,
  life: 10,
  speed: 300, //値が小さければ小さいほどいい。行動の間隔
  motionRange: 100,
}

const getters = {
  attack: state => state.attack,
  life: state => state.life,
  speed: state => state.speed,
  motionRange: state => state.motionRange,
}

const actions = {}

const mutations = {
  changeLife(state, value) {
    state.life = state.life - value;
  },
  selectEnemy(state, value) {
    var selectEnemy =
      {
        1: {   //HACK:数字で管理しない方がいいかも
          attack: 1,
          life: 2,
          speed: 100,
          motionRange: 100
        },
        2: {
          attack: 5,
          life: 1,
          speed: 200,
          motionRange: 100
        }
      }
    ;

    state.attack = selectEnemy[value].attack
    state.life = selectEnemy[value].life
    state.speed = selectEnemy[value].speed
    state.motionRange = selectEnemy[value].motionRange
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
