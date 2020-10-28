//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    statusH: app.globalData.barheight,// 状态栏高度
    titleH: app.globalData.titleH,// 标题栏高度
    index1: -1,// 选中下标
    index2: -1,// 选中下标
    index3: -1,// 选中下标
    index4: -1,// 选中下标
    index5: -1,// 选中下标
    index6: -1,// 选中下标
    showIndex: 0,// 展示的分类下标
    fenList: ['全部','地区','价格','筛选'],// 所有分类列表
    fuwuList: [],// 服务列表
    priceList: [{name: '不限'},{name: '100元以下',value: [0,100]},{name: '100-300元',value: [100,300]},
    {name: '300-500元',value: [300,500]},{name: '500-1000元',value: [500,1000]}],// 价格列表
    country: [],// 国家列表
    countryId: -1,// 国家ID
    addrList: [],// 城市列表
    addrId: -1,// 城市ID
    parentId: -1,// 父级ID
    // 方式列表
    typeList: [],
    // 性别列表
    sexList: [{name: '不限',id: -1},{name: '男',id: 'M'},{name: '女',id: 'F'}],
    // 专业列表
    majorList: [],
    lists: [],// 数据列表
    page: 1,// 页码
    limit: 10,// 每页数据
    total: 0,// 总数
  },

  // 进入搜索页面
  goToSearch: function() {
    wx.navigateTo({
      url: '../../index/search/search'
    })
  },

  // 展示选择分类
  showFen:function(e){
    this.setData({showIndex: e.currentTarget.dataset.i})
  },

  // 选择分类1
  choice1:function(e){
    if(this.data.index1 != e.currentTarget.dataset.i){
      this.setData({index1: e.currentTarget.dataset.i,showIndex: 0})
      this.selList(true);
    }
  },

  // 选择分类3
  choice3:function(e){
    if(this.data.index3 != e.currentTarget.dataset.i){
      this.setData({index3: e.currentTarget.dataset.i,showIndex: 0})
      this.selList(true);
    }
  },

  // 选择分类4
  choice4:function(e){
    console.log(e.currentTarget.dataset.i);
    if(this.data.index4 != e.currentTarget.dataset.i){
      this.setData({index4: e.currentTarget.dataset.i})
    }
  },

  // 选择分类5
  choice5:function(e){
    if(this.data.index5 != e.currentTarget.dataset.i){
      this.setData({index5 : e.currentTarget.dataset.i})
    }
  },

  // 选择分类6
  choice6:function(e){
    if(this.data.index6 != e.currentTarget.dataset.i){
      this.setData({index6: e.currentTarget.dataset.i})
    }
  },

  // 选择国家
  choiceCountry:function(e){
    if(this.data.countryId != e.currentTarget.dataset.i){
      this.setData({countryId: e.currentTarget.dataset.i});
      if(this.data.countryId == -1){
        this.setData({showIndex: 0})
        this.selList(true);
      }else{
        this.selAddr();
      }
    }
  },

  // 选择城市
  choiceAddr:function(e){
    if(this.data.addrId != e.currentTarget.dataset.i){
      this.setData({addrId: e.currentTarget.dataset.i,parentId: e.currentTarget.dataset.j,showIndex: 0});
      this.selList(true);
    }
  },

  // 重置
  reset: function(){
    this.setData({index6: -1,index5: -1,index4: -1})
  },

  // 确认
  ensure: function(){
    this.setData({showIndex: 0});
    this.selList(true);
  },

  // 关闭弹窗
  close: function(){
    this.setData({showIndex: 0});
  },

  // 查询方式
  selType: function(){
    var url = "/api/v1/askMethod/list";
    app.globalData.config(url,{},1).then(res=>{
      var arr = [{methodName: '不限',id: -1}];
      for(var m of res.data){
        arr.push(m);
      }
      this.setData({typeList: arr});
    });
  },

  // 进入教师详情
  goTea: function(e){
    wx.navigateTo({
      url: '/pages/consult/teacher/teacher?id='+e.currentTarget.dataset.item.id
    })
  },

  // 查询专业列表
  selYe: function(){
    var url = "/api/v1/dict/list";
    app.globalData.config(url,{dictCode: 'PROFESSION'},1).then(res=>{
      var arr = [{dictName: '不限',id: -1}];
      for(var m of res.data){
        arr.push(m);
      }
      this.setData({majorList: arr});
    });
  },

  // 查询国家
  selGuo: function(){
    var url = "/api/v1/dict/list";
    app.globalData.config(url,{dictCode: 'AREA',parentId: -1},1).then(res=>{
      var arr = [{dictName: '不限',id: -1}];
      for(var m of res.data){
        arr.push(m);
      }
      this.setData({country: arr,addrId: -1,parentId: -1});
    });
  },

  // 查询地址
  selAddr: function(){
    if(this.data.countryId != -1){
      var url = "/api/v1/dict/list";
      app.globalData.config(url,{dictCode: 'AREA',parentId: this.data.countryId},1).then(res=>{
        var arr = [{dictName: '全部',id: this.data.countryId,parentId: -1}];
        for(var m of res.data){
          arr.push(m);
        }
        this.setData({addrList: arr});
      });
    }
  },

  // 查询分类
  selFenlei: function(){
    var url = "/api/v1/icon/list";
    var params = {iconType: 1};
    app.globalData.config(url,params,1).then(res=>{
      var arr = [{iconName: '不限',id: -1}];
      res.data.length = res.data.length-1;
      for(var m of res.data){
        arr.push(m);
      }
      this.setData({fuwuList: arr});
      // 列表
      this.selList(true);
    });
  },

  // 列表
  selList: function(e){
    var data = this.data.lists;
    if(e.type == "scrolltolower"){
      if(this.data.total <= data.length){
        wx.showToast({title: '没有更多了',icon: 'none'})
        return false;
      }
    }else{
      this.setData({page: 1});
      data = [];
    }
    var url = "/api/v1/teacher/getTeacherList";
    var params = {page: this.data.page,limit: this.data.limit};
    // 服务类别
    if(this.data.index1!=-1){
      params.teacherType = this.data.index1;
    }
    // 价格
    if(this.data.index3>0){
      var arr = this.data.priceList[this.data.index3].value;
      params.priceMin = arr[0] * 100;
      params.priceMax = arr[1] * 100;
    }
    // 地区
    if(this.data.countryId!=-1 && this.data.addrId!=-1){
      params.areaId = this.data.addrId;
      params.parentId = this.data.parentId;
    }
    // 咨询方式
    if(this.data.index4!=-1){
      params.askMethodIds = this.data.index4;
    }
    // 性别
    if(this.data.index5!=-1){
      params.sex = this.data.index5;
    }
    // 专业
    if(this.data.index6!=-1){
      params.profession = this.data.index6;
    }
    app.globalData.config(url,params,1).then(res=>{
      for(var m of res.data){
        data.push(m);
      }
      this.setData({page: this.data.page++})
      this.setData({lists: data,total: res.count});
    });
  },
  
  onLoad: function (options) {
    this.setData({index1: options.id});
    // 查询服务分类
    this.selFenlei();
    // 查询咨询方式分类
    this.selType();
    // 查询专业列表
    this.selYe();
    // 查询地址列表
    this.selGuo();
  },
})
