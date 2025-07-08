
let app = getApp()
const buyInfo = {}
Page({
  data: {
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

  onLoad() {
    this.getClassDataList()
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
    console.log(this.data.cartData)

  },

  calculateTotalStock() {
    const total = this.data.cartData.reduce((sum, item) => sum + item.buyNumber, 0);
    console.log(`total`)
    console.log(total)
    this.setData({
      totalStock: total
    });
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


  hideCartPop () {
    this.setData({
      showCartPop: false
    })
  },

  showCartInfo () {
    this.setData({
      showCartPop: true
    })
  }
});
