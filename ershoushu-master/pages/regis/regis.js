// pages/regis/regis.js
const app = getApp();
var util = require('../../utils/util.js');  //获取时间

Page({
  /**
   * 页面的初始数据
   */
  data: {
    u_phone: '',
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getUserphoneid: function (e) {
      console.log(e)
      this.data.u_phone = e.detail.value;
      // console.log(this.data.u_phone)
    },
    loginClick: function() {
      var u_reg_time = util.formatTime(new Date());// 调用函数时，传入new Date()参数，返回值是日期和时间
      // console.log(u_reg_time+"reg");  //注册时间
      var that = this;
      wx.request({
        url: 'http://localhost:8080/app_cpagent/test/addUser.json',
        data: {
          u_phone: that.data.u_phone,
          u_reg_time: u_reg_time,
        },
        method: 'GET',  //后端设置获取参数为非json
        dataType: 'JSON',
        success(res) {
          console.log("获取数据", res)
          var rdata = JSON.parse(res.data)   //要求返回结果转换为json数据
          if (rdata.code == 1) {
            app.globalData.isRegis = true;
            console.log("reg ok");

            let userphone = that.data.u_phone;
            let tempName = encodeURI(app.globalData.userInfo.nickName); //对中文数据重新编码
            wx.request({  //注册后即更新数据
              url: 'http://localhost:8080/app_cpagent/test/updateUser.json',
              data: {
                U_name: tempName,
                U_phone: userphone,
                U_gender: app.globalData.userInfo.gender,
                U_sign: null,
                U_image: app.globalData.userInfo.avatarUrl,
                U_addr: null,
                U_grade: null,
                U_qq: null,
                U_wechat_id: app.globalData.user.U_wechat_id,
                U_state: 1,
              },
              method: 'POST',
              dataType: 'JSON',
              success(res) {
                console.log("获取数据", res)
                var rdata = JSON.parse(res.data)
                if (rdata.code == 0) {                 
                  console.log("Login ok");
                  wx.switchTab({
                    url: "../home/home"
                  })
                }
                else if (rdata.code == -1 || rdata.code == 1) {
                  console.log("Login Wrong");
                }
              }
            });
          }
          else if (rdata.code == -1) {
            console.log("注册出错");
          }
        },
      });
    },

  }
})
