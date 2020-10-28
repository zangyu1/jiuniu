// type(0是post,1是get)
function userFun(url,params = {},type = 0){
  //获取应用实例
  const app = getApp()
  return new Promise((resolve, reject) => {
    if(app.globalData.userInfo&&app.globalData.userInfo.id){
      params.userId = app.globalData.userInfo.id;
      app.globalData.config(url,params,type).then(res=>{
        resolve(res);
      }).catch(err=>{
        reject(err);
      })
    }else{
      wx.showToast({title: '请先登录',icon: 'none'})
    }
  })
  
}

module.exports = userFun