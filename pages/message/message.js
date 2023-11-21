Page({
  /**
   * 生命周期函数--监听页面加载(获取用户的微信信息)
   */
  data: {
    chatList: [
      {nickname: 'User1', lastMessage: 'Hello!', lastMessageTime: '2023-11-21 12:00' },
      {nickname: 'User2', lastMessage: 'Hi there!', lastMessageTime: '2023-11-21 12:30' },
      {nickname: 'User1', lastMessage: 'Hello!', lastMessageTime: '2023-11-21 12:00' },
    ],
  },

  goToChat: function (event) {
    const index = event.currentTarget.dataset.index;
    const chat = this.data.chatList[index];
    // 根据聊天信息跳转到相应的聊天页面，你需要传递聊天相关的参数
    wx.navigateTo({
      url: '/pages/chat/chat?targetUserId=' + chat.targetUserId,
    });
  },

  onLoad: function () {
    try{
      var status = wx.getStorageSync('status')
      status = 1
      if(status == 0 || status == null) {
        //未登录
        this.setData({
          login: false,
        });
      } else {
        //登录
        this.setData({
          login: true,
        });
      }
    }catch (e) {
      console.log('读取session发生错误' + e)
    }
    
    //如果登录，则初始化消息列表
    if(this.login) {
      var userId = wx.getStorageSync('userId')
      const condition = {
        // 这里可以设置你的查询条件
        // 例如，假设要查询年龄大于等于18的用户
        user_id: db.command.wq(userId),
      };

      db.collection('chat_list').where(condition).get({
        success: res => {
          this.setData({
            dataList: res.data
          })
        },
        fail: err => {
          console.error('从数据库中读取数据失败：', err)
        }
      })
    }
  },

  onLoginButtonClick: function () {
    wx.navigateTo({
      url: '/pages/second/second'
    });
  },

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