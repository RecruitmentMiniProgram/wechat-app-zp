// pages/index/FirstIndex.js

var app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingTip: "上拉加载更多",
    page_index: 0,
    page_size: 4,

    swiperCurrent: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 800,
    circular: true,
    imgUrls: '',
    jobList: [],

    //tab 
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置

  },
  //轮播图的切换事件
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //点击指示点切换
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },
  //点击图片触发事件
  swipclick: function (e) {
    console.log(this.data.swiperCurrent);
    wx.switchTab({
      // url: this.data.links[this.data.swiperCurrent]
    })
  },



  //加载轮播图
  getswitchimg: function () {
    var that = this;
    db.collection('swiperImage').get({
      success: function (res) {
        that.setData({
          imgUrls: res.data
        });
      }
    });

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  scrolltolower: function () {
    // console.log('--下拉刷新-')
    // this.setData({
    //   page_index: ++this.data.page_index
    // });
    if (this.data.loadingTip != "没有更多内容") {
      wx.showToast({
        title: "正在加载",
        icon: 'loading',
        duration: 1000
      });
      this.loadArticle();
    }
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
  /**
   * 今日招聘（全部职位）跳转
   */
  bindViewAllJobs: function () {
    getApp().globalData.tabid = 0;
    wx.switchTab({
      url: '../jobs_list/index',
    })
  },

  bindViewCategory: function () {
    wx.switchTab({
      url: '../category_job/index',
    })
  },
  /**
 * 急聘
 */
  bindViewEmergency: function () {
    getApp().globalData.tabid = 1;
    wx.switchTab({
      url: '../jobs_list/index',
    })
  },
  /**
 * 兼职跳转
 */
  bindViewPartTime: function () {
    getApp().globalData.tabid = 2; // TODO
    wx.switchTab({
      url: '../jobs_list/index',
    })
  },
  /**
 * 今日招聘（推荐）跳转
 */
  bindViewTodayTj: function () {
    getApp().globalData.tabid = 3;
    wx.switchTab({
      url: '../jobs_list/index',
    })
  },

  // bindViewXWZX: function () {
  //   wx.showToast({
  //     title: '此功能暂未启用',
  //     image: "../../images/warning.png",
  //     duration: 2000,
  //     mask: true
  //   })

  // },


  // 点击标题切换当前页时改变样式
  swichNav: function (e) {

    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
      //  //console.log('点击tab'+cur);
      this.switchTabLoad(cur);
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  /**
   * 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getswitchimg();
    // this.qbzwLoad();
    this.loadArticle();
  },

  //全部职位加载
  qbzwLoad: function () {
    var that = this;

    db.collection('post').where({})
      .orderBy('timestamp', 'desc')
      .get({
        success: function (res) {
          var jobList = res.data;
          // 调用云函数获取jobList
          wx.cloud.callFunction({
            name: 'jobListQuery',
            data: { jobList: jobList }
          }).then(res => {
            jobList = res.result;
            that.setData({
              jobList: jobList,
            });
          }).catch(err => {
            console.log("failed")
          })
        }
      });

  },

  //分页加载
  loadArticle: function () {

    const that = this;
    const page_size = that.data.page_size;
    const page_index = that.data.page_index;
    db.collection('post')
      .where({})
      .orderBy('timestamp', 'desc')
      .skip(page_index * page_size)
      .limit(page_size)
      .get({
        success: function (res) {
          const results = res.data;
          // console.log(results)
          wx.cloud.callFunction({
            name: 'jobListQuery',
            data: { jobList: results }
          }).then(res => {
            const jobList = res.result;
            that.setData({
              jobList: that.data.jobList.concat(jobList)
            });
            // 如果返回的数据数量小于每页数据数量，表示没有更多数据
            if (results.length < page_size) {
              that.setData({
                loadingTip: '没有更多内容'
              });
            }
            // 更新分页索引
            that.setData({
              page_index: that.data.page_index + 1
            });
          }).catch(err => {
            console.log("failed")
          })
        },
      });


  },
  //清空招聘列表
  cleardata: function () {
    this.setData({
      jobList: []
    });
  }


})