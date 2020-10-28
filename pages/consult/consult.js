//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    // banner图片列表
    bannerArr: [],
    // 分类列表
    fenleiList: [],
    // 热门讨论列表
    hotLun: [],
    teaList: [],// 分类教师列表
    tuiIndex: 0,// 热门推荐选中下标
    // 心声列表
    xinList: [],
  },

  // 进入搜索页面
  goToSearch: function() {
    wx.navigateTo({
      url: '../index/search/search'
    })
  },

  // 进入教师列表页面
  goList: function(e){
    wx.navigateTo({
      url: './list/list?id='+e.currentTarget.dataset.i
    })
  },

  // 选择标题
  choiceTitle: function(data){
    this.setData({tuiIndex: data.currentTarget.dataset.index});
    this.selList();
  },

  // 标题变化
  changeTitle: function(data){
    this.setData({tuiIndex: data.detail.current});
  },

  // 进入教师详情
  goDetail: function(e){
    wx.navigateTo({
      url: '/pages/consult/teacher/teacher?id='+e.currentTarget.dataset.item.jumpUrl
    })
  },

  // 查询banner
  selBanner: function(){
    var url = "/api/v1/banner/list";
    var params = {type: 1};
    app.globalData.config(url,params,1).then(res=>{
      for(var m of res.data){
        m.imageUrl = app.globalData.imgUrl + m.url;
      }
      this.setData({bannerArr: res.data});
    });
  },

  // 进入教师详情
  goTea: function(e){
    wx.navigateTo({
      url: '/pages/consult/teacher/teacher?id='+e.currentTarget.dataset.item.id
    })
  },

  // 查询分类
  selFenlei: function(){
    var url = "/api/v1/icon/list";
    var params = {iconType: 1};
    app.globalData.config(url,params,1).then(res=>{
      res.data.push({id: -1,iconName: '全部分类'});
      this.setData({fenleiList: res.data});
      // 列表
      this.selList();
    });
  },

  // 列表
  selList: function(){
    var url = "/api/v1/teacher/getTeacherList";
    var params = {page: 1,limit: 3,teacherType: this.data.fenleiList[this.data.tuiIndex].id};
    app.globalData.config(url,params,1).then(res=>{
      this.setData({teaList: res.data});
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

  // 用户心声
  selXin: function() {
    var url = "/api/v1/orderComment/getOrderCommentList";
    var params = {page: 1,limit: 5,showIndex: true};
    app.globalData.config(url,params,1).then(res=>{
      this.setData({xinList: res.data});
    });
  },

  onLoad: function () {
    this.csh();
  },

  // 初始化页面
  csh: function(){
    // 查询banner
    this.selBanner();
    // 查询分类
    this.selFenlei();
    // 热门导师
    this.selTea();
    // 用户心声
    this.selXin();
  },

  // 下拉刷新
  onPullDownRefresh: function(){
    this.csh();
    setTimeout(()=>{
      wx.stopPullDownRefresh();
    },1000);
  },
})
