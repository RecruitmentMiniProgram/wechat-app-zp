// pages/join_group/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onButtonClick: function () {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    //可见的聊天列表
     const db = wx.cloud.database()
     let groupResult = await db.collection('join_group').get()
    
     if(groupResult.data.length == 0) return
     var data = groupResult.data[0]
     this.setData({data: data})
  },
  //预览图片，放大预览
  preview(event) {
    wx.previewImage({
      current: this.data.data.img,
      urls:[this.data.data.img]
  })
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})