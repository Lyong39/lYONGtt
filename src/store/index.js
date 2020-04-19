import Vue from 'vue'
import Vuex from 'vuex'
import { localGet, localSet } from '../utils/mylocal'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 保存用户信息
    userInfo: localGet('userInfo') || {}
  },
  mutations: {
    // 给userInfo设置值  payload：要设置的值
    setUserInfo: function (state, payload) {
      state.userInfo = payload
      localSet('userInfo', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
