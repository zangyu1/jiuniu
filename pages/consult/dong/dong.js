//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    statusH: app.globalData.barheight,// 状态栏高度
    titleH: app.globalData.titleH,// 标题栏高度
    lists: [],// 数据列表
    msg: {},// 教师信息
    page: 1,// 页码
    limit: 6,// 尺寸
    total: 1,// 总数
  },

  // 查询教师动态列表
  selDong: function(){
    var data = this.data.lists;
    if(this.data.total <= data.length){
      wx.showToast({title: '没有更多了',icon: 'none'})
      return false;
    }
    var url = "/api/v1/answer/getAnswerList";
    var params = {teacherId: this.data.msg.id,page: this.data.page,limit: this.data.limit};
    app.globalData.config(url,params,1).then(res=>{
      for(var m of res.data){
        data.push(m);
      }
      this.setData({lists: data,total: res.count,page: this.data.page++});
    });
  },
  
  onLoad: function (options) {
    this.setData({msg: {id: options.id}});
    // 查询教师动态列表
    this.selDong();
  },
})
