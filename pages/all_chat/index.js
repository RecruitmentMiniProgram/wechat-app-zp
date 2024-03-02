// pages/all_chat/index.js
function ChatData(id,type,nickname, lastMessage, lastMessageTime, red, url)
 {
   this.id = id;
   this.type = type;
   this.nickname = nickname;
   this.lastMessage = lastMessage;
   this.lastMessageTime = lastMessageTime;
   this.red = red
   this.url = url
 }
 function addLeadingZero(number) {
  return number < 10 ? `0${number}` : number;
}

function truncateString(str, maxLength) {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + "...";
  } else {
    return str;
  }
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
   * 页面的初始数据
   */
  data: {

  },

  goToChat: function (event) {
    const index = event.currentTarget.dataset.index;
    const chat = this.data.chatList[index];
    chat.red = false
    this.setData({
      chatList: this.data.chatList
    })
    // 根据聊天信息跳转到相应的聊天页面，你需要传递聊天相关的参数

    wx.navigateTo({
      url: '/pages/chat/chat?type=' + chat.type + '&id=' + chat.id,
    });
  },

  async initChatList(id, that) {
    var status = that.data.status
    if(status == 1) {
   
      var userId = id

      const db = wx.cloud.database()
      let chatListResult = await db.collection('chat_history').where({user_id: userId}).get()
      if(chatListResult.data.length == 0) return
      
      var dbList = chatListResult.data
      var chatList = new Array()
      var index = 0

      for (let i = 0; i < dbList.length; i++) {
           var chatDetail = dbList[i]
            var time = chatDetail.data[chatDetail.data.length - 1].time
            var red = chatDetail.user_red
            //根据企业ID读取企业头像
          /*  var companyId = chatDetail.company_id
            let companyResult = null 
            try{
            companyResult = await db.collection('company').doc(companyId).get()
            } catch(e) {
              continue
            }*/
            var url = chatDetail.comUrl
            var chatData = new ChatData(chatDetail._id, 1,chatDetail.post_name, chatDetail.enter_name, convertUnixTimestampToString(time), red, url)
            chatList[index] = chatData
            index = index + 1;
      }

      that.setData({
        chatList: chatList
      })
  } else {
    //企业用户
      var userId = id
      const db = wx.cloud.database()
      let chatListResult = await db.collection('chat_history').where({company_id: userId}).get()
      if(chatListResult.data.length == 0) return
 
      var dbList = chatListResult.data
      var chatList = new Array()
      var index = 0
      
      for (let i = 0; i < dbList.length; i++) {
          var chatDetail = dbList[i]
          console.log(chatDetail)
          var lastData = chatDetail.data[chatDetail.data.length - 1]
          var time = lastData.time
          var lastMsg = lastData.msg
          var name = chatDetail.user_name
          var red = chatDetail.enter_red

           //根据用户ID读取企业头像
           var userId = chatDetail.user_id

        /*   let userResult = null
           try {
            userResult = await db.collection('user').doc(userId).get()
           } catch(e) {
             continue
           }
*/
           var url = chatDetail.userUrl
           
          var chatData = new ChatData(chatDetail._id, 1, name, truncateString(lastMsg, 14), convertUnixTimestampToString(time), red, url)
          chatList[index] = chatData
          index = index + 1;
      }

      that.setData({
        chatList: chatList
      })
  }
  },

  //读取对应id所有消息记录并显示
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
      this.setData({load: false})
      
      wx.showLoading({
        title: '加载中...',
        mask: true, // 是否显示透明蒙层，防止触摸穿透
      });
      var id = options.id
      var status = wx.getStorageSync('status')
      this.setData({
        id: id,
        status: status
      })
      await this.initChatList(id, this)
      
      wx.hideLoading();
      this.setData({load:true})
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