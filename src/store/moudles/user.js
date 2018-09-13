import * as TYPES from '../type'

export default {
  state: {
    userName: undefined,
    gameID: undefined,
    gameType: undefined
  },

  mutations: {
    // 設定會員資料
    [TYPES.SET_USER_INFO](state, payload) {
      for ( let index in payload) {
        for (let sIndex in state) {
          if (index === sIndex && payload[index] && state[sIndex] !== payload[index]) {
            state[sIndex] = payload[index]
          }
        }
      }
    }
  },

  actions: {
    setUserInfo({commit}, payload) {
      commit(TYPES.SET_USER_INFO, payload)
    }
  },

  getters: {
    getUserName(state) {
      return state.userName
    },

    getGameID(state) {
      return state.gameID
    },
    
    getGameType(state) {
      return state.gameType
    }
  }
}
