var app = getApp();

Component({
  properties: {
    msg: {//咨询信息
      type: Object,
      value: {}
    },
  },
  data: {
    imgUrl: app.globalData.imgUrl,
  },
  methods: {
    // 点赞
    dianzan: function(e){
      var i = e.currentTarget.dataset.i;
      var url = "/api/v1/orderComment/saveLike";
      var params = {id: this.data.msg.id,type: i};
      app.globalData.userFun(url,params).then(res=>{
        if(i == 1){
          wx.showToast({title: '点赞成功'})
          var j = this.data.msg.likeCount + 1;
          this.setData({['msg.likeCount']: j,['msg.likeType']: true})
          
        }else if(i == 2){
          wx.showToast({title: '取消点赞成功'})
          var j = this.data.msg.likeCount - 1;
          this.setData({['msg.likeCount']: j,['msg.likeType']: false})
        }
      });
    },
  },
  
  ready: function () {
    
  },
})
