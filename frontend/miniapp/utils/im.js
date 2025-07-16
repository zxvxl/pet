import store from '../store'
import { baseUrl } from '@/config'

let socket

export function connect(orderId) {
  return new Promise((resolve, reject) => {
    socket = uni.connectSocket({
      url: `${baseUrl.replace(/^http/, 'ws')}/im?orderId=${orderId}`,
      header: { Authorization: `Bearer ${store.state.token}` },
      success: resolve,
      fail: reject
    })
  })
}

export function send(msg) {
  if (socket && socket.readyState === 1) {
    socket.send({ data: JSON.stringify(msg) })
  }
}

export function onMessage(cb) {
  if (socket) {
    socket.onMessage(event => cb(JSON.parse(event.data)))
  }
}
