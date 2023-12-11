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
    oldJobList: [],
    // 分页需要的参数
    page_index: 0,
    page_size: 10,
    loadingTip: "上拉加载更多",
    // 筛选条件
    filterParams: {
      region: [],
      salary: [],
      category: [],
      businessDistrict: [],
      welfare: [],
      experience: [],
      education: [],
      scale: []

    },
    isnull: 1
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.getAllJobList();


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



  onReachBottom: function () {

    // if (this.data.loadingTip != "没有更多内容") {
    //   wx.showToast({
    //     title: "正在加载",
    //     icon: 'loading',
    //     duration: 1000
    //   });
    //   this.getJobList();
    // }
  },

  showRegionModal: function (event) {
    // console.log(event.currentTarget.dataset.index)

    const moreInfo = this.selectComponent('#moreInfo');
    const frameTitle = "工作区域"
    const newTitle = ["region"]
    const newData = [
      { type: 0, id: 0, text: "工作区域" },
      { type: 1, id: 0, text: ["墩头镇", "海安镇", "孙庄镇"] },
      { type: 1, id: 0, text: ["高新区", "开发区", "滨海新区"] },
      { type: 1, id: 0, text: ["城东镇", "角斜镇", "李堡镇"] },
      { type: 1, id: 0, text: ["大公镇", "雅周镇", "曲塘镇"] },
      { type: 1, id: 0, text: ["南莫镇", "白甸镇", ""] },
    ]
    moreInfo.updateData(frameTitle, newTitle, newData)
    moreInfo.showFrame();
  },




  showCategoriesModal: function (event) {
    // console.log(event.currentTarget.dataset.index)
    const category = this.selectComponent('#category');
    category.showFrame();
  },


  showSalaryRangeModal: function (event) {
    // console.log(event.currentTarget.dataset.index)

    const moreInfo = this.selectComponent('#moreInfo');
    const newTitle = ["salary"]
    const frameTitle = "薪资范围"


    const newData = [
      { type: 0, id: 0, text: "薪资范围" },
      { type: 1, id: 0, text: ["面议", "1千以下", "1千-2千"] },
      { type: 1, id: 0, text: ["2千-3千", "3千-5千", "5千-8千"] },
      { type: 1, id: 0, text: ["8千1.2万", "1.2万-2万", "2万以上"] }
    ]

    moreInfo.updateData(frameTitle, newTitle, newData)
    moreInfo.showFrame();
  },



  showMoreModal: function (event) {
    // console.log(event.currentTarget.dataset.index)
    const moreInfo = this.selectComponent('#moreInfo');
    const newTitle = ["businessDistrict", "welfare", "experience", "education", "scale"]
    const frameTitle = "更多"

    const newData = [
      { type: 0, id: 0, text: "商圈" },
      { type: 1, id: 0, text: ["火车站", "汽车站", "田庄邻里中心"] },
      { type: 1, id: 0, text: ["万达广场", "星湖001", "韩洋澳联商业广场"] },

      { type: 0, id: 1, text: "福利待遇" },
      { type: 1, id: 1, text: ["五险", "住房公积金", "提供食宿"] },
      { type: 1, id: 1, text: ["年底双薪", "交通补助", "周末双休"] },
      { type: 1, id: 1, text: ["单休", "调休", "加班补助"] },
      { type: 1, id: 1, text: ["餐补", "话补", "房补"] },
      { type: 1, id: 1, text: ["节日福利", "带薪年假", "班车接送"] },
      { type: 1, id: 1, text: ["工作餐", "年终奖", "免费培训"] },
      { type: 1, id: 1, text: ["晋升空间", "年度旅游", "定期体检"] },

      { type: 0, id: 2, text: "经验要求" },
      { type: 1, id: 2, text: ["在校生", "应届生", "1年以内"] },
      { type: 1, id: 2, text: ["1-3年", "3-5年", "5-10年"] },
      { type: 1, id: 2, text: ["10年以上"] },

      { type: 0, id: 3, text: "学历要求" },
      { type: 1, id: 3, text: ["初中及以下", "高中", "中专/技校"] },
      { type: 1, id: 3, text: ["大专", "本科", "硕士"] },
      { type: 1, id: 3, text: ["博士", "MBA/EMBA", ""] },

      { type: 0, id: 4, text: "公司规模" },
      { type: 1, id: 4, text: ["0-20人", "20-99人", "100-499人"] },
      { type: 1, id: 4, text: ["500-999人", "1000-9999人", "10000人以上"] },
    ]

    moreInfo.updateData(frameTitle, newTitle, newData)

    moreInfo.showFrame();
  },


  onCategoryConfirm(e) {
    // console.log("onCategoryConfirme", e.detail.result)

    this.selectComponent('#category').hideFrame();
    var category = e.detail.result

    var params = this.data.filterParams;
    if (category === "全部") {
      params.category = []
    } else {
      params.category = [category]
    }

    this.filterData(params)
  },


  onMoreConfirm(e) {

    this.selectComponent('#moreInfo').hideFrame();
    // 解构赋值，如果键不存在，则使用默认值
    const { region = [],
      salary = [],
      businessDistrict = [],
      welfare = [],
      experience = [],
      education = [],
      scale = [] } = e.detail.result;

    var params = this.data.filterParams;
    params.region = region;
    params.salary = salary;
    params.businessDistrict = businessDistrict;
    params.welfare = welfare;
    params.experience = experience;
    params.education = education;
    params.scale = scale;

    this.filterData(params)
  },


  filterData: function (params) {
    var that = this
    const filters = {
      position: params.region,
      salary: params.salary,
      industry: params.category,
      businessDistrict: params.businessDistrict,
      welfare: params.welfare,
      experience: params.experience,
      education: params.education,
      scale: params.scale
    };
    console.log(filters)


    const filteredData = this.data.oldJobList.filter(item => {
      return Object.keys(filters).every(key => {
        // console.log(key)
        if (filters[key].length > 0) {
          // 特殊处理welfare字段
          if (key === 'welfare') {
            return Array.isArray(item[key]) && filters[key].some(val => item[key].includes(val));
          } else {
            // 普通属性的处理
            return filters[key].includes(item[key]);
          }
        } else {
          // 如果筛选条件为空，则直接通过
          return true;
        }
        // if (key === 'welfare') {
        //   return filters[key].some(val => item[key].includes(val));
        // } else {
        //   return filters[key].length === 0 || filters[key].includes(item[key]);
        // }
        // return filters[key].length === 0 || filters[key].includes(item[key]);

      });
    });

    this.setData({
      isnull: filteredData.length > 0 ? 1 : 0,
      jobList: filteredData,
    });

  },



  onPageScroll(e) {
    //导航栏到达顶部固定
    // if (e.scrollTop > 280) {
    //   // 当页面顶端距离大于一定高度时
    //   let a = this.selectComponent("#mytabs");
    //   a.meth1();
    // } else {
    //   let b = this.selectComponent("#mytabs");
    //   b.meth2();
    // }
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
    var condition = {}
    switch (selectionType) {
      case 0:
        field = "_id"
        break;
      case 1:
        field = "timestamp"
        break
      case 2:
        condition = { 'kind': "兼职" }
        break
      case 3:
        condition = { 'kind': "实习" }
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
        'condition': condition,
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
        oldJobList: JSON.parse(JSON.stringify(this.data.jobList)),
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


  },

  getAllJobList: function () {
    // console.log(QueryParams)

    var that = this;
    wx.showToast({
      title: "正在加载",
      icon: 'loading',
      duration: 800
    });
    db.collection('post').get({
      success: function (res) {
        // console.log(res)

        const results = res.data;
        // console.log(results)
        that.setData({
          jobList: results,
          oldJobList: results
        });
      }
    }
    )
  }
});