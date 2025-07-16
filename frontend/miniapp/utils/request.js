// Base API URL comes from a shared configuration file so it can
// be adjusted per environment without changing source code
import { baseUrl } from '@/config'

export function request({ url, method = 'GET', data = {}, header = {} }) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: baseUrl + url,
      method,
      data,
      header,
      success: res => resolve(res.data),
      fail: reject
    })
  })
}
