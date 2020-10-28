//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    statusH: app.globalData.barheight,// 状态栏高度
    titleH: app.globalData.titleH,// 标题栏高度
    isSearch: false,// 是否已经开始搜索
    selTitle: '',// 搜索输入文本
    history: [],// 历史搜索记录
    page: 1,// 页码
    limit: 10,// 每页数据
    lists: [],// 数据列表
    total: 0,// 总数
  },

  // 输入框改变 
  change: function(e){
    this.setData({selTitle: e.detail.value});
  },

  // 进入教师详情
  goTea: function(e){
    wx.navigateTo({
      url: '/pages/consult/teacher/teacher?id='+e.currentTarget.dataset.item.id
    })
  },

  // 查询数据
  selData: function(event){
    this.setData({isSearch: true});
    var data = this.data.lists;
    if(event.type=="confirm"){
      data = [];
    }else if(this.data.total <= data.length){
      wx.showToast({title: '没有更多了',icon: 'none'})
      return false;
    }
    if(this.data.selTitle){
      var arr = this.data.history;
      arr.splice(0,0,this.data.selTitle);
      if(arr.length > 4){
        arr.length = 4;
      }
      this.setData({history: arr});
      wx.setStorage({key:"searchTea",data:JSON.stringify(arr)});
    }
    var url = "/api/v1/teacher/getTeacherList";
    var params = {page: this.data.page,limit: this.data.limit,teacherName: this.data.selTitle};
    app.globalData.config(url,params,1).then(res=>{
      for(var m of res.data){
        data.push(m);
      }
      this.setData({lists: data,total: res.count,page: this.data.page++});
    });
  },

  // 查询历史
  searHis: function(e){
    this.setData({selTitle: e.target.dataset.i});
    this.selData({type: "confirm"});
  },

  // 清除查询
  cancel: function(){
    this.setData({isSearch: false,selTitle: ""});
  },

  // 清除查询
  del: function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定清除历史搜索吗？',
      success (res) {
        if (res.confirm) {
          that.setData({history: []});
          wx.removeStorage({key: 'searchTea'});
        }
      }
    })
  },

  // 获取历史搜索
  getHistory: function(){
    var that = this;
    wx.getStorage({
      key: 'searchTea',
      success (res) {
        var arr = JSON.parse(res.data);
        that.setData({history: arr});
      }
    })
  },

  onLoad: function () {
    // 获取历史搜索
    this.getHistory();
  },
})
