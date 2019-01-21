import * as TYPES from '../type'

export default {
  state: {
    userID: undefined,
    userName: undefined,
    gameID: undefined,
    gameType: undefined
  },

  mutations: {
    // 設定會員資料
    [TYPES.SET_USER_INFO](state, payload) {
      for ( let index in payload) {
        for (let sIndex in state) {
          if (index === sIndex && typeof payload[index] !== 'undefined' && state[sIndex] !== payload[index]) {
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
    getUserID(state) {
      return state.userID
    },

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
