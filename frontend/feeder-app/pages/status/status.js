Page({
  data: { status: 0 },
  onShow() {
    wx.request({ url: '/feeders/me', success: (res) => this.setData({ status: res.data.data.status }) });
  },
});
