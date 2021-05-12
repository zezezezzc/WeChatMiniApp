//index.js
const app = getApp();
const util = require('../../utils/util.js');
var sectionData = [];
var ifLoadMore = null;

Page({
  data: {
    campus: ["新疆大学本部", "新疆大学南校区", "新疆大学北校区"],
    campusIndex: 3,
    limit: 2,
    skip: 0,

    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    height: '',
    indicatorDots: true,
    autoplay: true,

    interval: 3000,
    duration: 1000,
    newGoods: [],
  },

  changeIndicatorDots(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  goToDetail: function () {
    wx.navigateTo({
      url: '../detail/detail',
      success: function (res) {
        console.log('跳转到detail页面成功')
      },
      fail: function () {
        console.log('跳转到detail页面成功')
      },
      complete: function () {
        console.log('跳转到页面完成')
      }
    })
  },

  onLoad: function () {
    var that = this;
    console.log("在 home 界面");
    // 获取，imgUrls
    that.newGoodsShow();
    // console.log(app.globalData.user.U_wechat_id);  //在更新之前为大写key
    // console.log(app.globalData.user.u_wechat_id);  //undefined
    wx.request({
      url: 'http://localhost:8080/app_cpagent/test/getWechatUser.json',
      data: {
        u_wechat_id: app.globalData.user.U_wechat_id,
      },
      method: 'GET',
      dataType: 'JSON',
      success(res) {
        // console.log("获取数据", res.data);
        var reuser = JSON.parse(res.data);    //获取用户json对象
        console.log(reuser);
        app.globalData.user = reuser.user;
        console.log("后端收到数据", reuser.user);
        console.log("user数据", app.globalData.user);
      }
    });
  },

  bindCampusChange: function (e) {
    this.setData({
      campusIndex: e.detail.value
    })
    let uaddr = this.data.campus[this.data.campusIndex];
    var u_last_time = util.formatTime(new Date());
    let tempName = encodeURI(app.globalData.userInfo.nickName); //对中文数据重新编码
    let tempAddr = encodeURI(uaddr); //对中文数据重新编码
    // console.log(tempAddr);
    wx.request({
      url: 'http://localhost:8080/app_cpagent/test/updateUser.json',
      data: {
        U_id: app.globalData.user.u_id,
        U_name: tempName,
        U_phone: app.globalData.user.u_phone,
        // U_gender: app.globalData.userInfo.gender,
        U_image: app.globalData.userInfo.avatarUrl,
        U_addr: tempAddr,
        U_last_time: u_last_time,
        U_wechat_id: app.globalData.user.u_wechat_id,
        U_state: 1,
      },
      // header默认为application/json,设置为下面的出错
      // header: {  
      //   'Content-Type': 'application/x-www-form-urlencoded'
      // },
      method: 'POST',
      dataType: 'JSON',
      success(res) {
        var rdata = JSON.parse(res.data)
        if (rdata.code == 0) {
          console.log("修改校区成功");
        }
        else {
          console.log("修改校区失败");
        }
      },
    });
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },

  // clearInput: function () {
  //   this.setData({
  //     inputVal: ""
  //   });
  //   var Post = Bmob.Object.extend("post");
  //   var query = new Bmob.Query(Post);
  //   query.equalTo("campus", this.data.campus[this.data.campusIndex]);
  //   query.descending('updatedAt');
  //   query.limit(this.data.limit);
  //   query.find({
  //     success: function (results) {
  //       that.setData({
  //         postList: results,
  //         skip: results.length
  //       })
  //     },
  //     error: function (error) {
  //       console.log("clearInput查询post失败: " + error.code + " " + error.message);
  //     }
  //   })
  // },

  bindSearch: function (e) {
    console.log(e.detail.value);
    this.setData({
      inputVal: e.detail.value
    });
    var that = this;
    wx.request({
      url: 'http://localhost:8080/app_cpagent/test/queryByPID.json',
      data: {
        P_id: that.data.inputVal,
      },
      method: 'GET',
      dataType: 'JSON',
      success(res) {
        var rdata = JSON.parse(res.data)
        if (rdata.code == 0) {
          console.log();
        }
        else {
          console.log("查找失败");
        }
      },
    });
  },

  onPullDownRefresh: function () { //触摸到底后应申请数据

  },

  newGoodsShow: function () {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/app_cpagent/test/randomGetprods.json',
      method: 'GET',
      dataType: 'JSON',
      success(res) {
        var mdata = JSON.parse(res.data)
        console.log(mdata)
        // console.log(mdata.Mypros[1])
        var newGoodsData = mdata.Mypros;
        console.log(newGoodsData);
        // page += 1;
        if (ifLoadMore) {
          //加载更多
          if (newGoodsData.length > 0) {
            console.log(newGoodsData)
            //日期以及title长度处理
            for (var i in newGoodsData) {
              //商品名称长度处理
              var name = newGoodsData[i].p_title;
              if (name.length > 26) {
                newGoodsData[i].p_title = name.substring(0, 23) + '...';
              }
            }
            sectionData['newGoods'] = sectionData['newGoods'].concat(newGoodsData);
          } else {
            ifLoadMore = false;
            this.setData({
              hidden: true
            })
            wx.showToast({
              title: '暂无更多内容！',
              icon: 'loading',
              duration: 2000
            })
          }
        } else {
          if (ifLoadMore == null) {
            ifLoadMore = true;
            //日期以及title长度处理
            for (var i in newGoodsData) {
              //商品名称长度处理
              var name = newGoodsData[i].p_title;
              if (name.length > 26) {
                newGoodsData[i].p_title = name.substring(0, 23) + '...';
              }
            }
            sectionData['newGoods'] = newGoodsData;//刷新
          }

        }
        that.setData({
          newGoods: sectionData['newGoods'],
        });
        wx.stopPullDownRefresh();//结束动画
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    console.log(e)
    console.log("上拉");
    var that = this;
    console.log('加载更多');
    if (ifLoadMore != null) {
      that.newGoodsShow();
    }
  },

  catchTapCategory: function (e) {
    // console.log(e);
    var goodsId = e.currentTarget.dataset.goodsid;
    console.log('goodsId:' + goodsId);
    // that.goodsClickShow(goodsId);  //新增商品用户点击数量
    //跳转商品详情
    wx.navigateTo({ url: '../detail/detail?goodsId=' + goodsId })//带参数跳转
  },

})