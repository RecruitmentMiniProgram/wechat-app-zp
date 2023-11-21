Page({
  /**
   * 生命周期函数--监听页面加载(获取用户的微信信息)
   */
  data: {
    login: false
  },
  onLoad: function () {
    try{
      var session = wx.getStorageSync('user')
      if(session == null || session == 'undefined') {
        //未登录
        this.login = false
      } else {
        //登录
        this.login = true;
      }
    }catch (e) {
      console.log('读取session发生错误')
    }
  },

  onLoginButtonClick: function () {
    wx.navigateTo({
      url: '/pages/second/second'
    });
  }

  /**
   * 生命周期函数--监听页面初次渲染完成（以用户微信头像为条件获取用户的姓名）
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
})