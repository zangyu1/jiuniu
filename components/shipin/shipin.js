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
    commentListVo: [{},{}],// 回复列表
    selTitle: '',// 评论输入内容
  },

  methods: {
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
            var url = "/api/v1/videoComment/addVideoComment";
            var params = {questionId: this.data.msg.id,content: content};
            app.globalData.userFun(url,params).then(res=>{
              this.setData({selTitle: ""});
              this.selVideo(this.data.msg.id);
              wx.showToast({title: '评论成功',icon: 'none'});
            });
          }else{
            wx.showToast({title: '您的评论包含敏感字段,请修改后再评论！',icon: 'none'});
          }
        })
      }
    },

    // 查询视频详情
    selVideo: function(id) {
      var url = "/api/v1/video/getVideo";
      var params = {id: id};
      app.globalData.config(url,params,1).then(res=>{
        this.setData({msg: res.data});
      });
    },

    // 删除评论
    delPind: function(e){
      var that = this;
      wx.showModal({
        title: '提示',
        content: '确定删除吗？',
        success (res) {
          if (res.confirm) {
            var url = "/api/v1/videoComment/delVideoComment";
            var params = {id: e.currentTarget.dataset.item.id};
            app.globalData.userFun(url,params).then(res=>{
              wx.showToast({title: '删除成功',icon: 'none'})
              var arr = that.data.msg.videoCommentList;
              arr.splice(e.currentTarget.dataset.i,1);
              that.setData({['msg.videoCommentList']: arr});
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },

    // 点赞
    dianzan: function(e){
      var i = e.currentTarget.dataset.i;
      var url = "/api/v1/video/saveLikes";
      var params = {videoId: this.data.msg.id,type: i};
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
