'use strict'

import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'iview'
// Vue.component('Message', Message)
// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: 'http://117.136.182.230/hedunwaf/',
  baseURL: 'http://106.13.41.122:8000/hedunwaf/',
  // baseURL: process.env.VUE_APP_API_URL || process.env.apiUrl || '',
  timeout: 60 * 1000, // Timeout
  withCredentials: true // Check cross-site Access-Control
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    config.cancelToken = new axios.CancelToken(function (cancel) {
      store.commit('pushToken', { cancelToken: cancel })
    })
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    if (response.data.code) {
      if (response.data.msg.indexOf('You are not logged in') > -1) {
        Message.error({
          content: '登录时间过期',
          duration: 5,
          closable: true
        })
        router.push('/login')
      } else {
        Message.error({
          content: response.data.msg,
          duration: 5,
          closable: true
        })
      }
    }

    // Do something with response data
    return response
  },
  function (error) {
    if (error.response.status >= 500) {
      Message.error({
        content: '服务器忙，请稍后重试',
        duration: 5,
        closable: true
      })
    }
    // Do something with response error
    return Promise.reject(error)
  }
)
Vue.prototype.axios = _axios
// Plugin.install = function (Vue, options) {
//   Vue.axios = _axios
//   window.axios = _axios
//   Object.defineProperties(Vue.prototype, {
//     axios: {
//       get () {
//         return _axios
//       }
//     },
//     $axios: {
//       get () {
//         return _axios
//       }
//     }
//   })
// }

// Vue.use(Plugin)

// export default Plugin
