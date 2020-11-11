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
      appointed: null
    },
    dormdata: {},
    items: [{
      label: '请输入学号',
      name: 'userid',
    }],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
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
      this.setData({
        userData: app.globalData.userData
      })
      setTimeout(() => {
        this.setDormStatus(this.data.userData.dormid)
        setTimeout(() => {
          wx.hideLoading()
          this.setData({
            canShow: true
          })
        }, 1000)
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
      //this.setUserStatus(this.data.userData.userid);
      this.setDormStatus(this.data.userData.dormid);
      wx.showToast({
        title: '刷新成功',
      })
    }, 1000)
  },
  hook: function (e) {
    if (e.detail.confirm) {
      var userData = this.data.userData;
      userData['userid'] = e.detail.formData['userid']
      this.setData({
        userData: userData
      })
      wx.request({
        url: 'http://127.0.0.1:5000/api/hook/',
        data: {
          userid: e.detail.formData['userid'],
          openid: this.data['openid']
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
          }
        }
      })
    } else {
      wx.showModal({
        cancelColor: 'cancelColor',
        title: '提示',
        content: '如果不绑定，将无法体验快捷的服务。'
      })
    }
  },
  setUserStatus: function (userid) {
    wx.request({
      url: 'http://127.0.0.1:5000/api/getUserStatus/',
      data: {
        'userid': userid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        var data = res.data
        //var data = JSON.parse(res.data)
        if (data.status == 'success') {
          console.log('获取用户信息成功！')
          this.setData({
            userData: data.userData
          })
        } else if (data.status == 'fail') {
          console.log('获取用户信息失败！')
        }
      }
    })
  },
  setDormStatus: function (dormid) {
    wx.request({
      url: 'http://127.0.0.1:5000/api/getDormStatus/',
      data: {
        'dormid': dormid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        var data = res.data
        //var data = JSON.parse(res.data)
        if (data.status == 'success') {
          console.log('获取宿舍信息成功！')
          this.setData({
            dormData: data.dormData
          })
        } else if (data.status == 'fail') {
          console.log('获取宿舍信息失败！')
        }
      }
    })
  },
  appoint: function () {
    wx.showModal({
      title: '提示',
      content: '确认预约吗？',
      cancelColor: 'cancelColor',
      success: (res) => {
        if (!res.confirm) {
          return
        }
      }
    })
    wx.request({
      url: 'http://127.0.0.1:5000/api/appoint/',
      data: {
        userid: this.data.userData.userid,
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        var data = res.data
        //var data = JSON.parse(res.data)
        if (data.status == 'success') {
          this.setUserStatus()
          wx.showModal({
            cancelColor: 'cancelColor',
            title: '预约成功！',
          })
        } else if (data.status == 'fail') {
          this.netError()
        }
      },
      fail: this.netError
    })
  },
  cancel: function () {
    wx.request({
      url: 'http://127.0.0.1:5000/api/cancel',
      data: {
        userid: this.data.userData.userid,
      },
      dataType: JSON,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        var data = res.data
        //var data = JSON.parse(res.data)
        if (data.status == 'success') {
          this.setUserStatus()
          wx.showModal({
            title: '取消成功！',
            icon: 'success',
          })
        } else if (data.status == 'fail') {
          this.netError
        }
      },
      fail: this.netError
    })
  },
  /*
  starttimeChange: function (e) {
    var d = this.data.appointment;
    d.starttime = e.detail.value;
    this.setData({
      appointment: d
    })
  },
  endtimeChange: function (e) {
    var d = this.data.appointment;
    d.endtime = e.detail.value;
    this.setData({
      appointment: d
    })
  },*/
  netError: function () {
    wx.showModal({
      title: '网络可能存在问题，请重新尝试！',
      cancelColor: 'green',
    })
  }
})