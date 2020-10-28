var app = getApp();

Component({
  properties: {
    has_back: {//是否存在功能键
      type: Boolean,
      value: true,
    },
    title: {//标题内容
      type: String,
      value: '',
    },
    type: {//标题类型(1是黑色,2是白色)
      type: String,
      value: "1"
    },
    opacity: {//背景透明度(当背景透明度为0的时候,不需要占位)
      type: String,
      value: "1"
    },
  },
  data: {
    // 这里是一些组件内部数据
    statusH: app.globalData.barheight,// 状态栏高度
    titleH: app.globalData.titleH,// 标题栏高度
  },
  methods: {
    // 返回上一页
    goBack: function(){
      if(getCurrentPages().length == 1){
        wx.switchTab({url:"/pages/question/question"});
      }else{
        wx.navigateBack({});
      }
    }
  },
  ready(){
    
  },
})
