
let app = getApp()

import {getUrlParams} from '../../utils/util'
let buyInfo = {}
Page({
  data: {
    totalPrice: '0.00',
    changeTableTip: false,
    tableCode: '',
    showCartPop: false,
    dishList: [
      { id: 1, name: "东北羊肉", price: 28.0, image: "/image/order-active.png", count: 0 },
      { id: 2, name: "香辣鸡翅", price: 22.5, image: "/image/order-active.png", count: 0 },
      { id: 3, name: "孜然牛肉", price: 32.0, image: "/image/order-active.png", count: 0 }
    ],
    classList: [],
    cartData: [],
    totalStock: 0
  },
  increase(e) {
    const index = e.currentTarget.dataset.index;
    const list = this.data.dishList;
    list[index].count++;
    this.setData({ dishList: list });
  },
  decrease(e) {
    const index = e.currentTarget.dataset.index;
    const list = this.data.dishList;
    if (list[index].count > 0) {
      list[index].count--;
      this.setData({ dishList: list });
    }
  },

  onLoad(options) {
    this.getClassDataList()
    if (options.tableCode) {
      this.setData({
        tableCode: options.tableCode
      })
    }
  },

  // 获取分类数据列表
  getClassDataList () {
    app.request().get('/api/categories/list').then(res => {
      const list = res;
      this.setData({
        classList: list.map((val, i) => {
          return {
            ...val,
            isSelect: i === 0
          }
        })
      })
      this.getDishesByCategory(list[0].id)
    })
  },

  // 通过分类获取菜品
  getDishesByCategory(classId) {
    app.request().get('/api/dishes/dishesList?page=1&pageSize=10&keyword=&category=' + classId).then(res => {
      const list = res.data;
      this.setData({
        dishList: list.map(item => {
          return {
            ...item,
            buyNumber: buyInfo[item.id] || 0
          }
        })
      })
    })
  },

  // 添加商品
  addDish (e) {
    console.log(e)
    const { item, index } = e.currentTarget.dataset;
    if (item.buyNumber > item.stock) {
      return wx.showToast({
        title: '超过库存数量',
        icon: 'none'
      })
    }
    item.buyNumber++
    this.setData({
      [`dishList[${index}]`]: item
    })
    buyInfo[item.id] = item.buyNumber
    // 判断cartData里面有没有这项数据，获取它的index
    const cartIndex = this.data.cartData.findIndex(val => val.id === item.id);
    const cartData = this.data.cartData;
    if (cartIndex === -1) {
      cartData.push(item)
    } else {
      cartData[cartIndex] = item
    }
    this.setData({
      cartData
    },() => {
      this.calculateTotalStock()
    })

  },

  // 计算总商品数量
  calculateTotalStock() {
    const total = this.data.cartData.reduce((sum, item) => sum + item.buyNumber, 0);
    this.setData({
      totalStock: total
    });
    this.calculateTotalPrice()
  },

  // 计算总金额数量
  calculateTotalPrice() {
    const total = this.data.cartData.reduce((sum, item) => sum + item.buyNumber * item.price, 0);
    this.setData({
      totalPrice: total.toFixed(2)
    });
  },

  // 购物车添加商品
  addProduct (e) { 
    const index = e.currentTarget.dataset.index;
    const item = e.currentTarget.dataset.item;
    buyInfo[item.id] = buyInfo[item.id] + 1
    const cartData = this.data.cartData;
    cartData[index].buyNumber = buyInfo[item.id]

    const dishList = this.data.dishList;
    dishList.map(v => {
      if (v.id === item.id) {
        v.buyNumber = buyInfo[item.id]
      }
    })
    this.setData({
      cartData,
      dishList
    }, () => {
      this.calculateTotalStock();
    });
  },

  // 购物车减少商品
  reduceProduct (e) { 
    const index = e.currentTarget.dataset.index;
    const item = e.currentTarget.dataset.item;
    buyInfo[item.id] = buyInfo[item.id] - 1
    const cartData = this.data.cartData;
    if (buyInfo[item.id] <= 0) {
      cartData.splice(index, 1);
    } else {
      cartData[index].buyNumber = buyInfo[item.id]
    }

    const dishList = this.data.dishList;
    dishList.map(v => {
      if (v.id === item.id) {
        v.buyNumber = buyInfo[item.id] || 0
      }
    })
    this.setData({
      cartData,
      dishList,
      showCartPop: cartData.length === 0 ? false : true
    }, () => {
      this.calculateTotalStock();
    });
  },

  // 清空购物车
  clearCart () { 
    buyInfo = {};

    this.setData({
      cartData: [],
      showCartPop: false,
      totalPrice: 0,
      totalNum: 0,
      dishList: this.data.dishList.map(val => {
        return {
          ...val,
          buyNumber: 0
        }
      })
    })
  },


  // 选中某个分类
  selectClass (e) {
    const { item, index } = e.currentTarget.dataset
    if (item.isSelect) return;
    item.isSelect = true
    const copyClassList = [];
    this.data.classList.map(val => {
      val.isSelect = false
      copyClassList.push({ ...val })
    })
    copyClassList[index].isSelect = true
    this.setData({
      classList: copyClassList
    });
    this.getDishesByCategory(item.id)
  },

  // 点击微信扫码
  scanQRcode() {
    wx.scanCode({
      success: (res) => {
        const { path } = res
        // 获取url里面的参数
        const params = getUrlParams(path)
        if (params.tableCode) {
          this.setData({
            tableCode: params.tableCode
          })
        } else {
          wx.showToast({
            title: '请扫描桌面上的二维码',
            icon: 'none'
          })
        }
        
        console.log(getUrlParams(path))
      }
    })
  },

  // 点击换桌
  userChangeTable () {
    this.setData({
      changeTableTip: true
    })
  },

  // 取消换桌
  cancelChangeTable () {
    this.setData({
      isChangeTable: false
    })
  },

  // 确认换桌
  confirmChangeTable () {
    this.setData({
      isChangeTable: false
    })
    this.scanQRcode()
  },

  hideCartPop () {
    this.setData({
      showCartPop: false
    })
  },

  showCartInfo () {
    if(this.data.cartData.length == 0) {
      return wx.showToast({
        title: '请先加购商品吧~',
        icon: 'none'
      })
    }
    this.setData({
      showCartPop: this.data.showCartPop ? false : true
    })
  }
});
