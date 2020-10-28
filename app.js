//app.js
var config = require("./utils/config.js");
var userFun = require("./utils/userFun.js");
var priceShow = require("./utils/priceShow.js");
App({
  onLaunch: function () {
    // 展示本地存储能力
    var that = this

    // 登录
    wx.login({
      success: res => {
        that.globalData.code = res.code;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  var url = "/api/v1/user/auth";
                  var params = {
                    jsCode: that.globalData.code,
                    headUrl: res.userInfo.avatarUrl,
                    nickName: res.userInfo.nickName,
                  };
                  that.globalData.config(url,params).then(res=>{
                    console.log(res);
                    that.globalData.userInfo = res.data;
                    that.globalData.token = res.data.token;
                    that.globalData.openId = res.data.openId;
                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    this.userInfoReadyCallback(res)
                  }).catch(err=>{
                    wx.showToast({title: err.msg,icon: 'none'})
                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    this.userInfoReadyCallback(res)
                  });
                }
              })
            }else{
              this.userInfoReadyCallback(res)
            }
          }
        })
      }
    })
    // 获取用户设备信息
    wx.getSystemInfo({
      success: res => {
        that.globalData.barheight = res.statusBarHeight;
        that.globalData.screenWidth = res.screenWidth;
        that.globalData.screenHeight = res.screenHeight;
      }
    })
  },
  globalData: {
    userInfo: null,// 用户信息
    code: '',// CODE
    titleH: 44,
    config: config.config,// 接口方法
    userFun: userFun,// 必须登录的接口方法
    priceShow: priceShow,// 展示价格方法
    token: undefined,
    openId: undefined,
    baseUrl: 'https://www.jiuniuwenjin.com:8080',
    imgUrl: 'https://www.jiuniuwenjin.com:8080',
    typeList: [],// 咨询类型列表
  }
})