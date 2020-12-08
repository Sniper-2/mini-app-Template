//index.js
//获取应用实例
const app = getApp()
let plugin = requirePlugin('routePlan');
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    sessionKey: '',
    configInfo: {},
  },
  //事件处理函数
  bindViewTap: function() {
  },
  onLoad: function () {
    this.getConfigInfo()
    wx.login({
      success: (res) => {
        this.userLogin(res.code)
      },
    })

    // /inspection/portal/wx/user/{appid}/login

    let userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo,
      hasUserInfo: !!userInfo
    })
  },

  // 用户登录
  userLogin (code) {
    app.request().get(app.apiList.userLogin, { code }, { loading: false }).then((res) => {
      wx.setStorageSync('token', res.token)
      wx.setStorageSync('sessionKey', res.sessionKey)
      wx.setStorageSync('openid', res.userPo.token)
      this.setData({
        sessionKey: res.sessionKey
      })
    })
  },

  // 用户授权
  getUserInfo: function(e) {
    let url = e.currentTarget.dataset.url
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.savaUserData(e, url)
  },

  // 用户授权之后保存用户信息
  savaUserData (e, url) {
    let params = {  
      sessionKey: this.data.sessionKey,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      rawData: e.detail.rawData,
      signature: e.detail.signature
    }
    app.request().get(app.apiList.saveUserData, params).then((res) => {
      // console.log(res)
      wx.navigateTo({  url })
    })
  },

  // 获取配置信息
  getConfigInfo () {
    app.request().get(app.apiList.getConfigInfo).then((res) => {
      // console.log(res)
      app.globalData.configInfo = res
      this.setData({
        configInfo: res
      })
      console.log(app.globalData.configInfo)
    })
  },

  // 跳转页面
  changePage(e) {
    if (!this.data.hasUserInfo) return
    let url = e.currentTarget.dataset.url
    wx.navigateTo({  url })
  },
  
  // 前往导航
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
  }
})
