Page({
  data: { orders: [] },
  onShow() {
    wx.request({ url: '/service-orders', success: (res) => this.setData({ orders: res.data.data }) });
  },
  accept(e) {
    const id = e.currentTarget.dataset.id;
    wx.request({ url: '/service-orders', method: 'POST', data: { feederId: this.data.feederId, orderId: id } });
  },
});
