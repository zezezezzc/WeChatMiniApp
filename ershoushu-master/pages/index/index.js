//index.js
const app = getApp(); //获取应用实例

Page({
  data: {
    motto:'欢迎使用新大校园服务平台!',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //事件处理函数, 跳转页面
  bindViewTap: function() {
    var that = this;    
    wx.request({
      url: 'http://localhost:8080/app_cpagent/test/IsRegis.json',
      data: {
        u_wechat_id: app.globalData.user.U_wechat_id,
      },
      method: 'GET',
      dataType: 'JSON',
      success(res) {
        console.log("获取数据", res)
        var rdata = JSON.parse(res.data)   //要求返回结果转换为json数据
        if(rdata.code == 0){
          app.globalData.isRegis = true;  //已注册
          wx.switchTab({
            url: '../home/home',
            // success() {
            //   let page = getCurrentPages().pop();
            //   if (page == undefined || page == null) {
            //     return;
            //   }
            //   page.onLoad();
            // },
            fail: function (e) {
              // console.log(e) //可用于查看错误原因
              console.info("跳转失败")
            }
          });
        }
        else {
          wx.navigateTo({
            url: "../regis/regis"
          })
        }
      },
    });    
  },
  
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,     
      hasUserInfo: true
    })

  }
})
