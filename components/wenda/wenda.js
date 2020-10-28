var app = getApp();

Component({
  properties: {
    type: {//类型
      type: String,
      value: "1"
    },
    msg: {//问答信息
      type: Object,
      value: {}
    },
  },
  data: {
    imgUrl: app.globalData.imgUrl,
    userId: undefined,// 用户信息
    selTitle: "",// 搜索的文本
  },

  methods: {
    // 删除关注问答
    del: function(){
      var that = this;
      wx.showModal({
        title: '提示',
        content: '确定删除吗？',
        success (res) {
          if (res.confirm) {
            var url = "/api/v1/userAttention/delUserAttention";
            var params = {id: that.data.msg.id};
            app.globalData.userFun(url,params).then(res=>{
              wx.showToast({title: '删除成功',icon: 'none'})
              that.triggerEvent('del');
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    
    // 展开收起文章
    showAll: function(e){
      var i = e.currentTarget.dataset.i;
      var t = !this.data.msg.answerListVo[i].showAll;
      this.setData({['msg.answerListVo['+i+'].showAll']: t});
    },

    // 进入详情
    goDetail: function(){
      if(this.data.type!=5){
        var id = this.data.msg.id;
        if(this.data.msg.questionId){
          id = this.data.msg.questionId;
        }
        wx.navigateTo({
          url: '/pages/question/detail/detail?id='+id
        })
      }
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

    // 同感或不同感
    feel: function(){
      var url = "/api/v1/questions/saveFeel";
      var params = {id: this.data.msg.id,type: 1};
      if(this.data.msg.feelType){
        params.type = 2;
      }
      app.globalData.userFun(url,params).then(res=>{
        if(params.type == 1){
          wx.showToast({title: '成功'})
          var j = this.data.msg.feelNum + 1;
          this.setData({['msg.feelNum']: j,['msg.feelType']: true})
          
        }else if(params.type == 2){
          wx.showToast({title: '取消成功'})
          var j = this.data.msg.feelNum - 1;
          this.setData({['msg.feelNum']: j,['msg.feelType']: false})
        }
      });
    },

    // 热门问答详情
    selWenda: function(id) {
      var url = "/api/v1/questions/getQuestions";
      var params = {id: id};
      app.globalData.config(url,params,1).then(res=>{
        this.setData({msg: res.data});
      });
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

    // 删除评论
    delPind: function(e){
      var that = this;
      wx.showModal({
        title: '提示',
        content: '确定删除吗？',
        success (res) {
          if (res.confirm) {
            var url = "/api/v1/questionsComment/delQuestionsComment";
            var id;
            if(e.currentTarget.dataset.item){
              id = e.currentTarget.dataset.item.id;
            }else{
              id = that.data.msg.id;
            }
            var params = {id: id};
            app.globalData.userFun(url,params).then(res=>{
              if(e.currentTarget.dataset.item){
                wx.showToast({title: '删除成功',icon: 'none'})
                var arr = that.data.msg.commentListVo;
                arr.splice(e.currentTarget.dataset.i,1);
                that.setData({['msg.commentListVo']: arr});
              }else{
                that.triggerEvent('del');
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },

    // 展示隐藏回复
    showHui: function(){
      var t = !this.data.msg.showHuifu;
      this.setData({['msg.showHuifu']: t});
    },
  },

  ready(){
    if(app.globalData.userInfo){
      this.setData({userId: String(app.globalData.userInfo.id)});
    }
  },
})
