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




  // 公司信息全局对象
  comInfoStorage: {},
  // 点击收藏图标
  handleCollectAdd() {
    let isCollect_com = false;
    // 1 先获取缓存中的购物车数组
    let collects_com = wx.getStorageSync("collects_com") || [];
    // 2 判断商品对象是否存在于购物车的数组中
    let index = collects_com.findIndex(v => v.comId === this.comInfoStorage.comId);
    if (index != -1) {
      // 能找到 已经收藏过 再点击则取消收藏
      collects_com.splice(index, 1);
      isCollect_com = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });
      this.setData({
        submit_stat: "收藏"
      })
    } else {
      // 没有收藏过
      collects_com.push(this.comInfoStorage);
      isCollect_com = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
      this.setData({
        submit_stat: "已收藏"
      })
    }
    // 5 把收藏夹重新添加回缓存中
    wx.setStorageSync("collects_com", collects_com);
    this.setData({
      isCollect_com
    })
  },
  // 获取订单列表的方法
  async getOrders(type) {
    this.setData({
      // orders: res.orders
    })
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
    // 2 重新发送请求
    this.getOrders(index + 1);
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
    var that = this;
    const jobRes = await db.collection('post').where({ companyId: comId }).get()

    const myJobs = jobRes.data
    try {
      const res = await wx.cloud.callFunction({
        name: 'jobListQuery',
        data: { jobList: myJobs }
      });

      const jobList = res.result;
      that.setData({
        jobList: jobList
      });
    } catch (err) {
      console.log("failed", err);
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

  }
})