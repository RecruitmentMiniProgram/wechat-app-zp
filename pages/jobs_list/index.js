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

    tabs: [{
      id: 0,
      value: "全部",
      isActive: true
    },
    {
      id: 1,
      value: "高薪资",
      isActive: false
    },
    {
      id: 2,
      value: "临时工",
      isActive: false
    },
    {
      id: 3,
      value: "紧急",
      isActive: false
    }
    ],
  },
  QueryParams: {
    query: "",
    cid: "",
    jobType: "all",
    pagenum: 1,
    pagesize: 10,
  },

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
    // console.log(options);
    // this.QueryParams.cid = options.cid
    // this.newData()
    this.getJobList(this.QueryParams);
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
    if (index == 0) {
      this.QueryParams.jobType = "all"
      // this.getJobList(this.QueryParams)
    } else if (index == 1) {
      this.QueryParams.jobType = "salary"
      // this.getJobList(this.QueryParams)

    } else if (index == 2) {
      this.QueryParams.jobType = "time"
      // this.getJobList(this.QueryParams)

    } else {
      this.QueryParams.jobType = "all"
      // this.getJobList(this.QueryParams)

    }
    //  3 赋值到data中
    this.setData({
      tabs
    })
    this.setData({
      jobList: []
    })
    this.getJobList(this.QueryParams);
  },
  onReachBottom: function () {
    // 1  判断还有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据
      // console.log("没有下一页");
      wx.showToast({
        title: '没有下一页数据了',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result) => {

        },
        fail: () => { },
        complete: () => { }
      });

    } else {
      this.QueryParams.pagenum++;
      wx.showToast({
        title: '加载中',
        icon: 'none',
        image: '',
        duration: 1000,
        mask: false,
      });
      this.getJobList(this.QueryParams);
    }
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
  getJobList: function (QueryParams) {
    // console.log(QueryParams)

    var that = this;
    var jobType = QueryParams.jobType
    var feild = '_id'
    switch (jobType) {
      case "all":
        feild = "_id"
        break;
      case "salary":
        feild = "min_salary"
        break
      case "time":
        feild = "timestamp"
        break
      default:
        feild = "_id"
        break
    }

    db.collection('post').where({})
      .orderBy(feild, 'desc')
      .get({
        success: function (res) {
          var jobList = res.data;
          // 调用云函数获取jobList
          wx.cloud.callFunction({
            name: 'jobListQuery',
            data: {jobList: jobList }
          }).then(res => {
            jobList = res.result;
            // console.log(jobList)

            var total = jobList.length;
            var totalPages = Math.ceil(total / QueryParams.pagesize);
            that.setData({
              jobList: jobList,
              totalPages: totalPages
            });
          }).catch(err => {
            console.log("failed")
          })
        }
      });
  }
});