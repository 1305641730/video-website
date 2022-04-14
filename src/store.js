import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: null,
    userName: null,
    avatar: null
  },
  mutations: {
    setUserId(state, userId) {
      state.userId = userId
    },
    getUserId(state) {
      return state.userId
    },
    setUserName(state, userName) {
      state.userName = userName
    },
    getUserName(state) {
      return state.userName
    },
    setAvatar(state, avatar) {
      state.avatar = avatar
    },
    getAvatar(state) {
      return state.avatar
    }
  },
  actions: {

  },
  // 解决vuex界面刷新数据丢失
  plugins: [createPersistedState()]
})
