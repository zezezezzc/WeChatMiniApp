// pages/my/mySetting/mySetting.js
const app = getApp();
const util = require('../../../utils/util.js');

Page({
  data: {
    // userWechat: '',
    userQQ: '',
    userPhone: '',
    userName: '',
    userGender: ["未知","男","女"],
    usergenderIndex: 2,
    // userUniversity: '',
    userCollege: '',
    // userEducation: '',
    // userEntryYear: '',
    buttonLoading: false,
    university: ["新疆大学"],
    universityIndex: 0,
    college: ["校本部", "南校区", "北校区", "新校区"],
    collegeIndex: 0,
    // education: ["本科生", "硕士研究生", "博士研究生"],
    // educationIndex: 0,
    // entryYear: ["2016", "2017", "2018", "2019", "2020"],
    // entryYearIndex: 3
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // console.log(app.globalData.user);
    this.setData({
      userUniversity: this.data.university[0],
      userCollege: this.data.college[0],
      // userEducation: this.data.education[0],
      // userEntryYear: this.data.entryYear[3],
      // userWechat: '',
      userQQ: app.globalData.user.u_qq,
      userPhone: app.globalData.user.u_phone,
      userName: app.globalData.user.u_name,
      usergenderIndex: app.globalData.user.u_gender,
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

  binduserGenderChange: function (e) {
    this.setData({
      usergenderIndex: e.detail.value,
    })
  },
  // bindEducationChange: function (e) {
  //   this.setData({
  //     educationIndex: e.detail.value,
  //     userEducation: this.data.education[this.data.educationIndex]
  //   })
  // },
  // bindEntryYearChange: function (e) {
  //   this.setData({
  //     entryYearIndex: e.detail.value,
  //     userEntryYear: this.data.entryYear[this.data.entryYearIndex]
  //   })
  // },
  // bindWechatInput: function (e) {
  //   this.setData({
  //     userWechat: e.detail.value
  //   })
  // },
  
  bindNickname: function(e) {
    this.setData({
      userName: e.detail.value
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
    var u_last_time = util.formatTime(new Date());
    let tempName = encodeURI(that.data.userName); //对中文数据重新编码
    let tempAddr = encodeURI(that.data.userCollege); //对中文数据重新编码
    // console.log(tempAddr);
    wx.request({
      url: 'http://localhost:8080/app_cpagent/test/updateUser.json',
      data: {
        U_qq: that.data.userQQ,
        U_phone: that.data.userPhone,
        U_addr: tempAddr,
        U_gender: that.data.usergenderIndex,
        U_name: tempName,
        U_last_time: u_last_time,
        U_id: app.globalData.user.u_id,
        U_image: app.globalData.userInfo.avatarUrl,
        U_wechat_id: app.globalData.user.u_wechat_id,
        U_state: 1,
      },      
      method: 'POST',   //改为POST，提交至服务器json根式正确
      dataType: 'JSON',
      success(res) {
        console.log(res);
        var redata = JSON.parse(res.data);
        console.log(redata.msg);
        that.setData({
          buttonLoading: false
        });
        if (redata.code == 0) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 3000
          })
        }        
      }
    });
  }
})