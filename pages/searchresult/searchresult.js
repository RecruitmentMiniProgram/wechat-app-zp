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
    isnull: 0,
    fromCate: 0,
    fieldName: [],
    condition: [],

    page_index: 0,
    page_size: 4,
    selectionType: 0,
    loadingTip: "上拉加载更多",

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
      value: "实习",
      isActive: false
    }
    ],

  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this

    db.collection('post').limit(1).get({
      success: function (res) {
        // 搜索
        if (options && options.searchValue) {
          // console.log('onload' + options.searchValue)
          var fieldName = Object.keys(res.data[0])
          // console.log(fieldName)
          
          var condition = db.command.or(
            // 对集合中所有字段应用模糊搜索
            fieldName.map(field => ({
              [field]: db.RegExp({ regexp: '^' + options.searchValue, options: '' })
            }))
          )

          // console.log(condition)
          // that.setData({
          //   condition: condition,
          //   searchValue: options.searchValue
          // });
          // that.loadinfor();

          that.setData({
            condition: condition,
            fieldName: fieldName,
            searchValue: options.searchValue
          }, function () {
            that.loadinfor();
          });
        }

      }
    })
  },



  //查询搜索结果是否存在（只能搜索post表的字段）
  loadinfor: function () {
    var that = this;
    var { searchValue, selectionType, page_index, page_size, condition, fieldName } = that.data;
    // console.log(that.data)

    var field = '_id'

    wx.showToast({
      title: "加载中",
      icon: 'loading',
      duration: 800
    });

    db.collection('post')
      .where(condition)
      .orderBy(field, 'desc')
      .skip(page_index * page_size)
      .limit(page_size)
      .get({
        success: function (res) {

          const jobList = res.data;

          if (jobList.length > 0) {
            that.setData({
              isnull: 1
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
          // 处理查询结果
        },
        fail: function (error) {
          console.error("Failed to fetch data:", error);
        }
      })


  },

  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
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
    this.loadinfor();
  },



})