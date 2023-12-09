const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: ['1', '2'],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    currentIndexJob: -1,
    scrollTop: 0,
    top: 0,
    //接口的返回数据
    Cates2: [],
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
    this.getCates2();
  },
  onShow: function () { },

  onNavigatorTap: function () {
    console.log('点击了 navigator 元素！');
  },
  //获取分类数据
  async getCates2() {

    // const resultRes = await db.collection('category').doc("80e3bed06567362301b9fea3075992be").get()
    // const result = resultRes.data.industry
// this.setData({
    //   Cates2: result
    // })
    // let leftMenuList = result.map(v => v.name);
    // let rightContent = result[0].child;
    // this.setData({
    //   leftMenuList,
    //   rightContent
    // })

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
      // expectJobs,
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
    const { index } = e.currentTarget.dataset;

    // let rightContent = this.data.Cates2[index].child;
    let rightContent = this.data.Cates2[index].subList;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置 他右侧内容的scroll-view标签的距离顶部的距离
      scrollTop: 0
    })
      },

  //选择职业,返回上一页
  selectOccupation(e){
    let data=e.currentTarget.dataset.index
    console.log('选中的职业：', data);
    // 获取上一页的数据
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    //修改数据
    let array=prevPage.data.workList
    prevPage.setData({
      work:array.push(data)
    })
    wx.navigateBack({
      delta: 1,
    })
  }
})