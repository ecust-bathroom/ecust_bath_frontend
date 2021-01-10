//index.js
//获取应用实例
let app = getApp()
Page({
  data: {
    bathData: {
      bathrooms: [{
        bathroomId: 1,
        status: [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
      }, {
        bathroomId: 2,
        status:[1,0,0,0,0,1,0,0,0,0]
      }, {
        bathroomId: 3,
        status: [1,0,1,1,1,0,1,1,0,0]
      }]
    },
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    //wx.showLoading({title: '加载中',})
    setTimeout(() => {
      //this.getBathStatus()
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
  netError: function () {
    console.log('网络不通')
  }
})