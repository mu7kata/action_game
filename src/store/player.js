const state = {
  status: {
    attack: 20,
    life: 20,
    speed: 300, //値が小さければ小さいほどいい。行動の間隔
    motionRange: 50,
    attackType: 'shortDistance'
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
          attack: 25,
          life: 300,
          speed: 100,
          motionRange: 20,
          attackType:'shortDistance'
        },
        'eda': {
          attack: 10,
          life: 250,
          speed: 200,
          motionRange: 150,
          attackType:'shortDistance'
        },
        'haru': {
          attack: 15,
          life: 200,
          speed: 200,
          motionRange: 100,
          attackType:'shortDistance'
        },
        'kuni': {
          attack: 7.5,
          life: 120,
          speed: 200,
          motionRange: 100,
          attackType:'longDistance'
        }
      }
    ;
    state.status.attack = selectPlayer[value].attack
    state.status.life = selectPlayer[value].life
    state.status.speed = selectPlayer[value].speed
    state.status.motionRange = selectPlayer[value].motionRange
    state.status.attackType = selectPlayer[value].attackType
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
