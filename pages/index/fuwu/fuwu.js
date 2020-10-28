//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    // 服务列表
    fuwuArr: [],
  },

  // 查询服务列表
  selFuwu: function() {
    var url = "/api/v1/service/list";
    var params = {};
    app.globalData.config(url,params,1).then(res=>{
      this.setData({fuwuArr: res.data});
    });
  },
  
  onLoad: function () {
    // 查询服务列表
    this.selFuwu();
  },
})
