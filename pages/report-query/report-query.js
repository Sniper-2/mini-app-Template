let app = getApp()
import dateMethods from '../../utils/date-methods'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectTabs: 0,
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getReservationDataList()
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

  // 修改tabs选中
  changeTabs (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      selectTabs: index
    })
    this.getReservationDataList('updata')
  },

  // 获取预约数据列表
  getReservationDataList (updata) {
    app.request().get(app.apiList.getReservationDataList, { state: this.data.selectTabs }).then((res) => {
      res = res || []
      res.map(val => {
        val.checkTime = dateMethods.format_date(val.checkTime, 'YY-MM-DD h:m')
      })

      if (updata) {
        this.setData({
          dataList: []
        })
      }
      this.setData({
        dataList: res
      })

    })
  },

  // pdf预览
  previewPDF (e) {
    let item = e.currentTarget.dataset.item
    wx.showLoading({
      title: '请稍候',
      mask: true
    })
    wx.downloadFile({
      url: item.pdf,
      success (res) {
        wx.hideLoading()
        wx.openDocument({
          filePath: res.tempFilePath,
          showMenu: true
        })
      },
      fail (err) {
        console.log(err)
      }
    })
  }
})