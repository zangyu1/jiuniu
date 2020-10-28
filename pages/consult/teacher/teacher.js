//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    msg: {},// 教师信息
    scrollTop: 0,// 页面距离顶部距离
    showAll: false,// 是否展示全部
    pingLists: [],// 评论列表
    dongLists: [],// 动态列表
    pingNums: 0,// 评论总数
    dongNums: 0,// 评论总数
    fuIndex: 0,// 选择的服务下标
    shiting: null,// 试听服务
    typeList: [],// 服务类型
    isPlay: false,// 是否播放中
    myaudio: null,
    hasAudio: false,// 是否有音频
  },

  // 收藏
  collect: function(e){
    var i = e.currentTarget.dataset.i;
    if(i == 1){
      var url = "/api/v1/userAttention/addUserAttention";
      var params = {targetId: this.data.msg.id,attentionType: 1};
      app.globalData.userFun(url,params).then(res=>{
        wx.showToast({title: '关注成功'})
        var j = this.data.msg.collectNum + 1;
        this.setData({['msg.collectNum']: j,['msg.collectType']: true})
      });
    }else if(i == 2){
      var url = "/api/v1/userAttention/delAttention";
      var params = {targetId: this.data.msg.id,attentionType: 1};
      app.globalData.userFun(url,params).then(res=>{
        wx.showToast({title: '取消关注成功'})
        var j = this.data.msg.collectNum - 1;
        this.setData({['msg.collectNum']: j,['msg.collectType']: false})
      });
    }
  },

  // 展示
  show: function(){
    this.setData({showAll: true});
  },

  // 隐藏
  hide: function(){
    this.setData({showAll: false});
  },

  // 选择服务
  choice: function(e){
    this.setData({fuIndex: e.currentTarget.dataset.i})
  },

  // 进入评价页面
  goPing: function() {
    wx.navigateTo({
      url: '../ping/ping?id='+this.data.msg.id
    })
  },

  // 进入动态页面
  goDong: function() {
    wx.navigateTo({
      url: '../dong/dong?id='+this.data.msg.id
    })
  },

  // 展示认证
  showRen: function(e){
    this.setData({showRen: e.currentTarget.dataset.i})
  },

  // 隐藏认证
  hideRen: function(){
    this.setData({showRen: 0})
  },

  // 购买
  buy: function(){
    if(this.data.fuIndex > 0){
      wx.navigateTo({
        url: '../buy/buy?id='+this.data.msg.id+'&type='+this.data.fuIndex
      })
    }else{
      wx.showToast({title: '请选择服务',icon: 'none'})
    }
  },

  onPageScroll (e) {
    this.setData({scrollTop: e.scrollTop});
  },

  // 查询教师详情
  selTea: function(){
    var url = "/api/v1/teacher/getTeacher";
    var params = {id: this.data.msg.id};
    app.globalData.config(url,params,1).then(res=>{
      this.setData({msg: res.data});
      var arr = [];
      for(var m of res.data.teacherPriceList){
        m.showPrice = app.globalData.priceShow(m.price);
        if(m.askMethodId == 1){
          m.img = '/img/consult/zixun1.png';
          this.setData({shiting: m});
        }else{
          arr.push(m);
        }
      }
      this.setData({typeList: arr});
      if(res.data.videoUrl){
        this.data.myaudio = wx.createInnerAudioContext();
        this.data.myaudio.src = this.data.imgUrl + res.data.videoUrl;
        this.setData({hasAudio: true});
      }else{
        this.setData({hasAudio: false});
      }
    });
  },

  //播放
  play: function () {
    if(this.data.msg.videoUrl){
      this.data.myaudio.play();
      this.setData({isPlay: true});
    }else{
      wx.showToast({title: '该教师暂无语音介绍',icon: 'none'})
    }
    // var that = this;
    // setTimeout(()=>{
    //   if(that.data.myaudio.paused){
    //     wx.showToast({title: '音频出了点小问题！',icon: 'none'});
    //     that.setData({isPlay: false});
    //   }else{
    //     that.data.myaudio.onEnded(() => {
    //       that.setData({isPlay: false});
    //     })
    //   }
    // },1000);
    
  },

  // 暂停
  stop: function(){
    this.data.myaudio.pause();
    this.setData({isPlay: false});
  },

  // 进入新手指南页面
  goNew: function() {
    wx.navigateTo({
      url: '/pages/index/new/new'
    })
  },

  // 查询教师评论列表
  selPing: function(){
    var url = "/api/v1/orderComment/getOrderCommentList";
    var params = {teacherId: this.data.msg.id,page: 1,limit: 3};
    app.globalData.config(url,params,1).then(res=>{
      this.setData({pingNums: res.count,pingLists: res.data});
    });
  },

  // 查询教师动态列表
  selDong: function(){
    var url = "/api/v1/answer/getAnswerList";
    var params = {teacherId: this.data.msg.id,page: 1,limit: 3};
    app.globalData.config(url,params,1).then(res=>{
      this.setData({dongNums: res.count,dongLists: res.data});
    });
  },
  
  onLoad: function (options) {
    this.setData({msg: {id: options.id}});
    // 查询教师详情
    this.selTea();
    // 查询教师评论列表
    this.selPing();
    // 查询教师动态列表
    this.selDong();
  },

  onUnload: function(){
    this.data.myaudio.destroy();
  },

  onHide: function(){
    this.stop();
  },
})
