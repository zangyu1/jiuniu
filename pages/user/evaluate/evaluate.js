//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    msg: {},// 订单信息
    content: '',// 评价内容
    qualityScore: 0,// 咨询品质评级
    attitudeScore: 0,// 沟通态度评级
    labelList: [],// 教师标签
  },

  // 输入框改变 
  getNei: function(e){
    this.setData({content: e.detail.value});
  },

  // 评级
  pingji1: function(e){
    var i = e.currentTarget.dataset.i + 1;
    this.setData({qualityScore: i});
  },

  // 评级
  pingji2: function(e){
    var i = e.currentTarget.dataset.i + 1;
    this.setData({attitudeScore: i});
  },

  // 查询专业列表
  selLabel: function(){
    var url = "/api/v1/dict/list";
    var arr = [];
    app.globalData.config(url,{dictCode: 'LABEL'},1).then(res=>{
      for(var m of res.data){
        arr.push(m);
      }
      this.setData({labelList: arr});
    });
  },

  // 选择标签
  choiceLabel: function(e){
    var i = e.currentTarget.dataset.i;
    var t = !this.data.labelList[i].choice;
    this.setData({['labelList['+i+'].choice']: t});
  },

  // 提交
  tijiao: function(){
    if(!this.data.content){
      wx.showToast({title: '评论内容不能为空',icon: 'none'})
    }else{
      var params = {
        orderId: this.data.msg.id,
        teacherId: this.data.msg.teacherId,
        content: this.data.content,
        attitudeScore: this.data.attitudeScore,
        qualityScore: this.data.qualityScore,
      }
      var url = "/api/v1/orderComment/saveOrderComment";
      app.globalData.userFun(url,params).then(res=>{
        wx.showToast({title: '评价成功，系统审核通过后将在老师评价列表中展示',icon: 'none'});
        setTimeout(()=>{
          wx.navigateBack({});
        },2000);
      })
    }
  },
  
  onLoad: function (options) {
    this.setData({msg: JSON.parse(options.msg)});
    // 查询教师标签
    this.selLabel();
  },
})
