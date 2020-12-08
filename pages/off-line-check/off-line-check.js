let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    configInfo: {},
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [{
      //标记点 id
      id: 1,
      //标记点纬度
      latitude: 23.099994,
      //标记点经度
      longitude: 113.324520,
      name: '行之当前的位置'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let configInfo = app.globalData.configInfo
    let markers = [
      {
        id: 1,
        latitude: configInfo.lat,
        longitude: configInfo.lng,
        name: configInfo.address
      }
    ]
    this.setData({
      markers,
      latitude: configInfo.lat,
      longitude: configInfo.lng,
      configInfo
    })
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
  },

  // 富文本点击
  toPathPage () {
    let key = 'VFMBZ-DPU34-3PEUP-XLAGN-36LCE-GUBJG';  //使用在腾讯位置服务申请的key
    let referer = '松炉检测';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
      'name': this.data.configInfo.address,
      'latitude': this.data.configInfo.lat,
      'longitude': this.data.configInfo.lng
    });
    wx.navigateTo({
        url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    })
  },
})