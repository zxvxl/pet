Page({
  data: {},
  onLoad() {},
  onLogin() {
    wx.login({
      success: () => {
        // call backend auth/login
      },
    });
  },
});
