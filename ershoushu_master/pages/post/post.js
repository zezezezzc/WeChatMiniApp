// post.js
var util = require('../../utils/util.js');
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    u_id: '',    
    postThing: true,  //导航栏的数据
    postJob: false,
    imgs: [],
    upload_picture_list: [],   //图片信息,数组图片保存作为数据源
    serverImage: [],

    //物品发布的数据
    thingImage: '',
    thingName: '',
    thingConditions: ["全新", "有使用痕迹"], //0为全新 //几乎全新", "九成新", "八成新", "七成新", "六成新", "五成新", "五成新以下
    thingConditionIndex: 1,
    thingPrice: '',
    thingDescribe: '',
    buttonLoadingThing: false,

    //兼职信息数据
    jobName: '',
    jobTime: '',
    jobPlace: '',
    jobRequir: '',
    jobSalary: '',
    jobWay: '',
    jobDescribe: '',
    buttonLoadingJob: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {    
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  //导航栏的响应事件
  choosePostThing: function(e) {
    var that = this;
    that.setData({
      imgs: [],
      upload_picture_list: [],
      postBook: false,
      postThing: true,
      postJob: false
    })
  },
  choosePostJob: function(e) {
    var that = this;
    that.setData({
      imgs: [],
      upload_picture_list: [],
      postBook: false,
      postThing: false,
      postJob: true
    })
  },

  //多图片上传
  chosepic: function (e) {
    var that = this;
    let upload_picture_list = that.data.upload_picture_list;
    wx.chooseImage({
      count: 6, //默认9张，这里设置6张
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {        
        if (upload_picture_list.length >= 6) {  //保证最多只有6张图片
          wx.showToast({
            title: '抱歉最多只允许上传六张图片哟~',
            icon: 'none',
            duration: 1500
          })
        }
        else {
          for (let i in res.tempFilePaths) {
            upload_picture_list.push(res.tempFilePaths[i]);
          }
        }
        //显示
        that.setData({
          upload_picture_list: upload_picture_list,
        });
      }
    })
  },  

  deleteImg(e) {
    let upload_picture_list = this.data.upload_picture_list;
    let index = e.currentTarget.dataset.index;
    upload_picture_list.splice(index, 1);
    this.setData({
      upload_picture_list: upload_picture_list,
    });
    console.log(this.data.upload_picture_list);
  },

  //预览图片
  previewImg(e) {
    //获取当前图片的下标
    let index = e.currentTarget.dataset.index;
    //所有图片
    let imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },

  bindThingNameInput: function (e) { //商品名字
    this.setData({
      thingName: e.detail.value
    })
  },
  bindThingConditionsInput: function (e) { //商品成色
    this.setData({
      thingConditionIndex: e.detail.value
    })
  },
  bindThingPriceInput: function (e) { //商品价格
    this.setData({
      thingPrice: e.detail.value
    })
  },
  bindThingDescribeInput: function (e) { //商品描述
    this.setData({
      thingDescribe: e.detail.value
    })
    // console.log(this.data.thingDescribe);
  },

  //发布物品的响应事件
  bindSubmitThing: function () {
    var that = this;
    //先将图片传至服务器,返回图片链接
    wx.showLoading({
      title: '上传中,请稍等...',
    })
    var count = 0;
    if (that.data.upload_picture_list.length == 0) {
      var u_id = app.globalData.user.u_id;
      var thingName = that.data.thingName; //名字
      var thingImage = [];
      var thingConditionIndex = that.data.thingConditionIndex; //成色索引值    
      var thingDescribe = that.data.thingDescribe || '无备注或描述'; //备注
      var thingPrice = that.data.thingPrice; //价格
      var p_time = util.formatTime(new Date());
      for (let j = 0; j < 6; j++) {
        if (that.data.serverImage[j] != '') {
          thingImage[j] = that.data.serverImage[j];
        }
        else {
          thingImage[j] = null;
        }
      }
      let temptitle = encodeURI(thingName); //对中文数据重新编码
      let tempDescribe = encodeURI(thingDescribe); //对中文数据重新编码
      wx.request({
        url: 'http://localhost:8080/app_cpagent/test/addProduct.json',
        data: {
          U_id: u_id,
          P_title: temptitle,
          P_isnew: thingConditionIndex,
          P_intro: tempDescribe,
          P_image_0: thingImage[0],
          P_image_1: thingImage[1],
          P_image_2: thingImage[2],
          P_image_3: thingImage[3],
          P_image_4: thingImage[4],
          P_image_5: thingImage[5],
          P_time: p_time,
          P_price: thingPrice,
        },
        method: "POST",
        dataType: 'JSON',
        success: function (res) {
          console.log(res);
          wx.hideLoading();
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 3000
          });
          that.setData({
            thingName: '',
            thingConditionIndex: 1,
            thingPrice: '',
            thingDescribe: '',
            imgs: [],
            upload_picture_list: []
          })
        },
        fail: function (res) {
          console.log(res);
          wx.showToast({
            title: '发布失败',
            icon: 'loading',
            duration: 2000
          })
          that.setData({
            buttonLoadingThing: false
          })
        },
      })
    }
    else {
      for (var i in that.data.upload_picture_list) {
        //多图片上传,遍历调用服务器图片上传接口即可实现多图保存
        let imgUrl = that.data.upload_picture_list[i];
        wx.uploadFile({
          //上传图片的网路请求地址
          url: 'http://localhost:8080/app_cpagent/test/uploadPic.json',
          filePath: imgUrl,
          name: 'file',   //对应后端参数
          success: function (res) {
            var Result = JSON.parse(res.data);
            console.log(Result);
            if (Result.code == 200) {
              that.data.serverImage.push(Result.fileNames);  //再更新给数据库链接
              ++count;
              // console.log(count);
              if (count == that.data.upload_picture_list.length) {
                //直接使用i的值会因为请求网络连接导致不可预测
                //已经获取服务器返回链接,解决异步返回数据还未获取问题
                var u_id = app.globalData.user.u_id;
                var thingName = that.data.thingName; //名字
                var thingImage = [];
                var thingConditionIndex = that.data.thingConditionIndex; //成色索引值    
                var thingDescribe = that.data.thingDescribe || '无备注或描述'; //备注
                var thingPrice = that.data.thingPrice; //价格
                var p_time = util.formatTime(new Date());
                for (let j = 0; j < 6; j++) {
                  if (that.data.serverImage[j] != '') {
                    thingImage[j] = that.data.serverImage[j];
                  }
                  else {
                    thingImage[j] = null;
                  }
                }
                let temptitle = encodeURI(thingName); //对中文数据重新编码
                let tempDescribe = encodeURI(thingDescribe); //对中文数据重新编码
                wx.request({
                  url: 'http://localhost:8080/app_cpagent/test/addProduct.json',
                  data: {
                    U_id: u_id,
                    P_title: temptitle,
                    P_isnew: thingConditionIndex,
                    P_intro: tempDescribe,
                    P_image_0: thingImage[0],
                    P_image_1: thingImage[1],
                    P_image_2: thingImage[2],
                    P_image_3: thingImage[3],
                    P_image_4: thingImage[4],
                    P_image_5: thingImage[5],
                    P_time: p_time,
                    P_price: thingPrice,
                  },
                  method: "POST",
                  dataType: 'JSON',
                  success: function (res) {
                    console.log(res);
                    wx.hideLoading();
                    wx.showToast({
                      title: '发布成功',
                      icon: 'success',
                      duration: 3000
                    });
                    that.setData({
                      thingName: '',
                      thingConditionIndex: 1,
                      thingPrice: '',
                      thingDescribe: '',
                      imgs: [],
                      upload_picture_list: []
                    })
                  },
                  fail: function (res) {
                    console.log(res);
                    wx.showToast({
                      title: '发布失败',
                      icon: 'loading',
                      duration: 2000
                    })
                    that.setData({
                      buttonLoadingThing: false
                    })
                  },
                })
              }
            }
            else {
              console.log("图片上传服务器失败");
            }
          },
          fail: function (res) {
            console.log("访问服务器失败");
          },
        });
      }
    }    
  },

  
  //响应事件
  bindJobNameInput: function(e) { //兼职名称
    this.setData({
      jobName: e.detail.value
    })
  },
  bindJobTimeInput: function(e) { //兼职时间
    this.setData({
      jobTime: e.detail.value
    })
  },
  bindJobPlaceInput: function(e) { //兼职地点
    this.setData({
      jobPlace: e.detail.value
    })
  },
  bindJobRequirInput: function(e) { //兼职要求
    this.setData({
      jobRequir: e.detail.value
    })
  },
  bindjobSalaryInput: function(e) { //兼职工资
    this.setData({
      jobSalary: e.detail.value
    })
    console.log(e.detail.value)
  },
  bindJobWayInput: function(e) { //兼职联系方式
    this.setData({
      jobWay: e.detail.value
    })
  },
  bindjobDescribeInput: function(e) { //兼职描述
    this.setData({
      jobDescribe: e.detail.value
    })
  }, 
  
  //发布兼职的响应事件
  bindSubmitJob: function() {
    var that = this;
    //先将图片传至服务器,返回图片链接
    wx.showLoading({
      title: '上传中,请稍等...',
    })
    var count = 0;
    if (that.data.upload_picture_list.length == 0){
      var jobName = that.data.jobName; //工作名称      
      var thingDescribe = "兼职联系方式:" + that.data.jobWay + "兼职薪资:" +that.data.jobSalary + "兼职地点:" +that.data.jobPlace +
		  "兼职时间:" +that.data.jobTime + "兼职要求:" +that.data.jobRequir+ "兼职描述:" +that.data.jobDescribe;
      var u_id = app.globalData.user.u_id;
      var p_time = util.formatTime(new Date());
      let tempjobName = encodeURI(jobName); //对中文数据重新编码
      let tempDescribe = encodeURI(thingDescribe); //对中文数据重新编码
      wx.request({
        url: 'http://localhost:8080/app_cpagent/test/addProduct.json',
        data: {
          U_id: u_id,
          P_title: tempjobName,
          P_intro: tempDescribe,
          P_image_0: thingImage[0],
          P_image_1: thingImage[1],
          P_image_2: thingImage[2],
          P_image_3: thingImage[3],
          P_image_4: thingImage[4],
          P_image_5: thingImage[5],
          P_time: p_time,
        },
        method: "POST",
        dataType: 'JSON',
        success: function (res) {
          console.log(res);
          wx.hideLoading();
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 3000
          });
          that.setData({
            jobName: '',
            jobTime: '',
            jobPlace: '',
            jobRequir: '',
            jobSalary: '',
            jobWay: '',
            jobDescribe: '',
            imgs: ''
          })
        },
        fail: function (res) {
          console.log(res);
          wx.showToast({
            title: '发布失败',
            icon: 'loading',
            duration: 2000
          })
          that.setData({
            buttonLoadingThing: false
          })
        },
      })
    }
    else {
      for (var i in that.data.upload_picture_list) {
        //多图片上传,遍历调用服务器图片上传接口即可实现多图保存
        let imgUrl = that.data.upload_picture_list[i];
        wx.uploadFile({
          //上传图片的网路请求地址
          url: 'http://localhost:8080/app_cpagent/test/uploadPic.json',
          filePath: imgUrl,
          name: 'file',   //对应后端参数
          success: function (res) {
            var Result = JSON.parse(res.data);
            console.log(Result);
            if (Result.code == 200) {
              that.data.serverImage.push(Result.fileNames);  //再更新给数据库链接
              ++count;
              // console.log(count);
              if (count == that.data.upload_picture_list.length) {
                //直接使用i的值会因为请求网络连接导致不可预测
                //已经获取服务器返回链接,解决异步返回数据还未获取问题
                var thingImage = [];
                for (let j = 0; j < 6; j++) {
                  if (that.data.serverImage[j] != '') {
                    thingImage[j] = that.data.serverImage[j];
                  }
                  else {
                    thingImage[j] = null;
                  }
                }
                var jobName = that.data.jobName; //工作名称
                // var jobDescribe = ; //职位描述
                // var jobWay = ; //联系电话              
                // var jobSalary = ; //资薪福利
                // var jobPlace = ; //工作地点
                // var jobTime = ; //工作时间
                // var jobRequir = ; //人员要求
                var thingDescribe = that.data.jobDescribe + that.data.jobWay + that.data.jobSalary + that.data.jobPlace + that.data.jobTime + that.data.jobRequir;
                var u_id = app.globalData.user.u_id;
                var p_time = util.formatTime(new Date());

                let tempjobName = encodeURI(jobName); //对中文数据重新编码
                let tempDescribe = encodeURI(thingDescribe); //对中文数据重新编码
                wx.request({
                  url: 'http://localhost:8080/app_cpagent/test/addProduct.json',
                  data: {
                    U_id: u_id,
                    P_title: tempjobName,
                    P_intro: tempDescribe,
                    P_image_0: thingImage[0],
                    P_image_1: thingImage[1],
                    P_image_2: thingImage[2],
                    P_image_3: thingImage[3],
                    P_image_4: thingImage[4],
                    P_image_5: thingImage[5],
                    P_time: p_time,
                  },
                  method: "POST",
                  dataType: 'JSON',
                  success: function (res) {
                    console.log(res);
                    wx.hideLoading();
                    wx.showToast({
                      title: '发布成功',
                      icon: 'success',
                      duration: 3000
                    });
                    that.setData({
                      jobName: '',
                      jobTime: '',
                      jobPlace: '',
                      jobRequir: '',
                      jobSalary: '',
                      jobWay: '',
                      jobDescribe: '',
                      imgs: ''
                    })
                  },
                  fail: function (res) {
                    console.log(res);
                    wx.showToast({
                      title: '发布失败',
                      icon: 'loading',
                      duration: 2000
                    })
                    that.setData({
                      buttonLoadingThing: false
                    })
                  },
                })
              }
            }
            else {
              console.log("图片上传服务器失败");
            }
          },
          fail: function (res) {
            console.log("访问服务器失败");
          },
        });
      }
    }    
  }
})
