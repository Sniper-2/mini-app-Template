// pages/on-line-check/on-line-check.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  // 跳转页面
  changePage(e) {
    wx.navigateTo({  
      url: '/pages/add-reservation-info/add-reservation-info?type=2' 
    })
  }
})