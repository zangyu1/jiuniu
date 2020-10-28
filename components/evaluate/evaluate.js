var app = getApp();

Component({
  properties: {
    type: {//类型
      type: String,
      value: "1"
    },
    msg: {//评价信息
      type: Object,
      value: {}
    },
    teaMsg: {//教师信息
      type: Object,
      value: {}
    },
  },
  data: {
    imgUrl: app.globalData.imgUrl,
    labels: [],// 教师标签
  },
  methods: {
    // 删除我的评价
    del: function(){
      var that = this;
      wx.showModal({
        title: '提示',
        content: '确定删除吗？',
        success (res) {
          if (res.confirm) {
            var url = "/api/v1/questionsComment/delQuestionsComment";
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
  },

  ready(){
    if(typeof(this.data.msg.quickReplyIds) == "object"){
      var labels = this.data.msg.quickReplyIds;
      this.setData({labels: labels,teaMsg: {teacherName: this.data.msg.teacherName,headUrl: this.data.msg.headUrl,showAskCount: this.data.msg.showAskCount}});
    }else{
      var labels = this.data.msg.quickReplyIds.split(',');
      this.setData({labels: labels});
    }
  }
})
