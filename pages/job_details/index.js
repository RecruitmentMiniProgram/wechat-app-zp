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

import { request } from "../../requests/index.js";
const httputil = require("../../utils/httputil.js") //一定要引入，根据你自己写的上传文件路径
var out_photo = "";
const db = wx.cloud.database();
Page({

    data: {
        submit_stat: "立即投递",
        photo: "",
        goodsObj: {},
        jobObj: {},
        similarJobs: [],
        // jobId: 'a72823ff655d6d7f0034c3f07e2d18c8',
        // 先在这个页面单独测试
        jobId: {}, 
        jobType:'',
        // 商品是否被收藏过
        isCollect: false,
        click: false, //是否显示弹窗内容
        option: false, //显示弹窗或关闭弹窗的操作动画
        resumeUrl: {}, // 简历的相关信息
        resumeTime: {},
        resumeName: '',
        isLogin: false
    },
    // 发送投递简历
    Userdeliver: {
        fromUserId: '',
        toHrId: '',
        resumeUrl: '',
        jobId:''
    },
    // 工作信息全局对象
    jobInfoStorage: {},
    onLoad: function (options) {
      var status = wx.getStorageSync('status')
     // status = 1
      var userId = wx.getStorageSync('userId')
     // userId = 'a72823ff655c97f60024736e3cc48fed'
      this.setData({
        status: status,
        userId: userId
      })

      // console.log(options)
      this.setData({
          jobId: options.jobId,
          // jobType:options.jobType
      });
     // this.setData({jobId: "a72823ff655d6d7f0034c3f07e2d18c8"})
      this.getJobDetail(this.data.jobId);
      // this.incrementScore(this.data.jobId);
      // this.getSimilarJobDetail(this.data.jobId,this.data.jobType);
    },

    // 职位被浏览，发送增浏览权值 TODO
    async incrementScore(jobId){
        // const result = await request({ url: "/own/home/addJobScore", data: {jobId} });
        console.log("增加了职位权重")
    },

    // 第一种动态设置高度的方法是：需要一个容器为背景色（灰色区域），一个容器为弹窗内容（粉红色区域），两者是独立的，实现的原理是一样的；粉红色区域的话，就是设置好绝对位置（在屏幕的底部）和默认内容的区域样式，动态设置内容区域的高度，比如弹出：一开始高度为0（隐藏了），通过animation设置的动画时间，将高度从0到指定高度，内容慢慢就会显示了，然后保留最后一帧的动画样式就行了；收缩也是一样的道理。
    // 用户点击显示弹窗，点击选择简历
    clickPup: function () {
        let _that = this;
        // 是否点击弹窗
        if (!_that.data.click) {
            _that.setData({
                click: true,
            })
        }
        // 弹窗的开闭效果
        if (_that.data.option) {
            _that.setData({
                option: false,
            })
            // 关闭显示弹窗动画的内容，不设置的话会出现：点击任何地方都会出现弹窗，就不是指定位置点击出现弹窗了
            setTimeout(() => {
                _that.setData({
                    click: false,
                })
            }, 500)
        } else {
            _that.setData({
                option: true
            })
        }
    },
  

   
    // 获取职位详情数据
    async getJobDetail(jobId) {
      var that = this;
      db.collection('post').doc(jobId).get({
        success:function(res){
          that.jobInfoStorage = res.data;
          const company_id = res.data.companyId;
          const companyPromise = db.collection('company').doc(company_id).get();
          companyPromise.then(companyRes=>{
            res.data.company = companyRes.data; 
            that.setData({
                jobObj: res.data,
            });
          })
        }
      });
    },
    // 判断该职位是否在缓存数组中
    hasSendJob() {
        // 1 获取缓存中的发送简历的数组
        let hasSendJobs = wx.getStorageSync("hasSendJobs") || [];
        // 判断当前职位是否已发送过
        // console.log(this.jobInfoStorage.jobId)
        let isSubmit = hasSendJobs.some(v => v.jobId === this.jobInfoStorage.jobId);
        // console.log("是否已投递")
        // console.log(isSubmit)
        if (isSubmit) {
            this.setData({
                submit_stat: '已投递'
            })
        }
    },
    // 获取相似职位详情数据
    // async getSimilarJobDetail(jobId) {
    //     const { isSimilar } = "1";
    //     const result = await request({ url: "/home/jobdata", data: { jobId, isSimilar } });
    //     this.setData({
    //         similarJobs: result.list
    //     })
    // },
    // 点击轮播图 放大预览
    handlePreviewImage(e) {
        // 1 先构造要预览的图片数组
        const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
        // 2 接受传递过来的图片url
        const current = e.currentTarget.dataset.url;
        wx.previewImage({
            current,
            urls,
            success: (result) => {
            },
            fail: () => { },
            complete: () => { }
        });

    },

    async updateChatList(id, _id) {
      //读取后插入新消息列表
      var chatListResult = await db.collection('chat_list').where({user_id: id}).get()
      if(chatListResult.data.length == 0) return
      var dbList = chatListResult.data[0].data
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

    //企业登录不显示下栏
    //用户未登录，不显示聊天按钮，按钮提示登录
    async submitResume() {
        var userId = this.data.userId
        var status = this.data.status
        if(status == 0) {
          //跳转到登录页面
          wx.navigateTo({
            url: '/pages/login/login'
          });
        } else {
          //判断是否有消息，没有则创建
          var id = await this.judgeOrEditChatHistory(userId, this.data.jobId)
          //有则发送投递简历消息
          var msg ="您好，我非常希望能够得到这个岗位的面试机会，如果岗位还有空缺，希望能得到机会，感谢。"
          //写消息时将消息栏自动置顶到对应用户列表中
          var msgInfo = new MsgInfo(1, msg, (Date.now()/1000))
          //更新数据库
          const db = wx.cloud.database()
          const _ = db.command
          // 更新聊天数据
          await db.collection('chat_history').doc(id).update({
                data:{
                  data: _.push(msgInfo),
                  enter_red: true
                }
          })

            //更新对方消息栏
            var uid = this.data.jobObj.companyId
            this.updateChatList(uid, id)
            //更新自己的消息栏
            var uuid = this.data.userId
            this.updateChatList(uuid, id)

            wx.navigateTo({
              url: '/pages/chat/chat?type=' + 1 + '&id=' + id,
            });
        }
    },
    
    async judgeOrEditChatHistory(userId, postId) {
      const db = wx.cloud.database()
      let userResult = await db.collection('user').doc(userId).get()
      var userName = userResult.data.name
      let chatResult = await db.collection('chat_history').where({user_id: userId, post_id: postId}).get()
      var id = null
      if(chatResult.data.length == 0) {
        var job = this.data.jobObj
        console.log(job)
        //如果没有则创建聊天项，初始化消息记录,再进入chat页面
        var res = await  db.collection('chat_history').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            company_id: job.companyId,
            enter_name: job.company.fullName,
            enter_red: false,
            post_id: job._id,
            post_name: job.name,
            user_id: userId,
            user_name: userName,
            user_red: false,
            data:[{
              msg:"岗位介绍",
              role: 3,
              time: (Date.now()/1000)
            }]
          },
        })

        id = res._id
      } else {
        id = chatResult.data[0]._id
      }
      return id
    },
    async goToChatPage(e) {
      var userId = this.data.userId
      //查看是否有聊天项
      var id = await this.judgeOrEditChatHistory(userId, this.data.jobId)
      //如果有则直接跳转chat页面
      
      wx.navigateTo({
      url: '/pages/chat/chat?type=' + 1 + '&id=' + id,
    });
    }
})