import { baseUrl } from '../../config'
Page({
  data: { id: 0, desc: '', images: [] },
  onLoad(query) {
    this.setData({ id: query.id });
  },
  chooseImage() {
    wx.chooseMedia({ count: 6, success: (res) => this.setData({ images: res.tempFiles.map(f => f.tempFilePath) }) });
  },
  onSubmit() {
    wx.request({
      url: `${baseUrl}/service-orders/${this.data.id}/complete`,
      method: 'PATCH',
      data: { description: this.data.desc, images: this.data.images },
    });
  },
});
