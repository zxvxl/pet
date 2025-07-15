const baseUrl = 'http://localhost:3000'

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
