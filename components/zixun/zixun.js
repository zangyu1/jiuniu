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
    // 进入教师详情
    goTea: function(){
      wx.navigateTo({
        url: '/pages/consult/teacher/teacher?id='+this.data.msg.teacherId
      })
    },

    // 进入评价页面
    ping: function(){
      wx.navigateTo({
        url: '/pages/user/evaluate/evaluate?msg='+JSON.stringify(this.data.msg)
      })
    },

    // 删除订单
    del: function(){
      var that = this;
      wx.showModal({
        title: '提示',
        content: '确定删除吗？',
        success (res) {
          if (res.confirm) {
            var url = "/api/v1/order/delOrder";
            var params = {id: that.data.msg.id};
            app.globalData.userFun(url,params,1).then(res=>{
              wx.showToast({title: '删除成功',icon: 'none'})
              that.triggerEvent('del');
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },

    // 支付
    pay: function(){
      var url2 = "/api/v1/order/pay";
      var params2 = {
        orderNo: this.data.msg.orderNo,
        amount: this.data.msg.amount,
      }
      var that = this;
      app.globalData.userFun(url2,params2).then(res2=>{
        var data = res2.data;
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign,
          success (res) {
            wx.showToast({title: '支付成功'});
            that.triggerEvent('del');
          },
          fail (res) {
            if(res.errMsg == "requestPayment:fail cancel"){
              wx.showToast({title: '您已取消支付'});
            }else{
              wx.showToast({title: '支付失败'});
            }
          }
        })
      })
    },
  },
  
  ready: function () {
    
  },
})
