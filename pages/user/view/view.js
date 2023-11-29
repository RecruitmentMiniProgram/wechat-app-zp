// pages/view/view.js
const db=wx.cloud.database()
const _=db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {}, // 存储表单数据的对象
    // 服务热线的样式
    display: "fixed",
    height: "188rpx"
  },
  formSubmit(e){
    const formData = e.detail.value;
    formData["status"]=wx.getStorageSync('status')
    console.log('表单数据：', e.detail);
    // 可以将数据保存到页面数据中
    this.setData({
      formData: formData,
    });
    db.collection("views").add({
      data:formData
    }).then(res=>{
      wx.navigateBack()
      console.log("意见反馈成功")
    })
  },
  onLoad(){
    var that = this;
    var screenHeight, heights
    wx.getSystemInfo({
      success: function (res) {
        screenHeight = res.screenHeight
      }
    });
    //创建节点选择器
    var query = wx.createSelectorQuery();
    query.select('.main').boundingClientRect()
    query.exec(function (res) {
      //res就是 所有标签为xxxx的元素的信息 的数组
      // console.log(res);
      //取高度
      heights = res[0].height;
      if (screenHeight - heights <= 124) {
        that.setData({
          display: '',
          height: "188rpx"
        })
      } else {
        that.setData({
          display: 'fixed',
          height: "88rpx"
        })
      }
    })
  }
})