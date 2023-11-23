// import { request } from "../../requests/index.js";
const db = wx.cloud.database();
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
                value: "校招",
                isActive: true
            },
            {
                id: 1,
                value: "实习",
                isActive: false
            },
            {
                id: 2,
                value: "社招",
                isActive: false
            },
            {
                id: 3,
                value: "全部",
                isActive: false
            }
        ],
    },
    QueryParams: {
      query: "",
      cid: "",
      jobType:'1',
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
    onLoad: function(options) {
        // console.log(options);
        // this.QueryParams.cid = options.cid
        // this.addNewData();
        this.getJobList();
    },


    addNewData:function(){
      db.collection('post').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          enter_id:"11",
          name: "测试",
          min_salary: 1
      },
        success: function(res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log(res)
        }
      })
  
    },

    handleTabsItemChange(e) {
        // 1 获取被点击的标题索引
        const { index } = e.detail;
        // // 修改源数组
        let { tabs } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        if (index == 0) {
            this.QueryParams.jobType = "2"
        } else if (index == 1) {
            this.QueryParams.jobType = "1"
        } else if (index == 2) {
            this.QueryParams.jobType = "3"
        } else {
            this.QueryParams.jobType = ""
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
    onReachBottom: function() {
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
                fail: () => {},
                complete: () => {}
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
    getJobList: function() {
      var that = this;
      db.collection('post').get({
        success: function(res) {
          const jobList = res.data;
          
          // 用于存放所有的 Promise 对象
          const promiseList = [];
      
          jobList.forEach(job => {
            const companyId = job.companyId;
            const companyPromise = db.collection('company').where({companyId: companyId}).get();
      
            // 将每个异步操作的 Promise 对象存入数组
            promiseList.push(companyPromise.then(res => {
              const companyRes = res.data;
              job.company = companyRes[0]; // 返回的是一个数组列表，本质上只返回一个公司
              // console.log("company", companyRes);
            }).catch(err => {
              // 处理错误情况
              console.error(err);
            }));
          });
      
          // 使用 Promise.all 等待所有异步操作完成
          Promise.all(promiseList).then(() => {
            // 在这里进行 setData 操作，确保在所有异步操作完成后更新数据
            var total = jobList.length;
            var totalPages = Math.ceil(total / that.QueryParams.pagesize);
            that.setData({
              jobList: jobList,
              totalPages: totalPages
            });
            // console.log("joblist", jobList);
      
            // 停止下拉刷新
            wx.stopPullDownRefresh();
          });
        },
        fail: function(err) {
          console.error('查询失败：', err);
        }
      });
    }
});