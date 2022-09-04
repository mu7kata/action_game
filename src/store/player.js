const state = {
  status: {
    attack: 20,
    life: 20,
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
  selectPlayer(state, value) {
    var selectPlayer =
      {
        'kaki': {   //HACK:数字で管理しない方がいいかも
          attack: 20,
          life: 2,
          speed: 100,
          motionRange: 100
        },
        'eda': {
          attack: 5,
          life: 1,
          speed: 200,
          motionRange: 100
        },
        'haru': {
          attack: 5,
          life: 1,
          speed: 200,
          motionRange: 100
        },
        'kuni': {
          attack: 50,
          life: 100,
          speed: 200,
          motionRange: 100
        }
      }
    ;
    state.status.attack = selectPlayer[value].attack
    state.status.life = selectPlayer[value].life
    state.status.speed = selectPlayer[value].speed
    state.status.motionRange = selectPlayer[value].motionRange
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
