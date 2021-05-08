//app.js
App({
  /*
   ** 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    //onLaunch事件只是小程序刚好初始化完成之后的回调函数,这个时候app还没有创建完成,所以getApp()获取不到app实例
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs) //将data存储在本地缓存中指定的key中,会覆盖掉原来该key对应的内容，这是一个同步接口

    //登录凭证校验。通过 wx.login() 接口获得临时登录凭证 code 后传到开发者服务器调用此接口完成登录流程。
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log("res.code:" + res.code);
          // console.log(that)   直接使用 this 访问不到,为undefinded
          var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + that.globalData.appid + '&secret=' + that.globalData.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
          wx.request({
            url: l,
            data: {},
            header: {
              'content-type': 'json'
            },
            method: 'GET',
            success: function (res) {
              var obj = {};
              console.log("openid:" + res.data.openid);
              console.log("session_key:" + res.data.session_key);
              obj.U_wechat_id = res.data.openid;
              // obj.expires_in = Date.now() + res.data.expires_in;
              wx.setStorageSync('obj', obj);	//存储openid,至user关键字中,然后返回一个键（key）给小程序端，下次小程序请求我们后端的时候，带上这个key，我们就能找到这个val,就可以，这样就把登入做好了。
              that.globalData.user = obj
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {             
              // 可以将 res 发送给后台解码出 unionId
              // console.log(res.userInfo)
              this.globalData.userInfo = res.userInfo;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    // console.log("qiehuan")
    // //是否进行判断state进行进入
    // wx.navigateTo({
    //   url: "/pages/index/index"
    // })
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    console.log("退出");
    var that = this;
    wx.request({
      url: 'http://localhost:8080/app_cpagent/test/loginout.json',
      data: {        
        U_phone: that.globalData.user.u_phone,
        U_state: 0
      },
      method: 'POST',   //改为POST，提交至服务器json根式正确
      dataType: 'JSON',
      success(res) {
        console.log(res);       
      }
    });
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    console.log(msg);
  },
  globalData: {
    appid: 'wx2282f8789e2aeeb2',		//测试号
    secret: '471b3f81e436200de66db83e883b6d70',    
    isRegis: false,
    user: null,   //存储 openid
    userInfo: null,
  }
})
