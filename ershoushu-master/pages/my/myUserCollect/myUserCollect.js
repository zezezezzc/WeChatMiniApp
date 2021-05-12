// pages/my/myUserCollect/myUserCollect.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/app_cpagent/test/weuidFindCollectpid.json',
      data: {
        u_id: app.globalData.user.u_id,
      },
      method: 'GET',
      dataType: 'JSON',
      success(res) {
        console.log(res);
        var redata = JSON.parse(res.data);
        that.setData({
          collectList: redata.collectpid,
        });
      }
    });
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
  
  }
})