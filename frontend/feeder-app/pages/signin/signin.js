Page({
  data: { id: 0 },
  onLoad(query) {
    this.setData({ id: query.id });
  },
  onSign() {
    wx.getLocation({
      success: (res) => {
        wx.request({
          url: `/service-orders/${this.data.id}/sign-in`,
          method: 'PATCH',
          data: { lat: res.latitude, lng: res.longitude },
        });
      },
    });
  },
});
