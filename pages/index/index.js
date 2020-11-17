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
    //2.同步全局变量
    /*
    if (app.globalData.userid) {
      this.setUserStatus(app.globalData.userid)
    } else {
      app.useridReadyCallback = data => {
        this.setUserStatus(data.userid)
      }
    }*/
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
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
  hook: function () {
    wx.request({
      url: 'http://127.0.0.1:5000/api/hook/',
      data: {
        userid: this.data.userid,
        openid: app.globalData.openid
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        var data = res.data
        //var data = JSON.parse(res.data)
        if (data.status == 'success') {
          wx.showModal({
            cancelColor: 'cancelColor',
            content: '绑定成功'
          })
          this.setData({
            hook: true,
            userData:data.userData
          })
        }
      }
    })
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
  netError: function () {
    console.log('网络不通')
  }
})