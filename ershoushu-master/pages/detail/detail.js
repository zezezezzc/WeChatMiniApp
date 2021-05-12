const utils = require('../../utils/util.js');
const app = getApp();
var imgUrls = [];
var detailImg = [];
var goodsId = null;
var goods = null;

Page({
  data: {
    postTime:[],
    isLike: false,    
    pros_New: ["全新", "有部分使用痕迹"],
    goodsIntro: null,
    showDialog: false,
    goods: null,
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    goodsId = options.goodsId;
    console.log('goodsId:', goodsId);
    //加载商品详情
    that.goodsInfoShow();
  },

  goodsInfoShow: function () {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/app_cpagent/test/getProductinfo.json',
      data:{
        P_id: goodsId,
      },
      method: 'GET',
      dataType: 'JSON',
      success(res) {
        var goodsItem = JSON.parse(res.data);
        console.log("shijian: ", goodsItem.pro.p_time);  //有用户id信息
        imgUrls[0] = goodsItem.pro.p_image_0;
        imgUrls[1] = goodsItem.pro.p_image_1;
        imgUrls[2] = goodsItem.pro.p_image_2;        
        detailImg[0] = goodsItem.pro.p_image_3;
        detailImg[1] = goodsItem.pro.p_image_4;
        detailImg[2] = goodsItem.pro.p_image_5;
        var time = [];
        if (goodsItem.pro.p_time != null) {
          time.push(goodsItem.pro.p_time.year + 1900);
          time.push(goodsItem.pro.p_time.month + 1);
          time.push(goodsItem.pro.p_time.date);
          time.push(goodsItem.pro.p_time.hours);
          time.push(goodsItem.pro.p_time.seconds);
        }
        goods = {
          imgUrls: imgUrls,
          detailImg: detailImg,
          title: goodsItem.pro.p_title,
          price: goodsItem.pro.p_price,
          isNew: goodsItem.pro.p_isnew,
          postTime: time,
          // privilegePrice: goodsItem.privilegePrice,  //原价，未使用          
          // imgUrl: goodsItem.pro.imgUrl,
          goodsId: goodsId,
          goods_UId: goodsItem.pro.u_id,
          goodsintro: goodsItem.pro.p_intro,
          count: 1,
        }

        that.setData({
          postTime: goods.postTime,
          goodsIntro: goods.goodsintro,
          goods: goods,
        })        
      }
    })
  },

  //预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgUrls // 需要预览的图片http链接列表
    })
  },

  imaddpoint() {   //添加收藏
    this.setData({
      isLike: !this.data.isLike,
    });
    console.log(app.globalData.user.u_id);
    console.log(goods.goodsId);
    wx.request({
      url: 'http://localhost:8080/app_cpagent/test/collect.json',
      data: {
        U_id: app.globalData.user.u_id,
        P_id: goods.goodsId,
      },
      method: 'POST',   //改为POST，提交至服务器json根式正确
      dataType: 'JSON',
      success(res) {
        console.log(res);
        var redata = JSON.parse(res.data);
        wx.showToast({
          title: redata.msg,
          icon: 'success',
          duration: 2000
        });
      }
    });
  },

  topostUser: function (e) {
    console.log('goodsId:' + goodsId);
    //跳转用户界面
    wx.navigateTo({ url: '../postUser/postUser?goodsID=' + goodsId })//带参数跳转
  },

  gotomysc: function () {
    wx.navigateTo({
      url: '../../pages/mysc/mysc',
    })
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
    
  },
 
})