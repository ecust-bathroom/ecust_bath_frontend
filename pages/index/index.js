//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    hook: true,
    appointed: false,
    openid: NaN,
    userWxData: {
      headicon: NaN,
      telephone: NaN,
      nickname: NaN
    },
    userData: {
      userName: NaN,
      userid: NaN,
      dormid: NaN,
      appointment: {}
    },
    items: [{
      label: '请输入学号',
      name: 'userid',
    }],
    dormData: {
      bathroom: NaN,
      dormid: NaN,
      now: NaN,
      total: NaN
    },
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    //1.设置picker时间为当前时间
    var mytime = new Date();
    var time = [mytime.getHours(), mytime.getMinutes()];
    this.setData({
      bootTime: time
    });
    //2.获得用户的UnionID并核验
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: 'http://127.0.0.1:5000/api/wxlogin/',
            method: 'POST',
            data: {
              'js_code': res.code
            },
            method: 'POST',
            dataType: JSON,
            header: {
              'content-type': 'application/json'
            },
            success: (res2) => {
              var data = JSON.parse(res2.data);
              if (data.status == 'success') {
                this.setUserStatus(data.userid);
                this.setDormStatus(data.dormid);
              } else if (data.status == 'hook') {
                this.setData({
                  hook: false,
                  openid: data.openid
                })
              } else if (data.status == 'fail') {
                this.netError()
              }
            },
          });
        } else {
          console.log('登陆失败！' + res.errMsg)
        }
      }
    })
  },
  onPullDownRefresh: function () {
    wx.showToast({
      title: '刷新成功',
      icon: success
    })
    this.setUserStatus(this.data.userData['userid']);
    this.setDormStatus(this.data.userData['dormid']);

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
        dataType: JSON,
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          var data = JSON.parse(res.data)
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
      method: "POST",
      dataType: JSON,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        debugger
        var data = JSON.parse(res.data)
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
      method: "POST",
      datatype: JSON,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        var data = JSON.parse(res.data)
        if (data.status == 'success') {
          console.log('获取浴室信息成功！')
          this.setData({
            dormData: data.dormData
          })
        } else if (data.status == 'fail') {
          console.log('获取浴室信息失败！')
        }
      },
    })
  },
  appoint: function (bathid) {
    wx.request({
      url: 'http://127.0.0.1:5000/api/appoint/',
      data: {
        userid: userid,
        bathid: bathid,
        starttime: starttime,
        endtime: endtime
      },
      method: "POST",
      datatype: JSON,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        var data = JSON.parse(res.data)
        if (data.status == 'success') {
          this.setData({
            appointed: true,
            bathid: bathid,
            starttime: starttime,
            endtime: endtime
          });
          wx.showToast({
            title: '预约成功！',
            icon: 'success',
          })
          this.onPullDownRefresh()
        } else if (data.status == 'fail') {
          this.netError()
        }
      },
      fail() {
        wx.showToast({
          title: '网络可能存在问题，请重新尝试！',
          icon: 'fail',
        })
      },
    })
  },
  cancel: function () {
    wx.request({
      url: 'http://127.0.0.1:5000/api/cancel',
      data: {
        userid: this.data.userData.userid,
        bathid: this.data.userData.bathid
      },
      dataType: JSON,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        var data = JSON.parse(res.data)
        if (data.status == 'success') {
          this.setData({
            appointed: false,
            bathid: NaN,
            starttime: NaN,
            endtime: NaN
          });
          wx.showToast({
            title: '取消成功！',
            icon: 'success',
          })
        } else if (data.status == 'fail') {
          wx.showToast({
            title: '网络可能存在问题，请重新尝试！',
            icon: 'fail',
          })
        }
      },
      fail() {
        this.netError()
      }
    })
  },
  starttimeChange: function (e) {
    var d = this.data.userData;
    d.starttime = e.detail.value;
    this.setData({
      userData: d
    })
  },
  endtimeChange: function (e) {
    var d = this.data.userData;
    d.endtime = e.detail.value;
    this.setData({
      userData: d
    })
  },
  netError: function () {
    wx.showModal({
      title: '网络可能存在问题，请重新尝试！',
      cancelColor: 'green',
    })
  }
})