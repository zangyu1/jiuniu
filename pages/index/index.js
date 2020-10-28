//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    scrollTop: 0,// 页面距离顶部距离
    // banner图片列表
    bannerArr: [],
    // 我们是谁图片列表
    mineArr: [{ "imageUrl": "/img/index/mine1.png" },{ "imageUrl": "/img/index/mine2.png" },
    { "imageUrl": "/img/index/mine3.png" },{ "imageUrl": "/img/index/mine4.png" }],
    // 服务列表
    fuwuArr: [],
    // 热门讨论列表
    hotLun: [],
    // 问答列表
    wendaList: [],
    shareId: -1,// 分享ID
    isShowShare: false,
  },
  // 进入搜索页面
  goToSearch: function() {
    wx.navigateTo({
      url: './search/search'
    })
  },
  // 进入服务页面
  goFuwu: function() {
    wx.navigateTo({
      url: './fuwu/fuwu'
    })
  },
  // 进入新手指南页面
  goNew: function() {
    wx.navigateTo({
      url: './new/new'
    })
  },
  // 进入为什么选我们页面
  goWhy: function() {
    wx.navigateTo({
      url: './why/why'
    })
  },
  // 进入教师详情
  goTea: function(e){
    wx.navigateTo({
      url: '/pages/consult/teacher/teacher?id='+e.currentTarget.dataset.i.id
    })
  },

  onPageScroll: function(e) {
    this.setData({scrollTop: e.scrollTop});
  },

  // 查询服务列表
  selFuwu: function() {
    var url = "/api/v1/service/list";
    var params = {};
    app.globalData.config(url,params,1).then(res=>{
      this.setData({fuwuArr: res.data});
    });
  },

  // 热门导师
  selTea: function() {
    var url = "/api/v1/theme/getThemeList";
    var params = {page: 1,limit: 5};
    app.globalData.config(url,params,1).then(res=>{
      this.setData({hotLun: res.data});
    });
  },

  // 热门问答列表
  selWenda: function() {
    // var url = "/api/v1/questions/getHotQuestionsList";
    // var params = {page: 1,limit: 5};
    // app.globalData.config(url,params,1).then(res=>{
    //   this.setData({wendaList: res.data});
    // });
    var url = "/api/v1/questions/getQuestionsList";
    var params = {page: 1,limit: 5,questionType: 21};
    app.globalData.config(url,params,1).then(res=>{
      this.setData({wendaList: res.data});
    });
  },

  // 查询banner
  selBanner: function(){
    var url = "/api/v1/banner/list";
    var params = {type: 0};
    app.globalData.config(url,params,1).then(res=>{
      this.setData({bannerArr: res.data});
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log("来自页面内转发按钮");
      console.log(res.target);
    }else {
      console.log("来自右上角转发菜单")
      return false;
    }
    return {
      title: res.target.dataset.i.title,
      path:'/pages/question/detail/detail?id='+res.target.dataset.i.id,
      imageUrl: "/img/public/logo.jpg",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },

  onLoad: function () {
    this.csh();
    app.userInfoReadyCallback = res => {
      // 热门问答列表
      this.selWenda();
    }
  },

  // 初始化页面
  csh: function(){
    // 查询banner
    this.selBanner();
    // 查询服务列表
    this.selFuwu();
    // 热门导师
    this.selTea();
    // 热门问答列表
    this.selWenda();
  },

  // 下拉刷新
  onPullDownRefresh: function(){
    this.csh();
    setTimeout(()=>{
      wx.stopPullDownRefresh();
    },1000);
  },
})
