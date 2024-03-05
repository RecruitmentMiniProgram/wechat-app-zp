const db = wx.cloud.database();
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingTip: "上拉加载更多",
    page_index: 0,
    page_size: app.globalData.page_size,
    comObj: [],
    isnull: 1,
    jobList: [],
    tabs: [{
      id: 0,
      value: "公司介绍",
      isActive: true
    },
    {
      id: 1,
      value: "职位",
      isActive: false
    }
    ],
  },

  userRegister: function () {
    wx.navigateTo({
      url: '/pages/userRegister/userRegister', // 请根据实际路径修改
    });
  },

  companyRegister: function () {
    wx.navigateTo({
      url: '/pages/companyRegister/companyRegister', // 请根据实际路径修改
    });
  },

  // 根据标题的索引来激活选中 标题数组
  changeTitleByIndex(index) {
    // 2 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // //  3 赋值到data中
    this.setData({
      tabs
    })
  },

  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
  },

  // 获取公司主页数据
  async getComDetail(comId) {
    var that = this;

    db.collection('company').doc(comId).get({
      success: function (result) {
        // console.log(result.data);
        that.setData({
          comObj: result.data
        })
      }
    })
  },
  async getComPostDetail(comId) {
    const that = this;
    const page_size = that.data.page_size;
    const page_index = that.data.page_index;

    wx.cloud.callFunction({
      name: 'jobListQuery',
      data: {
        'condition': { companyId: comId },
        'skip': page_index * page_size,
        'limit': page_size
      }
    }).then(res => {
      const jobList = res.result.data;
      if (jobList.length > 0) {
        that.setData({
          isnull: 0
        })
      }
      that.setData({
        jobList: that.data.jobList.concat(jobList),
        page_index: that.data.page_index + 1

      });
      if (jobList.length < page_size) {
        that.setData({
          loadingTip: '没有更多内容'
        });
      }
    }).catch(err => {
      console.log("failed")
    })

  },
  goToTelephone(e) {
    // console.log(e);
    // console.log(this.data.comId);

    const comId = this.data.comId
    db.collection('company').doc(comId).get({
      success: function (result) {
        const tele = result.data.tele
        wx.makePhoneCall({
          phoneNumber: tele,
          success: function () {
            console.log("拨打电话成功！");
          },
          fail: function () {
            console.log("拨打电话失败！");
          }
        });
      }
    })


  },

  login(){
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  
  async judgeOrEditChatHistory(userId, postId) {
    const db = wx.cloud.database()
    let userResult = await db.collection('user').doc(userId).get()
    var userName = userResult.data.name
    let chatResult = await db.collection('chat_history').where({user_id: userId, company_id: this.data.comId, post_id: postId}).get()
    var id = null
    if(chatResult.data.length == 0) {
      //如果没有则创建聊天项，初始化消息记录,再进入chat页面
      //读取用户头像url和企业头像url
      let userResult = null
      try{
      userResult = await db.collection('user').doc(userId).get()
      } catch(e) {
        
      }
      var userUrl = userResult.data.headUrl

      let comResult = null
      try{
        comResult = await db.collection('company').doc(job.companyId).get()
        } catch(e) {
          
        }
        var comUrl = comResult.data.logo

      var res = await  db.collection('chat_history').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          userUrl : userUrl,
          comUrl: comUrl,
          company_id: this.data.comId,
          enter_name: this.data.comObj.fullName,
          enter_red: false,
          post_id: postId,
          post_name: this.data.comObj.minName,
          user_id: userId,
          user_name: userName,
          user_red: false,
          data:[
          {
            msg:"查看简历",
            role: 4,
            time: (Date.now()/1000)
          },
          {
            msg:"电话面试",
            role: 5,
            time: (Date.now()/1000)
          }
        ]
        },
      })

      id = res._id
    } else {
      id = chatResult.data[0]._id
    }
    return id
  },

  async chatOnline(){
      var userId = this.data.userId
      //查看是否有聊天项
      var id = await this.judgeOrEditChatHistory(userId, "virtualJob")
      //如果有则直接跳转chat页面
      
      wx.navigateTo({
      url: '/pages/chat/chat?type=' + 1 + '&id=' + id,
    });
  },

  onShareAppMessage: function (res) {
    console.log("click")
    return {
      title: '企业分享',
      path: '/pages/company_home/index?comId=' + this.data.comId
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.comId = wx.getStorageSync('comId');
    // console.log("onload:", options);
    this.getComDetail(options.comId);
    this.getComPostDetail(options.comId);
    var status = wx.getStorageSync('status')
    var userId = wx.getStorageSync('userId')
    this.setData({
      "status": status,
      "comId": options.comId,
      "userId": userId
    })
  }
})