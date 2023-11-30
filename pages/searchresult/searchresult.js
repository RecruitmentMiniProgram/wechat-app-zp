// pages/searchinfor/searchresult.js
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
      value: "更多",
      isActive: false
    }
    ],

  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (options.fromCate && options.searchValue) {
    //   //console.log('onload' + options.searchValue)
    //   this.setData({
    //     searchValue: options.searchValue
    //   });
    //   // this.searchCates();
    //   this.loadinfor();


    // }
    // 搜索
    if (options && options.searchValue) {
      //console.log('onload' + options.searchValue)
      this.setData({
        searchValue: options.searchValue
      });
      this.loadinfor();
    }

  },



  //查询搜索结果是否存在（只能搜索post表的字段）
  loadinfor: function () {
    var that = this;
    const { searchValue, selectionType, page_index, page_size } = that.data;

    var field = '_id'
    switch (selectionType) {
      case 0:
        field = "_id"
        break;
      case 1:
        field = "timestamp"
        break
      case 2:
        field = "timestamp"  //TODO
        break
      default:
        field = "_id"
        break
    }
    wx.showToast({
      title: "加载中",
      icon: 'loading',
      duration: 800
    });

    db.collection('post').limit(1).get({
      success: function (res) {
        // 获得post表的字段:[_id,age,..]
        const fields = Object.keys(res.data[0])

        db.collection('post')
          .where(
            db.command.or(
              // 对集合中所有字段应用模糊搜索
              fields.map(field => ({
                [field]: db.RegExp({ regexp: '^' + searchValue, options: '' })
              }))
            )
          )
          .orderBy(field.toString(), 'desc')
          .skip(page_index * page_size)
          .limit(page_size)
          .get({
            success: function (res) {
              const results = res.data;
              // 调用云函数获取jobList
              wx.cloud.callFunction({
                name: 'jobListQuery',
                data: { jobList: results }
              }).then(res => {
                var jobList = res.result;
                // console.log(jobList)
                if (jobList.length > 0) {
                  that.setData({
                    // jobList: jobList,
                    isnull: 1
                  });

                }
                that.setData({
                  jobList: that.data.jobList.concat(jobList),
                  page_index: that.data.page_index + 1
                });
                // 如果返回的数据数量小于每页数据数量，表示没有更多数据
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
      }
    });


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