//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    statusH: app.globalData.barheight,// 状态栏高度
    titleH: app.globalData.titleH,// 标题栏高度
    // 数据列表
    lists: [],
    page: 1,// 页码
    limit: 10,// 每页数据
    total: 0,// 总数
    num: 0,// 当前数据总数
  },

  // 查询数据
  selData: function(e){
    var data = this.data.lists;
    
    if(e.type == "scrolltolower"){
      if(this.data.total <= this.data.num){
        wx.showToast({title: '没有更多了',icon: 'none'})
        return false;
      }
    }else{
      this.setData({page: 1,num: 0});
      data = [];
    }
    var num = this.data.num;
    var url = "/api/v1/userAttention/getUserAttentionsList";
    var params = {page: this.data.page,limit: this.data.limit,attentionType: 3};
    app.globalData.userFun(url,params,1).then(res=>{
      for(var i = 0;i < res.data.length;i++){
        num++;
        var m = res.data[i];
        m.time = m.createdDate.split(" ")[0];
        if(i == 0){
          if(data.length==0||m.time!=data[data.length-1].time){
            data.push({time: m.time,list: [m]});
          }else{
            data[data.length-1].list.push(m);
          }
        }else{
          if(m.time != res.data[i-1].time){
            data.push({time: m.time,list: [m]});
          }else{
            data[data.length-1].list.push(m);
          }
        }
      }
      this.setData({lists: data,total: res.count,page: this.data.page++,num: num});
    });
  },

  // 删除足迹
  del: function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success (res) {
        if (res.confirm) {
          var url = "/api/v1/userAttention/delTracks";
          var params = {delDate: e.currentTarget.dataset.i.time};
          app.globalData.userFun(url,params).then(res=>{
            wx.showToast({title: '删除成功'});
            // 查询我的足迹
            that.selData(true);
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  
  onLoad: function () {
    // 查询我的足迹
    this.selData(true);
  },
})
