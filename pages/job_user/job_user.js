
// pages/job_user.js
const db=wx.cloud.database()
const _=db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onMoreConfirm(e) {
    this.selectComponent('#moreInfo').hideFrame();
    console.log(e)
    var jobs = e.detail.result.jobs
    if(jobs.length == 0) {
      this.setUserInfoByPostId(this.data.total)
      return
    }
    for(let i = 0; i < jobs.length; ++ i) {
        if(jobs[i]=="全部") {
          this.setUserInfoByPostId(this.data.total)
          return
        }
    }

    this.setUserInfoByPostId(jobs)
  },

  onTextClick(event) {
    //读取所有该公司岗位数据
    var dbList = this.data.posts
    var postNum = dbList.length + 1
    var typeNum = Math.ceil(postNum/3)
    const newData = [
      { type: 0, id: 0, text:['职位']},
    ]
    for(let i = 0; i < typeNum; ++ i) {
      newData.push({type:1, id:0, text:['','','']})
    }
    newData[1].text[0] = '全部'
    var row = 1
    var col = 1
    for(let i = 0; i < dbList.length; ++ i) {
      var name = dbList[i].name
      newData[row].text[col] = name
      col = col + 1
      if (col >= 3) {
        row = row + 1
        col = 0
      }
    }

    //检查最后一行
    var lastList = newData[newData.length - 1].text
    if(lastList[1] == '' && lastList[2] == '') {
      lastList.pop()
      lastList.pop()
    }
    
    //渲染筛选框
    const moreInfo = this.selectComponent('#moreInfo');
    const frameTitle = "分类"
    const newTitle = ["jobs"]
    moreInfo.updateData(frameTitle, newTitle, newData)
    moreInfo.showFrame();
  },

  goToChat: function (event) {
    var index = event.currentTarget.dataset.index;
    const parts = index.split("-");
    console.log(index)
    var uid = parts[0]
    var pid = parts[1]
    var list = this.data.resumeList
    console.log(list)
    var cid = ''
    //获取岗位名字，找到对应用户记录，修改已读
    var name = parts[2]
    var userList = this.data.postUser.get(name)
    var mp = this.data.postUser
    for(let i = 0; i < userList.length; ++ i) {
      if(userList[i]._id == uid) {
         userList[i].read = true;
         this.data.postUser.set(name, userList)
         console.log(this.data)
         this.setData({"postUser": mp})
         this.setUserInfoByPostId(this.data.curId)
         console.log(this.data)
         break;
      }
    }

    for(let i = 0; i < list.length; ++ i) {
      if(list[i].user_id == uid && list[i].post_id == pid) {
        cid = list[i].chat_id
        // 简历已经被阅读
        db.collection("resume").where({
          "user_id":uid,
          "post_id":pid
        }).update({
          data:{
            "read":true
          }
        })
        break
      }
    }
    var url = '/pages/chat/chat?type=' + '1' + '&id=' + cid
    console.log(url)
    wx.navigateTo({
      url: url,
    });
    // 根据聊天信息跳转到相应的聊天页面，你需要传递聊天相关的参数
    
  },

  async initResumeList(id, that) {
      var userId = id
      const db = wx.cloud.database()
      let chatListResult = await db.collection('resume').where({company_id: userId}).get()
      if(chatListResult.data.length == 0) return

      that.setData({
        resumeList: chatListResult.data
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */

  async onLoad(options) {
    wx.setNavigationBarTitle({
      title: '投递记录'
    });
    this.setData({"companyId": options.companyId});
    var that = this
    var cid = that.data.companyId;

    this.setData({load: false})
      wx.showLoading({
        title: '加载中...',
        mask: true, // 是否显示透明蒙层，防止触摸穿透
      });

    //获取所有岗位
    const db = wx.cloud.database()
    let chatListResult = await db.collection('post').where({companyId:cid}).get()
    if(chatListResult.data.length == 0) return
    var dbList = chatListResult.data
    this.setData({"posts": dbList})
    console.log(dbList)
    //获取全部岗位投递记录
    var totalPost = []
    let postUserMap = new Map();
    for(let i = 0; i < dbList.length; ++ i) {
      var postId = dbList[i]._id;
      totalPost.push(dbList[i].name)
      let postListResult = await db.collection('resume').where({post_id: postId}).get()
      if(postListResult.data.length == 0) {
        postUserMap.set(dbList[i].name, [])
        continue
      }
      this.setData({"total": totalPost})
      
      var userInfos = []
      var postList = postListResult.data
      console.log(postList)
      const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
      for(let j = 0; j < postList.length; ++ j) {
          try {
          var uid = postList[j].user_id
          let userListResult = await db.collection('user').doc(uid).get()
          if(userListResult.length == 0) {
            continue
          }

          userListResult.data.postId = postList[j].post_id
          userListResult.data.read = postList[j].read
          userListResult.data.postName = dbList[i].name
          userListResult.data.retime = postList[j].createTime.toLocaleDateString('zh-CN', options);
          userInfos.push(userListResult.data)
        } catch (e) {
          continue
        }
      }
      postUserMap.set(dbList[i].name, userInfos)
  
    }
    this.setData({"postUser" : postUserMap})

    this.setUserInfoByPostId(totalPost)
    await this.initResumeList(cid, that)
    wx.hideLoading();
    this.setData({load:true})
  },

  setUserInfoByPostId(postIds) {
    this.setData({"curId": postIds})
     var curUserInfo = []
     for(let i = 0; i < postIds.length; ++ i) {
       var users = this.data.postUser.get(postIds[i])
       for(let j = 0; j < users.length; ++ j) {
         curUserInfo.push(users[j]);
       }
     }
     console.log(curUserInfo)

     this.setData({"curList": curUserInfo})
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