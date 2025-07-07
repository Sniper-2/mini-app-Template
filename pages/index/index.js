
let app = getApp()
Page({
  data: {
    showCartPop: false,
    dishList: [
      { id: 1, name: "东北羊肉", price: 28.0, image: "/image/order-active.png", count: 0 },
      { id: 2, name: "香辣鸡翅", price: 22.5, image: "/image/order-active.png", count: 0 },
      { id: 3, name: "孜然牛肉", price: 32.0, image: "/image/order-active.png", count: 0 }
    ],
    classList: []
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

  // 获取数据列表


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
