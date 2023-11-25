
/**
 * 消息红点：
 * 未点击聊天页面有红点
 * 点击聊天页面或本来就在聊天中红点消失
 
 * 发送消息时顺便设置红点
 * 聊天页面退出时消红点
 * 
 *  */

let intervalId;
 function ChatData(id,type,nickname, lastMessage, lastMessageTime, red)
 {
   this.id = id;
   this.type = type;
   this.nickname = nickname;
   this.lastMessage = lastMessage;
   this.lastMessageTime = lastMessageTime;
   this.red = red
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
   * 生命周期函数--监听页面加载(获取用户的微信信息)
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

  showDeleteConfirm: function (e) {
    var that = this
    let index = e.currentTarget.dataset.index;
    wx.showModal({
       title: '是否删除该聊天',
    //  content: '是否删除该聊天',
      success: async (res) => {
        if (res.confirm) {
          //删除数据库
          var userId = null
          if(this.data.status == 1) userId = wx.getStorageSync('userId')
          else userId = wx.getStorageSync('companyId')
          
          const db = wx.cloud.database()
          let chatListResult = await db.collection('chat_list').where({user_id: userId}).get()
          if(chatListResult.data.length == 0) return
          var dbList = chatListResult.data[0].data
          dbList.splice(index, 1)
         await db.collection('chat_list').where({user_id: userId}).update({
            data:{
              data: dbList
            }
          })

          //删除缓存
          var newList = that.data.chatList
          newList.splice(index, 1)
          that.setData({
            chatList: newList
          })
        }
      },
    });
  },

  async onLoad() {
    var that = this
    var isLogin = false
    var status = wx.getStorageSync('status')
    this.setData({status: status})

    try{
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
        if(status == 1) {
            var userId = wx.getStorageSync('userId')
            this.setData({userId: userId})

            const db = wx.cloud.database()
            let chatListResult = await db.collection('chat_list').where({user_id: userId}).get()
            if(chatListResult.data.length == 0) return

            var dbList = chatListResult.data[0].data
            var chatList = new Array()
            var index = 0
            if(dbList.length != 0) {
              this.setData({
                newTime: dbList[0].time
              })
            }

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
                    var chatData = new ChatData(id, type,nickname, entername, convertUnixTimestampToString(updateTime))
                    chatList[index] = chatData
                    index = index + 1;
                } else {
                  //消息, 通过id读取消息记录
                  let chatResult = await db.collection('chat_history').doc(id).get()
                  var chatDetail = chatResult.data
                  var time = chatDetail.data[chatDetail.data.length - 1].time
                  var red = chatDetail.user_red
                  var chatData = new ChatData(id, type,chatDetail.post_name, chatDetail.enter_name, convertUnixTimestampToString(time), red)
                  chatList[index] = chatData
                 
                  index = index + 1;
                }
            }

            this.setData({
              chatList: chatList
            })
        } else {
          //企业用户
          var userId = wx.getStorageSync('companyId')
          this.setData({userId: userId})
          
            //可见的聊天列表
            const db = wx.cloud.database()
            let chatListResult = await db.collection('chat_list').where({user_id: userId}).get()
            if(chatListResult.data.length == 0) return

            var dbList = chatListResult.data[0].data
            var chatList = new Array()
            var index = 0

            if(dbList.length != 0) {
              this.setData({
                newTime: dbList[0].time
              })
            }

            for (let i = 0; i < dbList.length; i++) {
                var data = dbList[i]
                var id = data.id
                var type = data.type
                if(type == 0) continue

                //消息, 通过id读取消息记录
                let chatResult = await db.collection('chat_history').doc(id).get()
                var chatDetail = chatResult.data
                var lastData = chatDetail.data[chatDetail.data.length - 1]
                var time = lastData.time
                var lastMsg = lastData.msg
                var name = chatDetail.user_name
                var red = chatDetail.enter_red

                var chatData = new ChatData(id, type, name, truncateString(lastMsg, 14), convertUnixTimestampToString(time), red)
                chatList[index] = chatData
                index = index + 1;
            }

            this.setData({
              chatList: chatList
            })
        }

        var that = this
        //用户启动监听，如果消息列表发生变化则刷新
        intervalId = setInterval(async function() {
            var userId = that.data.userId
          
            //可见的聊天列表
            const db = wx.cloud.database()
            let chatListResult = await db.collection('chat_list').where({user_id: userId}).get()
            if(chatListResult.data.length == 0) return

            var dbList = chatListResult.data[0].data
            if(dbList.length == 0) return
            if(that.data.chatList.length == 0 ||
               that.data.newTime < dbList[0].time) {
              if(status == 1) {
                const db = wx.cloud.database()
                var chatList = new Array()
                var index = 0
                if(dbList.length != 0) {
                  that.setData({
                    newTime: dbList[0].time
                  })
                }
    
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
                        var chatData = new ChatData(id, type,nickname, entername, convertUnixTimestampToString(updateTime))
                        chatList[index] = chatData
                        index = index + 1;
                    } else {
                      //消息, 通过id读取消息记录
                      let chatResult = await db.collection('chat_history').doc(id).get()
                      var chatDetail = chatResult.data
                      var time = chatDetail.data[chatDetail.data.length - 1].time
                      var red = chatDetail.user_red
                      var chatData = new ChatData(id, type,chatDetail.post_name, chatDetail.enter_name, convertUnixTimestampToString(time), red)
                      chatList[index] = chatData
                      index = index + 1;
                    }
                }
    
                that.setData({
                  chatList: chatList
                })
               } else {
              //企业用户
                //可见的聊天列表
                var chatList = new Array()
                var index = 0
    
                if(dbList.length != 0) {
                  that.setData({
                    newTime: dbList[0].time
                  })
                }
    
                for (let i = 0; i < dbList.length; i++) {
                    var data = dbList[i]
                    var id = data.id
                    var type = data.type
                    if(type == 0) continue
    
                    //消息, 通过id读取消息记录
                    let chatResult = await db.collection('chat_history').doc(id).get()
                    var chatDetail = chatResult.data
                    var lastData = chatDetail.data[chatDetail.data.length - 1]
                    var time = lastData.time
                    var lastMsg = lastData.msg
                    var name = chatDetail.user_name
                    var red = chatDetail.enter_red
                    var chatData = new ChatData(id, type, name, truncateString(lastMsg, 14), convertUnixTimestampToString(time), red)
    
                    chatList[index] = chatData
                    index = index + 1;
                }
    
                that.setData({
                  chatList: chatList
                })
               }
            }
        }, 2000);
    }
  },

 
  onLoginButtonClick: function () {
    wx.navigateTo({
      url: '/pages/login/login'
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
    clearInterval(intervalId);
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