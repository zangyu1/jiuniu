//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    scrollTop: 0,// 页面距离顶部距离
    // 用户的可操作列表
    lists: [{img: "/img/user/zixun.png",name: "我的咨询"},
    {img: "/img/user/pingjia.png",name: "我的评价"},
    {img: "/img/user/guanzhu.png",name: "我的关注"},
    {img: "/img/user/zuji.png",name: "我的足迹"},
    {img: "/img/user/tousu.png",name: "投诉与建议"},],
    zixunList: [],// 待咨询列表
    userInfo: null,// 用户信息
  },
  onPageScroll: function(e) {
    this.setData({scrollTop: e.scrollTop});
  },

  bindGetUserInfo: function(e){
    var url = "/api/v1/user/auth";
    var params = {
      jsCode: app.globalData.code,
      headUrl: e.detail.userInfo.avatarUrl,
      nickName: e.detail.userInfo.nickName,
    };
    app.globalData.config(url,params).then(res=>{
      this.setData({userInfo: res.data});
      app.globalData.userInfo = res.data;
      app.globalData.token = res.data.token;
      app.globalData.openId = res.data.openId;
    }).catch(err=>{
      wx.showToast({title: err.msg,icon: 'none'})
    });
  },

  // 获取用户手机
  getPhoneNumber: function(e){
    var that = this;
    wx.login({
      success: res => {
        app.globalData.code = res.code;
        var url = '/api/v1/user/setTelNo';
        var params = {
          jsCode: app.globalData.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        }
        app.globalData.userFun(url,params).then(res1=>{
          app.globalData.userFun('/api/v1/user/getUser',{token: app.globalData.token},1).then(res2=>{
            app.globalData.userInfo = res.data;
            that.setData({userInfo: app.globalData.userInfo});
            wx.showToast({title: '授权成功'});
          })
        })
      }
    });
  },

  // 查询待咨询
  selZixun: function(){
    var url = "/api/v1/order/getOrderList";
    var params = {
      page: 1,
      limit: 100,
      status: 1,
    };
    app.globalData.userFun(url,params,1).then(res=>{
      for(var m of res.data){
        m.showPrice = app.globalData.priceShow(m.amount);
      }
      this.setData({zixunList: res.data});
    }).catch(err=>{
      wx.showToast({title: err.msg,icon: 'none'})
    });
  },

  onLoad: function () {
    this.csh();
  },

  goToPage: function(data) {
    var i = data.currentTarget.dataset.i;
    switch (i) {
      case 0:
        wx.navigateTo({
          url: './zixun/zixun'
        })
        break;
      case 1:
        wx.navigateTo({
          url: './ping/ping'
        })
        break;
      case 2:
        wx.navigateTo({
          url: './guan/guan'
        })
        break;
      case 3:
        wx.navigateTo({
          url: './zuji/zuji'
        })
        break;
      case 4:
        wx.navigateTo({
          url: './advise/advise'
        })
        break;
    }
  },

  // 初始化页面
  csh: function(){
    this.setData({userInfo: app.globalData.userInfo})
    // 查询待咨询
    if(app.globalData.userInfo&&app.globalData.userInfo.id){
      this.selZixun();
    }
  },

  // 下拉刷新
  onPullDownRefresh: function(){
    this.csh();
    setTimeout(()=>{
      wx.stopPullDownRefresh();
    },1000);
  },
})
