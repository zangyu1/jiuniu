//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    msg: {},// 问答详情
    selTitle: "",// 搜索的文本
  },

  // 热门问答详情
  selWenda: function(id) {
    var url = "/api/v1/questions/getQuestions";
    var params = {id: id};
    app.globalData.config(url,params,1).then(res=>{
      this.setData({msg: res.data});
    });
  },

  // 发送评论
  sendPing: function(e){
    var content = e.detail.value;
    if(content.length==0){
      wx.showToast({title: '请输入评论内容',icon: 'none'})
    }else{
      wx.serviceMarket.invokeService({
        service: 'wxee446d7507c68b11',
        api: 'msgSecCheck',
        data: {
          "Action": "TextApproval",
          "Text": content
        },
      }).then(res => {
        if(res.data.Response.EvilTokens.length==0){
          var url = "/api/v1/questionsComment/addQuestionsComment";
          var params = {questionId: this.data.msg.id,content: content};
          app.globalData.userFun(url,params).then(res=>{
            this.setData({selTitle: ""});
            this.selWenda(this.data.msg.id);
            wx.showToast({title: '评论成功',icon: 'none'});
          });
        }else{
          wx.showToast({title: '您的评论包含敏感字段,请修改后再评论！',icon: 'none'});
        }
      })
    }
  },

  // 点赞
  dianzan: function(e){
    var i = e.currentTarget.dataset.i;
    var url = "/api/v1/questions/saveLike";
    var params = {id: this.data.msg.id,type: i};
    app.globalData.userFun(url,params).then(res=>{
      if(i == 1){
        wx.showToast({title: '点赞成功'})
        var j = this.data.msg.likeNum + 1;
        this.setData({['msg.likeNum']: j,['msg.likeType']: true})
        
      }else if(i == 2){
        wx.showToast({title: '取消点赞成功'})
        var j = this.data.msg.likeNum - 1;
        this.setData({['msg.likeNum']: j,['msg.likeType']: false})
      }
    });
  },

  // 收藏
  collect: function(e){
    var i = e.currentTarget.dataset.i;
    if(i == 1){
      var url = "/api/v1/userAttention/addUserAttention";
      var params = {targetId: this.data.msg.id,attentionType: 2};
      app.globalData.userFun(url,params).then(res=>{
        wx.showToast({title: '收藏成功'})
        var j = this.data.msg.collectNum + 1;
        this.setData({['msg.collectNum']: j,['msg.collectType']: true})
      });
    }else if(i == 2){
      var url = "/api/v1/userAttention/delAttention";
      var params = {targetId: this.data.msg.id,attentionType: 2};
      app.globalData.userFun(url,params).then(res=>{
        wx.showToast({title: '取消收藏成功'})
        var j = this.data.msg.collectNum - 1;
        this.setData({['msg.collectNum']: j,['msg.collectType']: false})
      });
    }
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
    }
    return {
      title: "问答详情",
      path:'/pages/question/detail/detail?id='+this.data.msg.id,
      imageUrl: "/img/public/logo.jpg",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },
  
  onLoad: function (options) {
    // 查询问答详情
    this.selWenda(options.id);
  },
})
