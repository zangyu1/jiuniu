// type(0是post,1是get)
function config(url,params={},type = 0, isLoad = true){
  //获取应用实例
  const app = getApp()
  return new Promise((resolve, reject) => {
    var header = {'content-type': 'application/json',accessToken: app.globalData.token};
    var method = "POST";
    if(type==1){
      method = "GET";
    }
    if(app.globalData.userInfo&&app.globalData.userInfo.id){
      params.userId = app.globalData.userInfo.id;
    }
    wx.request({
      url: app.globalData.baseUrl+url,
      data: params,
      header: header,
      method: method,
      timeout: 40000,
      success (res) {
        var data = res.data;
        if(data.code == 0){
          resolve(data);
        }else if(data.code == 501){
          wx.showToast({
            title: '登录失效,请重新登录',
            duration: 3000
          })
        }else{
          reject(data);
        }
      },
      fail (err){
        reject(err);
      },
    })
  })
  
}

module.exports = {
  config: config
}