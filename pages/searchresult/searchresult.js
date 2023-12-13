// pages/searchinfor/searchresult.js
const util = require('../../utils/util')
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',
    jobList: [],
    isnull: 1,
    condition: {},

    page_index: 0,
    page_size: 10,
    loadingTip: "上拉加载更多",

  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.search(options.searchValue);

  },

  search: function (searchValue) {
    const that = this

    db.collection('post').limit(1).get({
      success: function (res) {
        var fieldName = Object.keys(res.data[0])
        var condition = db.command.or(
          fieldName.map(field => ({
            [field]: db.RegExp({ regexp: '^' + searchValue, options: '' })
          }))
        )
        console.log(condition)
        that.getJobList(condition);
      }
    })

  },



  getJobList: function (condition) {
    var that = this;
    var { page_index, page_size } = that.data;
    console.log(condition)
    db.collection('post')
      .where(condition)
      .orderBy('timestamp', 'desc')
      .skip(page_index * page_size)
      .limit(page_size)
      .get({
        success: function (res) {

          const jobList = res.data;
          console.log(jobList)

          if (jobList.length > 0) {
            that.setData({
              isnull: 0
            });
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
        },
        fail: function (error) {
          console.error("Failed to fetch data:", error);
        }
      })
  },



  resetData: function () {
    this.setData({
      searchValue: '',
      jobList: [],
      isnull: 1,
      fromCate: 0,
      condition: {},

      page_index: 0,
      recommend: 0,
      page_size: 10,
      loadingTip: "上拉加载更多",

    })
  }

})