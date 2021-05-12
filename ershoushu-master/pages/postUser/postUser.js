// pages/postUser/postUser.js
const util = require('../../utils/util.js');

Page({
  data: {
    user: [],
    // userWechat: '',
    userQQ: '',
    userPhone: '',
    // userUniversity: '',
    // userCollege: '',
    // userEducation: '',
    // userEntryYear: '',
    buttonLoading: false,
    university: ["新疆大学"],
    universityIndex: 0,
    // college: ["公共管理学院", "外国语学院", "新闻学院", "法学院", "软件工程学院", "数学与统计学院", "机械工程学院", "电气工程学院", "自动化学院", "信息科学与工程学院", "化学化工学院", "资源及环境科学学院", "生命科学学院", "物理学院"],
    // collegeIndex: 0,
    // education: ["本科生", "硕士研究生", "博士研究生"],
    // educationIndex: 0,
    // entryYear: ["2016", "2017", "2018", "2019", "2020"],
    // entryYearIndex: 3
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/app_cpagent/test/getuserInfoByproducts.json',
      data: {
        P_id: options.goodsID,
      },
      method: 'POST',   //改为POST，提交至服务器json根式正确
      dataType: 'JSON',
      success(res) {        
        var redata = JSON.parse(res.data);
        console.log(redata.msg);
        console.log(redata);
        that.setData ({
          user: redata.user
        })
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

  bindUniversityChange: function (e) {
    this.setData({
      universityIndex: e.detail.value,
      userUniversity: this.data.university[this.data.universityIndex]
    })
  },

  bindCollegeChange: function (e) {
    this.setData({
      collegeIndex: e.detail.value,
      userCollege: this.data.college[this.data.collegeIndex]
    })
  },
  bindEducationChange: function (e) {
    this.setData({
      educationIndex: e.detail.value,
      userEducation: this.data.education[this.data.educationIndex]
    })
  },
  bindEntryYearChange: function (e) {
    this.setData({
      entryYearIndex: e.detail.value,
      userEntryYear: this.data.entryYear[this.data.entryYearIndex]
    })
  },
  bindWechatInput: function (e) {
    this.setData({
      userWechat: e.detail.value
    })
  },
  bindQQInput: function (e) {
    this.setData({
      userQQ: e.detail.value
    })
  },
  bindPhoneInput: function (e) {
    this.setData({
      userPhone: e.detail.value
    })
  },
  bindSubmit: function () {
    var that = this;
    this.setData({
      buttonLoading: true
    })
    var User = Bmob.Object.extend("_User");
    var query = new Bmob.Query(User);
    query.get(Bmob.User.current().id, {
      success: function (result) {
        console.log('点击按钮', result)
        result.set("wechatId", that.data.userWechat);
        result.set("QQ", that.data.userQQ);
        result.set("mobilePhoneNumber", that.data.userPhone);
        result.set("university", that.data.userUniversity);
        result.set("college", that.data.userCollege);
        result.set("education", that.data.userEducation);
        result.set("entryYear", that.data.userEntryYear);
        result.save();
        that.setData({
          buttonLoading: false
        });
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 3000
        })
      },
      error: function (object, error) {
        console.log('失败', object, error)
      }
    })
  }
})