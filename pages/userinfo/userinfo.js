// pages/userinfo.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
            userData: data.userData
          })
        }
      }
    })
  },
})