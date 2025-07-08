// const domain = 'https://api.wx.shslsb.com';
const domain = 'http://192.168.2.106:3000';
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
  console.log(111)
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
      console.log(`res`)
      console.log(res)
      if (meta.loading) wx.hideLoading()

      if (res.statusCode === 200) {
        resolve(res.data || res.data) // 成功直接抛出结果值
      } else {
        reject(res.data)

      }
    },
    fail: (error) => {

      if (meta.loading) wx.hideLoading()
      reject('请求失败')
    }
  })
}