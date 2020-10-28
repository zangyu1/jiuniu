//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    headUrl: '',// 头像
    teaId: -1,// 教师ID
    type: -1,// 服务类型
    typeList: [],// 服务类型
    typeArr: [],
    choice: {},// 选中的服务
    sex: 'M',// 性别
    nums: 1,// 数量
    readXieyi: false,// 是否选择了阅读
    phone: '',// 手机号
    wx: '',// 微信号
    total: 0,// 总价
    showTotal: 0,// 总价
    isShowFuwuTip: false,// 服务协议
    isShowYinTip: false,// 隐私协议
    userInfo: null,// 用户信息
  },

  bindGetUserInfo: function(e){
    var url = "/api/v1/user/auth";
    var params = {
      jsCode: app.globalData.code,
      headUrl: e.detail.userInfo.avatarUrl,
      nickName: e.detail.userInfo.nickName,
    };
    app.globalData.config(url,params).then(res=>{
      this.setData({userInfo: res.data});
      app.globalData.userInfo = res.data;
      app.globalData.token = res.data.token;
      app.globalData.openId = res.data.openId;
      wx.showToast({title: "登录授权成功"});
    }).catch(err=>{
      wx.showToast({title: err.msg,icon: 'none'});
    });
  },

  bindPickerChange: function(e){
    var i = e.detail.value;
    this.setData({choice: this.data.typeList[i]});
    this.jisuan();
  },

  // 减法
  reduce: function(){
    var num = this.data.nums - 1;
    this.setData({nums: num});
  },

  // 加法
  add: function(){
    var num = this.data.nums + 1;
    this.setData({nums: num});
    this.jisuan();
  },

  // 计算
  jisuan: function(){
    var p = this.data.choice.price * this.data.nums;
    var showTotal = app.globalData.priceShow(p);
    this.setData({total: p,showTotal: showTotal});
  },

  // 复制
  copy: function(){
    wx.setClipboardData({
      data: this.data.phone,
      success: function () {
      	// 添加下面的代码可以复写复制成功默认提示文本`内容已复制` 
        wx.showToast({
          title: '复制成功',
          duration: 3000
        })
      }
    })
  },

  // 阅读协议
  read: function(){
    var t = !this.data.readXieyi;
    this.setData({readXieyi: t});
  },

  // 选择性别
  choiceSex: function(e){
    this.setData({sex: e.currentTarget.dataset.i});
  },

  // 处理咨询类型
  delType: function(){
    var arr = [],list = this.data.typeList;
    for(var i = 0;i < list.length;i++){
      var m = list[i];
      m.index = i;
      arr.push(m.methodName);
      if(m.askMethodId == this.data.type){
        this.setData({choice: m});
      }
    }
    this.setData({typeList: list,typeArr: arr});
    this.jisuan();
  },

  // 获取手机号
  getPhone: function(e){
    this.setData({phone: e.detail.value});
  },

  // 获取微信号
  getWx: function(e){
    this.setData({wx: e.detail.value});
  },

  // 展示服务协议
  showFuwu: function(){
    this.setData({isShowFuwuTip: true});
  },

  // 展示隐私协议
  showYin: function(){
    this.setData({isShowYinTip: true});
  },

  // 支付
  pay: function(){
    if(!(/^1[3456789]\d{9}$/.test(this.data.phone))){
      wx.showToast({title: '请输入正确的手机号',icon: 'none'})
    }else if(!this.data.wx){
      wx.showToast({title: '微信号不能为空',icon: 'none'})
    }else if(!this.data.readXieyi){
      wx.showToast({title: '请先阅读协议',icon: 'none'})
    }else{
      var params = {
        askMenthodId: this.data.choice.askMethodId,
        askNum: this.data.nums,
        amount: this.data.total,
        teacherId: this.data.teaId,
        sex: this.data.sex,
        telNo: this.data.phone,
        wx: this.data.wx,
      }
      var url = "/api/v1/order/generatorOrder";
      app.globalData.userFun(url,params).then(res=>{
        var data = res.data;
        var url2 = "/api/v1/order/pay";
        var params2 = {
          orderNo: data.orderNo,
          amount: data.amount,
        }
        app.globalData.userFun(url2,params2).then(res2=>{
          if(this.data.total == 0){
            wx.showToast({title: '支付成功'});
            setTimeout(()=>{
              wx.navigateTo({url: '/pages/user/zixun/zixun'});
            },2000);
            return false;
          }
          var data = res2.data;
          wx.requestPayment({
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success (res) {
              wx.showToast({title: '支付成功'});
              setTimeout(()=>{
                wx.navigateTo({url: '/pages/user/zixun/zixun'});
              },2000);
            },
            fail (res) {
              if(res.errMsg == "requestPayment:fail cancel"){
                wx.showToast({title: '您已取消支付'});
              }else{
                wx.showToast({title: '支付失败'});
              }
              setTimeout(()=>{
                wx.navigateTo({url: '/pages/user/zixun/zixun'});
              },2000);
            }
          })
        })
      })
    }
  },

  // 查询教师详情
  selTea: function(){
    var url = "/api/v1/teacher/getTeacher";
    var params = {id: this.data.teaId};
    app.globalData.config(url,params,1).then(res=>{
      var arr = [];
      for(var m of res.data.teacherPriceList){
        m.showPrice = app.globalData.priceShow(m.price);
        arr.push(m);
      }
      this.setData({typeList: arr,headUrl: res.data.headUrl});
      this.delType();
    });
  },
  
  onLoad: function (options) {
    this.setData({teaId: options.id,type: options.type,userInfo: app.globalData.userInfo});
    // 查询教师详情
    this.selTea();
  },
})
