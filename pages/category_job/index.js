import { request } from "../../requests/index.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 左侧的菜单数据
        leftMenuList: ['1','2'],
        // 右侧的商品数据
        rightContent: [
          {
            id: 1,
            mname: "分类1",
            children: [
              { id: 11, sname: "子分类1-1" },
              { id: 12, sname: "子分类1-2" },
              // 其他子分类项
            ]
          },
          {
            id: 2,
            mname: "分类2",
            children: [
              { id: 21, sname: "子分类2-1" },
              { id: 22, sname: "子分类2-2" },
              // 其他子分类项
            ]
          }
        ],
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
    onLoad: function(options) {
        this.getCates2();
    },
    onShow: function() {},
    //获取分类数据
    async getCates2() {

        // const result = await request({ url: "/own/school/jobcatdata" });
        // // console.log(result)
        // this.setData({
        //     Cates2: result
        // })
        // let leftMenuList = this.data.Cates2.map(v => v.lname);
        // let rightContent = this.data.Cates2[0].children;
        // this.setData({
        //     // expectJobs,
        //     leftMenuList,
        //     rightContent
        // })
    },
    // 左侧菜单的点击事件
    handleItemTap(e) {
        /*
        1 获取被点击的标题身上的索引
        2 给data中的currentIndex赋值就可以了
        */
        const { index } = e.currentTarget.dataset;
        let rightContent = [
          {
            id: 3,
            mname: "分类5",
            children: [
              { id: 11, sname: "子分类1-1" },
              { id: 12, sname: "子分类1-2" },
              // 其他子分类项
            ]
          },
          {
            id: 4,
            mname: "分类6",
            children: [
              { id: 21, sname: "子分类2-1" },
              { id: 22, sname: "子分类2-2" },
              // 其他子分类项
            ]
          }
        ]
        this.setData({
            currentIndex: index,
            rightContent,
            // 重新设置 他右侧内容的scroll-view标签的距离顶部的距离
            scrollTop: 0
        })
    }
})