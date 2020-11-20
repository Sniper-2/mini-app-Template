import request from './utils/request';
import apiList from './utils/api-config'
App({
  onLaunch: function () {
  },
  globalData: {
    userInfo: null
  },
  apiList,
  request
})