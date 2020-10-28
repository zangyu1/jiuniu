//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    isEnd: false,// 下拉刷新是否结束
    // fenlei: ['问答','视频'],// 分类
    fenlei: ['问答'],// 分类
    fenIndex: 0,// 选中模块下标
    videoId: undefined,// 分享的视频ID
    shareVideo: {},// 分享的视频
    // banner图片列表
    bannerArr: [],
    titleArr: [],// 分类列表
    lists: [],// 问答列表
    tuiIndex: 0,// 选中的分类下标
    page: 1,// 页码
    limit: 5,// 每页数据
    total: 0,// 总数
    lists2: [],// 视频列表
    page2: 1,// 页码
    limit2: 5,// 每页数据
    total2: 0,// 总数
  },

  // 点击分类
  clickFen: function(e){
    this.setData({fenIndex: e.target.dataset.i});
    this.selList(true);
  },

  // 进入搜索页面
  goToSearch: function() {
    wx.navigateTo({
      url: './search/search'
    })
  },

  // 选择标题
  choiceTitle: function(data){
    if(this.data.tuiIndex != data.currentTarget.dataset.i){
      this.setData({tuiIndex: data.currentTarget.dataset.i});
      this.selList(true);
    }
  },

  // 进入问答详情
  goDetail: function(e){
    wx.navigateTo({
      url: '/pages/question/detail/detail?id='+e.currentTarget.dataset.item.jumpUrl
    })
  },

  // 查询banner
  selBanner: function(){
    var url = "/api/v1/banner/list";
    var params = {type: 2};
    app.globalData.config(url,params,1).then(res=>{
      for(var m of res.data){
        m.imageUrl = app.globalData.imgUrl + m.url;
      }
      this.setData({bannerArr: res.data});
    });
  },

  // 列表
  selList: function(e) {
    if(this.data.fenIndex == 0){
      var data = this.data.lists;
      if(e.type == "scrolltolower"){
        if(this.data.total <= data.length){
          wx.showToast({title: '没有更多了',icon: 'none'})
          return false;
        }
      }else{
        this.setData({page: 1});
        data = [];
      }
      var url = "/api/v1/questions/getQuestionsList";
      var params = {page: this.data.page,limit: this.data.limit,questionType: this.data.titleArr[this.data.tuiIndex].id};
      app.globalData.config(url,params,1).then(res=>{
        for(var m of res.data){
          data.push(m);
        }
        this.setData({lists: data,total: res.count,page: this.data.page++});
      });
    }else{
      var data = this.data.lists2;
      if(e.type == "scrolltolower"){
        if(this.data.total2 <= data.length){
          wx.showToast({title: '没有更多了',icon: 'none'})
          return false;
        }
      }else{
        this.setData({page2: 1});
        data = [];
      }
      var url = "/api/v1/video/getVideoList";
      var params = {page: this.data.page2,limit: this.data.limit2};
      app.globalData.config(url,params,1).then(res=>{
        for(var m of res.data){
          if(m.id != this.data.videoId){
            data.push(m);
          }
        }
        this.setData({lists2: data,total2: res.count,page2: this.data.page2++});
      });
    }
  },

  // 查询分类
  selFenlei: function(){
    var url = "/api/v1/icon/list";
    var params = {iconType: 2};
    app.globalData.config(url,params,1).then(res=>{
      this.setData({titleArr: res.data});
      // 列表
      this.selList(true);
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
    var path,imageUrl;
    if(res.target.dataset.i.videoUrl){
      path = '/pages/question/question?id='+res.target.dataset.i.id;
      imageUrl = this.data.imgUrl + res.target.dataset.i.coverUrl;
    }else{
      path = '/pages/question/detail/detail?id='+res.target.dataset.i.id;
      imageUrl = "/img/public/logo.jpg";
    }
    return {
      title: res.target.dataset.i.title,
      path: path,
      imageUrl: imageUrl,
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },

  // 查询视频详情
  selVideo: function(id) {
    var url = "/api/v1/video/getVideo";
    var params = {id: id};
    app.globalData.config(url,params,1).then(res=>{
      this.setData({shareVideo: res.data});
    });
  },
  
  onLoad: function (options) {
    if(options.id){
      this.setData({fenIndex: 1,videoId: options.id});
      this.selVideo(options.id);
    }
    this.csh();
  },

  // 初始化页面
  csh: function(){
    // 查询banner
    this.selBanner();
    // 查询分类
    this.selFenlei();
  },

  // 下拉刷新
  pullDownRefresh: function(){
    this.csh();
    var that = this;
    setTimeout(()=>{
      that.setData({isEnd:false});
    },1000);
  },
})
