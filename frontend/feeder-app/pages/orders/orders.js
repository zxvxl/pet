import { baseUrl } from '../../config'
Page({
  data: { orders: [] },
  onShow() {
    wx.request({ url: baseUrl + '/service-orders', success: (res) => this.setData({ orders: res.data.data }) });
  },
  accept(e) {
    const id = e.currentTarget.dataset.id;
    wx.request({ url: baseUrl + '/service-orders', method: 'POST', data: { feederId: this.data.feederId, orderId: id } });
  },
});
