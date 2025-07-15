import { request } from './request'
import store from '../store'

export function login() {
  return new Promise((resolve, reject) => {
    uni.login({
      success(res) {
        request({
          url: '/auth/login',
          method: 'POST',
          data: { code: res.code }
        })
          .then(data => {
            store.commit('setToken', data.access_token)
            resolve(data)
          })
          .catch(reject)
      },
      fail: reject
    })
  })
}
