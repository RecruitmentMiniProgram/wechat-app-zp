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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.comId = wx.getStorageSync('comId');
    // console.log("onload:", options);
    this.getComDetail(options.comId);
    this.getComPostDetail(options.comId);

  }
})