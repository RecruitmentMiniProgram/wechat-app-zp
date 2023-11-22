var app = getApp()

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

var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;

Page({
  data: {
    scrollHeight: '100vh',
  },
  /**
   * 生命周期----显示页面
   */
  onShow:function(e){
  },
  /**
   * 生命周期加载页面
   */
  async onLoad(options) {
    var type = options.type;
    var id = options.id;
    //聊天类型 0-系统推送， 1-用户聊天
    this.setData({type: type})
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
        this.setData({postList: postLists})
    } else {
      var chatList = new Array();
      var index = 0;

      let chatHistory = await db.collection('chat_history').doc(id).get()
      if(chatHistory.length == 0) return
      var chatData = chatHistory.data
      wx.setNavigationBarTitle({
        title: chatData.post_name
      });
      this.setData({
        msgList: chatData.data
      })
    }
  
  },
 
  /**
   * 获取聚焦
   */
  focus: function(e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
  },

  //失去聚焦(软键盘消失)
  blur: function(e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })
  },
})