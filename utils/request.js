const domain = 'https://api.wx.shslsb.com';
export default function request(api = '') {
  let way = ['get', 'post', 'del', 'put']
  let obj = {}
  let prefix = domain + api
  way.map(val => {
    obj[val] = wrapMethod(val, prefix)
  })
  return obj
}

function wrapMethod(methodName, prefix) {
  return (url, data = {}, meta = {
    loading: true,
    tip: ''
  }) => {
    let fetchUrl = `${prefix}${url}`
    return new Promise((resolve, reject) => {
      methods(fetchUrl, data, methodName.toUpperCase(), resolve, reject, meta)
    })
  }
}

function methods(url, data, method, resolve, reject, meta) {
  if (meta.loading) wx.showLoading({
    title: meta.tip || '请稍候',
    mask: true
  })
  let header = {}
  // header['content-type'] = 'application/json'
  header['content-type'] = 'application/x-www-form-urlencoded'

  let token = wx.getStorageSync('token');
  if (token) {
    header['Token'] = `${token}`
  }
  return wx.request({
    url: url,
    header,
    data,
    method,
    success: (res) => {
      if (meta.loading) wx.hideLoading()

      if (res.data.code === 200) {
        resolve(res.data.data || res.data) // 成功直接抛出结果值
      } else {
        reject(res.data.data)
        if (!meta.hideError) {
          wx.showToast({
            title: res.data.errorMessage,
            icon: 'none',
            duration: 3000
          })
        }

      }
    },
    fail: (error) => {

      if (meta.loading) wx.hideLoading()
      reject('请求失败')
    }
  })
}