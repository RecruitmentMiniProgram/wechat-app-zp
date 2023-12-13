// pages/companys_list/index.js

const db = wx.cloud.database();
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //职位数组
    comList: [],
    // 分页需要的参数
    page_index: 0,
    page_size: app.globalData.page_size,
    loadingTip: "上拉加载更多",
    isnull: 1

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadPage()

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

  loadPage: function () {
    const that = this

    const page_index = that.data.page_index
    const page_size = that.data.page_size
    const queryConditions = { 'recommend': 1 }

    console.log('queryConditions:', queryConditions)

    db.collection('company')
      .where(queryConditions)
      .skip(page_index * page_size)
      .limit(page_size)
      .get({
        success: function (res) {
          console.log(res)
          let comList = res.data;
          let promises = [];

          for (let com of comList) {
            const companyId = com._id;
            let promise = new Promise((resolve, reject) => {

              db.collection('post').where({ 'companyId': companyId }).get({
                success: function (res) {
                  // console.log(res)
                  if (res.data.length > 2) {
                    com.jobs = res.data.slice(0, 2);
                  } else {

                    com.jobs = res.data;
                  }
                  com.jobsLength = res.data.length;
                  resolve(); // 标记异步操作成功
                },
              });
            });
            promises.push(promise);
          }

          Promise.all(promises)
            .then(() => {
              // console.log('his', promises);

              // 所有异步请求完成后执行的逻辑
              that.setData({
                comList: that.data.comList.concat(comList),
                page_index: that.data.page_index + 1
              });
              if (comList.length > 0) {
                that.setData({
                  isnull: 0
                });
              }

              if (comList.length < page_size) {
                that.setData({
                  loadingTip: '没有更多内容'
                });
              }
            })
            .catch(err => {
              console.error('Error in Promise.all:', err);
            });
        }
      });


  },

})