import { request } from "../../requests/index.js";
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    currentIndexJob: -1,
    scrollTop: 0,
    top: 0,
    //接口的返回数据
    Cates2: [],
    //判断职业分类表是用于搜索还是选择
    isSearch: 1,
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

    // 判明是搜索还是职业选择
    if (options.isSearch == undefined || options.isSearch == null || options.isSearch == '') {
      this.setData({
        isSearch: 1
      })
    }
    else {
      this.setData({
        isSearch: options.isSearch
      })
    }
    this.getCates2();
  },
  //获取分类数据
  async getCates2() {
    const resultRes = await db.collection('category').doc("aa14493d6567f7db008144531e794ebd").get()
    const result = resultRes.data.occupation
    // console.log(result[0])
    this.setData({
      Cates2: result
    })
    let leftMenuList = result.map(v => v.name);
    // console.log(leftMenuList)
    let rightContent = result[0].subList;
    this.setData({
      leftMenuList,
      rightContent
    })


  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    /*
    1 获取被点击的标题身上的索引
    2 给data中的currentIndex赋值就可以了
    */

    // 使用组件时，用这两行代码
   // const { index } = e.detail;
   // let rightContent = this.data.Cates2[index].child;


   const { index } = e.currentTarget.dataset;
    let rightContent = this.data.Cates2[index].subList;
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  },

  //选择职业,返回上一页
  selectOccupation(e) {
    let data = e.currentTarget.dataset.index
    console.log('选中的职业：', data);
    // 获取上一页的数据
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    //修改数据
    console.log(prevPage)
    // let array=
    // prevPage.setData({
    //   work:intentionData
    // })
    // wx.navigateBack({
    //   delta: 1,
    // })
  }
})