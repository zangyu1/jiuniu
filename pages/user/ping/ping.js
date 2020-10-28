//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    statusH: app.globalData.barheight,// 状态栏高度
    titleH: app.globalData.titleH,// 标题栏高度
    // 数据列表
    lists: [],
    tindex: 1,// 标题下标
    page: 1,// 页码
    limit: 10,// 每页数据
    total: 0,// 总数
  },

  // 查询数据
  selData: function(e){
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
    var url = "/api/v1/questionsComment/getUserCommentList";
    var params = {page: this.data.page,limit: this.data.limit,attentionType: this.data.tindex};
    app.globalData.userFun(url,params,1).then(res=>{
      for(var m of res.data){
        data.push(m);
      }
      this.setData({lists: data,total: res.count,page: this.data.page++});
    });
  },

  // 选择标题
  choice: function(e){
    this.setData({tindex: e.target.dataset.i});
    this.selData(true);
  },
  
  onReady: function () {
    // 查询我的评论
    this.selData(true);
  },
})
