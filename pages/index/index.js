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
    page_size: app.globalData.page_size,
    recommend: 1,
    isnull: 1,


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

  /**
   * 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getswitchimg();
    this.loadPage();
  },

  /**
   * 页面上拉触底事件的处理函数
   */

  onReachBottom: function () {

    if (this.data.loadingTip != "没有更多内容") {
      wx.showToast({
        title: "正在加载",
        icon: 'loading',
        duration: 1000
      });
      this.loadPage()
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
  //轮播图的切换事件
  swiperChange: function (e) {
    let { current, source } = e.detail

    // if (source == "touch") {      
    //   //防止swiper控件卡死
    //   if (this.data.current == 0 && this.data.preIndex>1 ) {//卡死时，重置current为正确索引
    //     this.setData({ current: this.data.preIndex });
    //   }
    //   else {//正常轮转时，记录正确页码索引
    //     this.setData({ preIndex: this.data.current });
    //   }
    // }
    if (source === 'autoplay' || source == "touch") {
      //根据官方 source 来进行判断swiper的change事件是通过什么来触发的，autoplay是自动轮播。touch是用户手动滑动。其他的就是未知问题。抖动问题主要由于未知问题引起的，所以做了限制，只有在自动轮播和用户主动触发才去改变current值，达到规避了抖动bug
      this.setData({
        swiperCurrent: current
      })
    }
  },
  showActionSheet: function () {
    wx.showActionSheet({
      itemList: ['选项一', '选项二', '选项三'],
      success: function (res) {
        if (!res.cancel) {
          console.log('用户点击了第' + (res.tapIndex + 1) + '项');
        }
      }
    });
  },
  //点击指示点切换
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },
  //点击图片触发事件
  swipclick: function (e) {
    console.log(e.currentTarget.dataset.index.comId);
    const comId = e.currentTarget.dataset.index.comId
    const url = "../company_home/index?comId="+comId
    wx.navigateTo({url});
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

  bindViewAllJobs: function () {
    wx.switchTab({
      url: '../jobs_list/index',
    })
  },

  bindViewCompany: function () {
    wx.switchTab({
      url: '../companys_list/index',
    })
  },
  handleContact: function (e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  },

  //分页加载
  loadPage: function () {

    const that = this;
    const page_size = that.data.page_size;
    const page_index = that.data.page_index;
    db.collection('post')
      .orderBy('recommend', 'desc')
      .orderBy('timestamp', 'desc')
      .skip(page_index * page_size)
      .limit(page_size)
      .get({
        success: function (res) {
          console.log(res)

          const results = res.data;
          if (results.length > 0) {
            that.setData({
              isnull: 0
            });
          }
          that.setData({
            jobList: that.data.jobList.concat(results),
            page_index: that.data.page_index + 1
          });
          if (results.length <= page_size) {
            that.setData({
              loadingTip: '没有更多内容'
            });
          }
        }
      }
      )

  },


})