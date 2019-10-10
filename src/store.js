import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 存储token
    Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
    cancelTokenArr: [], // 取消请求token数组
    // keepAlive: ['scanlogs', 'cclogs', 'attacklogs', 'accesslogs']
    keepAlive: []
  },
  mutations: {
    // 修改token，并将token存入localStorage
    changeLogin (state, user) {
      state.Authorization = user.Authorization
      localStorage.setItem('Authorization', user.Authorization)
    },
    pushToken (state, payload) {
      state.cancelTokenArr.push(payload.cancelToken)
    },
    clearToken ({ cancelTokenArr }) {
      cancelTokenArr.forEach(item => {
        item('路由跳转取消请求')
      })
      cancelTokenArr = []
    },
    setKeepAlive: (state, keepAlive) => {
      state.keepAlive = keepAlive
    }
  },
  getters: {
    keepAlive: state => state.keepAlive
  },
  actions: {

  }
})
