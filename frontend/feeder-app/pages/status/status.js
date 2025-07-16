import { baseUrl } from '../../config'
Page({
  data: { status: 0 },
  onShow() {
    wx.request({ url: baseUrl + '/feeders/me', success: (res) => this.setData({ status: res.data.data.status }) });
  },
});
