var app = getApp()
const db=wx.cloud.database()
const _=db.command
/**
用户:
岗位推荐跳转
没有消息时图片
发消息时创建列表
*//
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

function PostInfo(name, time)
{
    this.name = name;
    this.time = time;
}

function MsgInfo(role, msg, time) {
  this.role = parseInt(role, 10);
  this.msg = msg;
  this.time = parseInt(time, 10);
}

function ChatInfo(id, type, time) {
  this.id = id
  this.type = parseInt(type, 10)
  this.time = parseInt(time, 10)
}

var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;

let intervalId;

Page({
  data: {
    scrollHeight:  88 + "vh",
    msgList: []
  },
  /**
   * 生命周期----显示页面
   */
  onShow:function(e){
  },

  onButtonClick: function(e) {
    const params = e.currentTarget.dataset;
    var role = params.role
    console.log(params)
    if(role == 3) {
      //用户点击，跳转到岗位介绍页面
      wx.navigateTo({
        url: '/pages/job_details/index?jobId=' + this.data.postId,
      });
    } else if(role == 4) {
       //企业点击，跳转到用户简历界面
       var userId = this.data.userId
       wx.navigateTo({
        url: '/pages/show_resume/show_resume?userId=' + userId,
      });
    }
  },

  /**
   * 生命周期加载页面
   */
  async onLoad(options) {
    //1-用户 2-企业 3-特殊
    var status = wx.getStorageSync('status')
  //  status = 1

    var that = this
    var type = options.type;
    var id = options.id;
    //聊天类型 0-系统推送， 1-用户企业聊天
    this.setData({type: type})
    this.setData({id: id})
    this.setData({status: status})

    const db = wx.cloud.database()
    if(type == 0) {
        wx.setNavigationBarTitle({
          title: '岗位推荐'
        });

        var postLists = new Array();
        var index = 0;
        //优质企业推送,读取推荐历史
        let userEnterResult = await db.collection('user_enter_history').doc(id).get()
        if(userEnterResult.length == 0) return

        var enters = userEnterResult.data.data
        for(let i = 0; i < enters.length; ++ i) {
          var postId = enters[i].post_id;
          //读取岗位细节
          let postResult = await db.collection('post').doc(postId).get()
          var postInfo = postResult.data;
          var rdata = new PostInfo(postInfo.name, convertUnixTimestampToString(enters[i].time));
          postLists[index] = rdata;
          index ++;
        }
        this.setData({
          postList: postLists,
          toBView: 'msg-' + (postLists.length - 1)
        })
    } else {
      var chatList = new Array();
      var index = 0;
      
      let chatHistory = await db.collection('chat_history').doc(id).get()
      if(chatHistory.length == 0) return

      var chatData = chatHistory.data
      if(status == 1) {
          wx.setNavigationBarTitle({
            title: chatData.post_name
          }); 
      } else {
         wx.setNavigationBarTitle({
          title: chatData.user_name
        }); 
      }
      this.setData({
        _id: chatData._id,
        msgList: chatData.data,
        toView: 'msg-' + (chatData.data.length - 1),
        companyId: chatData.company_id,
        userId: chatData.user_id,
        postId: chatData.post_id
      })
      
      intervalId = setInterval(async function() {
        let chatHistory = await db.collection('chat_history').doc(id).get()
        if(chatHistory.length == 0) return
        var chatData = chatHistory.data
        if(chatData.data.length > that.data.msgList.length) {
          that.setData({
            msgList: chatData.data,
            toView: 'msg-' + (chatData.data.length - 1)
          })
        }
      }, 2000);
    }
  },

  /**
   * 获取聚焦
   */
  focus: function(e) {
    var keyHeight = e.detail.height;
    this.setData({
      scrollHeight: 100 * ((0.9 * windowHeight - keyHeight)/windowHeight) + 'vh'
    });

    this.setData({
      toView: 'msg-' + (this.data.msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
  },

  //失去聚焦(软键盘消失)
  blur: function(e) {
    this.setData({
      scrollHeight: '88vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (this.data.msgList.length - 1)
    })
  },

  // 离开聊天记录页面时触发
  async onHide() {
   
  },
   /**
   * 生命周期函数--监听页面卸载
   */
  async onUnload() {
      clearInterval(intervalId);

      var status = this.data.status
      const db = wx.cloud.database()
      if(status == 1) {
          await db.collection('chat_history').doc(this.data.id).update({
            data:{
              user_red: false
            }
          })
      } else {
          await db.collection('chat_history').doc(this.data.id).update({
            data:{
              enter_red: false
            }
          })
      }
  },

  async updateChatList(id) {
       //读取后插入新消息列表
       var chatListResult = await db.collection('chat_list').where({user_id: id}).get()
       if(chatListResult.data.length == 0) return
       var dbList = chatListResult.data[0].data
       var _id = this.data._id
       var index = -1
       for(let i = 0; i < dbList.length; ++ i) {
         if(dbList[i].id == _id) {
           index = i
           break
         }
       }
       if(index != -1) dbList.splice(index, 1)
       var chatInfo = new ChatInfo(_id, 1, (Date.now()/1000))
       dbList.unshift(chatInfo)
 
       await db.collection('chat_list').where({user_id: id}).update({
         data:{
           data: dbList
         }
       })
  },
  async sendClick(e) {
     var status = this.data.status

    //写消息时将消息栏自动置顶到对应用户列表中
    var msgInfo = new MsgInfo(this.data.status, e.detail.value, (Date.now()/1000))
    //更新数据库
    const db = wx.cloud.database()
    const _ = db.command
    // 更新聊天数据
    if(status == 1) {
        await db.collection('chat_history').doc(this.data.id).update({
          data:{
            data: _.push(msgInfo),
            enter_red: true
          }
        })
    } else {
        await db.collection('chat_history').doc(this.data.id).update({
          data:{
            data: _.push(msgInfo),
            user_red: true
          }
        })
    }

      //更新对方消息栏
      var id = null
      if(status == 1) {
        id = this.data.companyId
      } else {
        id = this.data.userId
      }
      this.updateChatList(id)
     

      //更新自己的消息栏
      var id = null
      if(status == 1) {
        id = this.data.userId
      } else {
        id = this.data.companyId
      }
      this.updateChatList(id)

    //更新缓存
    var list = this.data.msgList
    list.push(msgInfo)
    this.setData({
      msgList: list,
      inputVal: "",
      toView: "msg-" + list.length - 1
    })
  },
})

