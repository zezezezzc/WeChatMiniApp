// pages/my/myPost/myPost.js
const app = getApp();
var util = require('../../../utils/util.js');

Page({
  data: {
    skip: 0,
    pros_New: ["全新", "有部分使用痕迹"],
    postList: [],
  },

  onLoad: function () {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/app_cpagent/test/weuidFindMypid.json',
      data: {
        u_id: app.globalData.user.u_id,
      },
      method: 'GET',
      dataType: 'JSON',
      success(res) {
        var myPost = JSON.parse(res.data)
        console.log("发布返回结果：", myPost)
        if (myPost.code == 0){
          that.setData({
            postList: myPost.Mypros,
          });
        }
        else {
          that.setData({
            postList: [],
          });
        }
      },
      fail: function(res) {
        console.log(res);
      }
    });
  },

  onShow:function(){
    
  },

  myLoad: function () {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/app_cpagent/test/weuidFindMypid.json',
      data: {
        u_id: app.globalData.user.u_id,
      },
      method: 'GET',
      dataType: 'JSON',
      success(res) {
        var myPost = JSON.parse(res.data)
        console.log("发布返回结果：", myPost)
        that.setData({
          postList: myPost.Mypros,
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  onPullDownRefresh: function () {
    this.onShow();
  },

  onReachBottom: function () {
    //   success: function (results) {
    //     if (results.length > 0) {
    //       var nl = that.data.postList.concat(results);
    //       that.setData({
    //         skip: that.data.skip + results.length,
    //         postList: nl
    //       })
    //     }
    //     else {
    //       wx.showToast({
    //         title: '已全部加载',
    //         icon: 'success',
    //         duration: 3000
    //       })
    //     }
    //   },
    //   error: function (error) {
    //     console.log("onReachBottom查询post失败: " + error.code + " " + error.message);
    //   }
    // })
  },

  deletePost: function (event) {
    var objectId = event.target.dataset.id;
    console.log(objectId);
    var that = this;  //必须要放在 api请求成功回调函数前
    wx.showModal({
      title: '操作提示',
      content: '确定要删除该发布？',
      success: function (res) {
        if (res.confirm) {          
          console.log(that);
          wx.request({
            url: 'http://localhost:8080/app_cpagent/test/DeleteProds.json',
            data: {
              p_id: objectId
            },
            method: 'GET',
            dataType: 'JSON',
            success(res) {
              console.log("获取数据", res)
              var rdata = JSON.parse(res.data)   //要求返回结果转换为json数据
              if (rdata.status == 1) {                
                console.log("下架成功");
                //更新数据
                that.onLoad();
              }
              else {
                console.log("下架出错", res);
              }
              that.setData({
                // postList: myPost.Mypros
              })
            },
          });

        }
      }
    })
  },
 
})
