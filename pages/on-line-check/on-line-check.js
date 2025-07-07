// pages/profile/profile.js
Page({
  data: {
    user: {
      avatar: '', // 可从接口获取头像
      nickname: '张三',
      level: '黄金会员',
    }
  },

  goToOrders(e) {
    const status = e.currentTarget.dataset.status;
    wx.showToast({
      title: `跳转订单页，状态：${status}`,
      icon: 'none',
    });
    // 实际中用 wx.navigateTo 跳转对应页面
    // wx.navigateTo({ url: `/pages/orders/orders?status=${status}` });
  },

  goToAddress() {
    wx.showToast({
      title: '跳转地址管理',
      icon: 'none',
    });
    // wx.navigateTo({ url: '/pages/address/address' });
  },

  contactSupport() {
    wx.showModal({
      title: '联系客服',
      content: '拨打电话 123-456-7890？',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({ phoneNumber: '1234567890' });
        }
      }
    });
  },

  goToSettings() {
    wx.showToast({
      title: '跳转设置',
      icon: 'none',
    });
    // wx.navigateTo({ url: '/pages/settings/settings' });
  },

  logout() {
    wx.showModal({
      title: '确认退出登录？',
      success(res) {
        if (res.confirm) {
          wx.showToast({ title: '已退出', icon: 'success' });
          // 清理登录状态，跳转登录页等逻辑
        }
      }
    });
  }
});
