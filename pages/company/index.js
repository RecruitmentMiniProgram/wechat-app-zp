// pages/company/index.js
const db=wx.cloud.database()
const _=db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initChatInfo()
  },

  async initChatInfo() {
    //初始化聊天信息
    var id = wx.getStorageSync("companyId")
    var chatListResult = await db.collection('chat_list').where({user_id: id}).get()
    if(chatListResult.data.length == 0) {
      await  db.collection('chat_list').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          user_id: id,
          data:[]
        },
      })
    }
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