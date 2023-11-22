
 function ChatData(nickname, lastMessage, lastMessageTime)
 {
   this.nickname = nickname;
   this.lastMessage = lastMessage;
   this.lastMessageTime = lastMessageTime;
 }
 function addLeadingZero(number) {
  return number < 10 ? `0${number}` : number;
}

function convertUnixTimestampToString(unixTimestamp) {
  const now = new Date();
  const date = new Date(unixTimestamp * 1000); // 将Unix时间戳转换为毫秒

  // 如果a的时间在今天
  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    const hours = addLeadingZero(date.getHours());
    const minutes = addLeadingZero(date.getMinutes());
    return `${hours}:${minutes}`;
  }

  // 如果不在今天，且在同一年
  if (date.getFullYear() === now.getFullYear()) {
    const month = addLeadingZero(date.getMonth() + 1); // 月份是从0开始的，所以要加1
    const day = addLeadingZero(date.getDate());
    return `${month}-${day}`;
  }

  // 如果不在同一年
  return date.getFullYear().toString();
}

Page({
  /**
   * 生命周期函数--监听页面加载(获取用户的微信信息)
   */
  data: {
    
  },

  goToChat: function (event) {
    const index = event.currentTarget.dataset.index;
    const chat = this.data.chatList[index];
    // 根据聊天信息跳转到相应的聊天页面，你需要传递聊天相关的参数
    wx.navigateTo({
      url: '/pages/chat/chat?targetUserId=' + chat.targetUserId,
    });
  },

  async onLoad() {
    var isLogin = false
    try{
      var status = wx.getStorageSync('status')
      status = 1
      if(status == 0 || status == null) {
        isLogin = false;
        //未登录
        this.setData({
          login: false,
        });
      } else {
        isLogin = true;
        //登录
        this.setData({
          login: true,
        });
      }
    }catch (e) {
      console.log('读取session发生错误' + e)
    }
    
    //如果登录，则初始化消息列表
    if(isLogin) {
      var userId = wx.getStorageSync('userId')
      userId = 'BeJson'

      const db = wx.cloud.database()
      let chatListResult = await db.collection('chat_list').where({user_id: userId}).get()
      if(chatListResult.data.length == 0) return

      var dbList = chatListResult.data[0].data
      var chatList = new Array()
      var index = 0
      for (let i = 0; i < dbList.length; i++) {
          var data = dbList[i]
          var type = data.type
          var id = data.id
          if(type == 0) {
              //优质企业推送,读取推荐历史
              let userEnterResult = await db.collection('user_enter_history').where({user_id: userId}).get()
              if(userEnterResult.length == 0) return

              var enters = userEnterResult.data[0].data
              var lastEnter = enters[enters.length - 1]
              var updateTime = lastEnter.time 
              var nickname = '岗位推荐'
              var postId = lastEnter.post_id

              //读取岗位细节
              let postResult = await db.collection('post').doc(postId).get()
              var entername = postResult.data.name
              var chatData = new ChatData(nickname, entername, convertUnixTimestampToString(updateTime))
              chatList[index] = chatData
              index = index + 1;
          } else {
            //消息, 通过id读取消息记录
            let chatResult = await db.collection('chat_history').doc(id).get()
            var chatDetail = chatResult.data
            var time = chatDetail.data[chatDetail.data.length - 1].time

            var chatData = new ChatData(chatDetail.post_name, chatDetail.enter_name, convertUnixTimestampToString(time))
            chatList[index] = chatData
            index = index + 1;
          }
      }
      console.log(chatList)
      this.setData({
        chatList: chatList
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