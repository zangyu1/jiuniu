var app = getApp();

Component({
  properties: {
    type: {//类型
      type: String,
      value: "1"
    },
    msg: {//教师信息
      type: Object,
      value: {}
    },
  },
  data: {
    imgUrl: app.globalData.imgUrl,
  },
  ready: function () {
    if(!this.data.msg.id){
      var obj = {
        teacherName: '张三',
        showAskCount: 10,
        workYear: 5,
        areaName: '四川',
        descs: '这是随便一段介绍',
        labelList: ['和蔼可亲'],
        price: 20000,
      }
      this.setData({msg: obj});
    }
  },
  methods: {
    // 进入教师详情
    goTea: function(){
      var id = this.data.msg.id;
      if(this.data.msg.targetId){
        id = this.data.msg.targetId
      }
      wx.navigateTo({
        url: '/pages/consult/teacher/teacher?id='+id
      })
    },
    // 删除关注教师
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
  }
})
