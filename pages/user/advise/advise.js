//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    content: '',// 建议内容
    lianxi: '',// 联系方式
  },

  getNei: function(e){
    this.setData({content: e.detail.value});
  },

  getLian: function(e){
    this.setData({lianxi: e.detail.value});
  },

  tijiao: function(){
    if(!this.data.content){
      wx.showToast({title: '内容不能为空',icon: 'none'})
    }else if(!this.data.lianxi){
      wx.showToast({title: '联系方式不能为空',icon: 'none'})
    }else{
      var url = "/api/v1/complaints/addComplaints";
      var params = {
        telNo: this.data.lianxi,
        content: this.data.content,
      };
      app.globalData.userFun(url,params).then(res=>{
        wx.showToast({title: '您的建议已提交成功',icon: 'none'})
        setTimeout(()=>{
          wx.navigateBack({});
        },1000);
      }).catch(err=>{
        wx.showToast({title: err.msg,icon: 'none'})
      });
    }
  },
  
  onLoad: function () {
    
  },
})
