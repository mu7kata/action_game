const state = {
  status: {
    attack: 2,
    life: 10,
    speed: 300, //値が小さければ小さいほどいい。行動の間隔
    motionRange: 100,
  }
}

const getters = {
  status: state => state.status
}

const actions = {}

const mutations = {
  changeLife(state, value) {
    state.status.life = state.status.life - value;
  },
  selectEnemy(state, value) {
    var selectEnemy =
      {
        1: {   //HACK:数字で管理しない方がいいかも
          attack: 5,
          life: 50,
          speed: 150,
          motionRange: 100
        },
        2: {
          attack: 20,
          life: 100,
          speed: 180,
          motionRange: 120
        }    ,
        3: {
          attack: 50,
          life: 170,
          speed: 100,
          motionRange: 200
        }
      }
    ;

    state.status.attack = selectEnemy[value].attack
    state.status.life = selectEnemy[value].life
    state.status.speed = selectEnemy[value].speed
    state.status.motionRange = selectEnemy[value].motionRange
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
