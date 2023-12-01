/*
1 当页面被打开的时候 onShow
    0 onshow 不同于onload 无法在形参上接受 options参数
    0.5 判断缓存中有没有token
        1 没有 直接跳转到授权页面
        2 有 直接往下进行
    1 获取url上的参数type
    2 根据type来决定页面标题的数组元素 哪个被激活选中
    2 根据type值发送请求获取订单数据
    3 渲染页面
2 点击不同数据 重新发送请求获取和渲染数据

*/
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingTip: "上拉加载更多",
    page_index: 0,
    page_size: 10,
    submit_stat: "收藏",
    isCollect_com: false,
    comObj: [],
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