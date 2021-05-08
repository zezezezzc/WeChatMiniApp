//my.js
const app = getApp();

Page({
  /**
   * 页面的初始数据W
   */
  data: {
    userInfo: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  // console.log(options) //直接点击底部bar 进入页面时options为空结构体
    console.log(app.globalData.user);
    var that = this;
    that.setData({
      userInfo: app.globalData.user,
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
})