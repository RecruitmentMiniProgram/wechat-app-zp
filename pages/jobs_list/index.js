// import { request } from "../../requests/index.js";
const db = wx.cloud.database();
const util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //职位数组
    jobList: [],
    // 分页需要的参数
    page_index: 0,
    page_size: 10,
    selectionType: 0,
    loadingTip: "上拉加载更多",
    // 职位分类
    cid: '',


    tabs: [{
      id: 0,
      value: "全部",
      isActive: true
    },
    {
      id: 1,
      value: "急聘",
      isActive: false
    },
    {
      id: 2,
      value: "兼职",
      isActive: false
    },
    {
      id: 3,
      value: "更多",
      isActive: false
    }
    ],
  },
  // QueryParams: {
  //   query: "",
  //   cid: "",
  //   selectionType: 0,
  //   pagenum: 1,
  //   pagesize: 10,
  // },

  bindscrolltoupper() {
    // console.log("top..")
  },

  scrollTop() {
    // console.log("scroll..");
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.data.cid = options.cid;

  },

  onShow: function () {
    var tabId = getApp().globalData.tabid || 0;

    var updatedTabs = this.data.tabs.map((v, i) => {
      return {
        ...v,
        isActive: i === tabId
      };
    });

    this.setData({
      tabs: updatedTabs,
      selectionType: tabId
    });
    // console.log(this.data);
    // this.newData()
    this.getJobList();
  },

  newData: function () {

    // 新数据
    const timestamp = new Date();
    const timeString = util.formatTime(timestamp)
    const newData = {
      companyId: 'b751f2806561c6bb00d1bab91b11b3d1',
      age: 26,
      description: "1个月",
      education: "本科",
      img: "",
      max_salary: "30000",
      min_salary: "20000",
      name: "大数据挖掘",
      position: "武汉",
      timestamp: timestamp,
      time: timeString
    };
    db.collection('post').add({
      data: newData,
      success: function (res) {
        console.log('添加成功', res);
      },
      fail: function (err) {
        console.error('添加失败', err);
      },
    });
  },



  /**
 * 页面搜索事件的处理函数
 */
  wxSearchTab: function () {
    //console.log('wxSearchTab');
    wx.navigateTo({
      url: '../search/search'
    })
  },

  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    // console.log(e)
    // // 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    //  3 赋值到data中
    this.setData({
      tabs,
      selectionType: index,
      jobList: [],
      page_index: 0,
      loadingTip: "上拉加载更多"
    })
    this.getJobList();
  },


  onReachBottom: function () {

    if (this.data.loadingTip != "没有更多内容") {
      wx.showToast({
        title: "正在加载",
        icon: 'loading',
        duration: 1000
      });
      this.getJobList();
    }
  },

  showCategoriesModal: function () {
    console.log('hi')
    wx.showModal({
      title: '职位分类',
      content: '这里放置你的分类信息',
      showCancel: false,
      confirmText: '确定',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定');
        }
      },
    });
  },

  onPageScroll(e) {
    //导航栏到达顶部固定
    if (e.scrollTop > 280) {
      // 当页面顶端距离大于一定高度时
      let a = this.selectComponent("#mytabs");
      a.meth1();
    } else {
      let b = this.selectComponent("#mytabs");
      b.meth2();
    }
  },

  //获取职位信息列表数据
  getJobList: function () {
    // console.log(QueryParams)

    var that = this;
    const selectionType = that.data.selectionType
    const page_index = that.data.page_index
    const page_size = that.data.page_size
    const cid = that.data.cid
    var field = '_id'
    switch (selectionType) {
      case 0:
        field = "_id"
        break;
      case 1:
        field = "timestamp"
        break
      case 2:
        field = "kind"  //TODO
        break
      default:
        field = "_id"
        break
    }
    // console.log('field', field)
    wx.showToast({
      title: "正在加载",
      icon: 'loading',
      duration: 800
    });


    wx.cloud.callFunction({
      name: 'jobListQuery',
      data: {
        'condition': {},
        'field': field.toString(),
        'sort': 'desc',
        'skip': page_index * page_size,
        'limit': page_size
      }
    }).then(res => {
      // console.log(res)
      const results = res.result.data;
      that.setData({
        jobList: that.data.jobList.concat(results),
        page_index: that.data.page_index + 1
      });
      if (results.length < page_size) {
        that.setData({
          loadingTip: '没有更多内容'
        });
      }
    }).catch(err => {
      console.log("failed")
    })


  }
});