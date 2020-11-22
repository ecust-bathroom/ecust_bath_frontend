//index.js
//获取应用实例
let app = getApp()
Page({
  data: {
    hook: true,
    canShow: false,
    userData: {
      name: null,
      userid: null,
      dormid: null,
    },
    items: [{
      label: '请输入学号',
      name: 'userid',
    }],
    bathData: null,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      this.getBathStatus()
      this.setData({
        hook: app.globalData.hook,
        userData: app.globalData.userData
      })
      setTimeout(() => {
        wx.hideLoading()
        this.setData({
          canShow: true
        })
      }, 1000)
    }, 1000) //这里上面让优化的时候再优化
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onPullDownRefresh: function () {
    setTimeout(() => {
      this.getBathStatus()
      wx.showToast({
        title: '刷新成功',
      })
    }, 1000)
  },
  
  getBathStatus: function () {
    wx.request({
      url: 'http://127.0.0.1:5000/api/getBathStatus',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        var data = res.data
        this.setData({
          bathData: data.bathData
        })
      }
    })
  },
  useridInput: function (e) {
    this.setData({
      userid: e.detail.value
    })
  },
  tabChange:function(e){
    if(e.detail.index==1){
      wx.switchTab({
        url: '../../pages/userinfo/userinfo'
      })
    }
  },
  netError: function () {
    console.log('网络不通')
  }
})