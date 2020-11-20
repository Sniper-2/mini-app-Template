const app = getApp()
import dateMethods from '../../utils/date-methods'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      address: '',
      checkTime: dateMethods.format_date(new Date(), 'YY-MM-DD h:m'),
      contact: '',
      name: '',
      num: '',
      tel: ''
    },
    type: false       // true在线预约 false离线预约
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type == 1
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  changeMinute(e){
    this.setData({ 'formData.checkTime': e.detail.value})
  },

  // 表单内容发生改变
  contentChange (e) {
    let key = e.target.dataset.key;
    this.setData({
      [`formData.${key}`]: e.detail.value
    })
  },

  // 提交预约信息
  submitReservationInfo ()  {
    let formData = this.data.formData;
    // 先验证数据的完整性
    let errorMap = {
      name: '请填写完整的公司名称!',
      address: '请填写完整的公司地址!',
      contact: '请填写联系人姓名!',
      num: '请填写校验数量!',
      tel: '请输入联系方式!'
    }

    for (const key in errorMap) {
      if (!formData[key] && errorMap[key]) {
        return wx.showToast({
          title: errorMap[key],
          icon: 'none',
          mask: false,
          duration: 2000
        })
      }
    }

    let params = { ...this.data.formData }
    params.checkTime += ':00'
    params.online = this.data.type

    app.request().post('/inspection/portal/reservation/submit', params).then((res) => {
      // console.log(res)
      wx.showToast({
        title: '提交成功!',
        icon: 'success',
        mask: false,
        duration: 2000
      })
      setTimeout(() => {
        wx.navigateTo({  url: '/pages/report-query/report-query' })
      }, 1500)
      
    })
  }
})