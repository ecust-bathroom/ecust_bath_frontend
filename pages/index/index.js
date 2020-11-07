//index.js
//获取应用实例
const app = getApp()
var util=require('../../utils/util.js')
Page({
  data: {
    login: false,
    appointed: false,
    userData: {
      userName:NaN,
      userid: NaN,
      bathid: NaN,
      dormid: NaN,
      starttime: NaN,
      endtime: NaN,
    },
    dormData: {},
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
      //1.设置picker时间为当前时间
      var mytime=new Date();
      var time=[mytime.getHours(),mytime.getMinutes()];
      this.setData({
        userData:{
          starttime:time,
          endtime:time
        }
      })
  },
  onPullDownRefresh: function () {
    wx.showToast({
      title: '刷新成功',
      icon: success
    })
    this.getDormStatus();
  },
  login: function (userid, password) {
    wx.request({
      url: '/api/login',
      data: {
        'userid': userid,
        'password': password
      },
      method: 'POST',
      dataType: JSON,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.data['status'] == 'success') {
          getUserData();
        } else if (res.data['status'] == 'fail') {
          console.log('失败！')
          netError()
        }
      },
      fail() {
        netError()
      }

    });
    if (this.dormData == {}) {
      this.getDormStatus();
    }

  },
  getUserStatus: function (userid) {
    wx.request({
      url: '/api/getUserStatus',
      data: {
        'userid': userid
      },
      method: "POST",
      dataType: JSON,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.data['status'] == 'success') {
          console.log('获取用户信息成功！')
          this.setData({
            userData: res.data['data']
          })
        } else if (res.data['status'] == 'fail') {
          console.log('获取用户信息失败！')
        }
      },
      fail() {
        console.log('获取用户信息失败！')
      }
    })
  },
  getDormStatus: function () {
    wx.request({
      url: '/api/getDormStatus',
      data: {
        'dormid': userData['dormid']
      },
      method: "POST",
      datatype: JSON,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.data['status'] == 'success') {
          console.log('获取浴室信息成功！')
          this.setData({
            dormData: res.data['data']
          })
        } else if (res.data['status'] == 'fail') {
          console.log('获取浴室信息失败！')
        }
      },
      fail() {
        console.log('获取浴室信息失败！')
      }
    })
  },
  appoint: function (bathid) {
    wx.request({
      url: '/api/appoint/',
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
      success(res) {
        if (res.data['status'] == 'success') {
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
        } else if (res.data['status'] == 'fail') {
          netError()
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
  cancel: function (bathid, userid) {
    wx.request({
      url: '/api/cancel',
      data: {
        userid: userid,
        bathid: bathid
      },
      dataType: JSON,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.data['status'] == 'success') {
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
        } else if (res.data['status'] == 'fail') {
          wx.showToast({
            title: '网络可能存在问题，请重新尝试！',
            icon: 'fail',
          })
        }
      },
      fail() {
        netError()
      }
    })
  },
  starttimeChange:function(e){
    var d = this.data.userData;
    d.starttime=e.detail.value;
    this.setData({
      userData:d
    })
  },
  endtimeChange:function(e){
    var d = this.data.userData;
    d.endtime=e.detail.value;
    this.setData({
      userData:d
    })
  }, 
  checkTimeValid:function(){
    var start=this.data.userData.starttime.slice(0,1)+this.data.userData.starttime.slice(3,4)
  },
  showTime:function(){
    return
  },
  netError: function () {
    wx.showToast({
      title: '网络可能存在问题，请重新尝试！',
      icon: 'fail',
    })
  },
  test: function () {
    this.setData({
      login: true,
      appointed: true,
      userData: {
        userName:'张小龙',
        userid: 19000001,
        appointment:{
          status:true,
          bathid: 236,
        dormid: 23,
        starttime: [17,30],
        endtime: [18,30]
        }
        
      },
      dormData: {
        dormId: 23,
        now: 5,
        total: 10,
        bathroom: [{
          bathid: 231,
          status:'using'
        }, {
          bathid: 232,
          status:'empty'
        }, {
          bathid: 233,
          status:'using'
        }, {
          bathid: 236,
          status:'appointed'
        }]
      }
    })
  },
  appoint_emu: function () {
    if (this.data.appointed) {
      this.setData({
        appointed: false
      });
    } else {
      this.setData({
        appointed: true
      });
    }
  }
})