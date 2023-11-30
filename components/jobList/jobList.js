// components/jobList/jobList.js
const db=wx.cloud.database()
const _=db.command
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    // 1:表示jobList可编辑，0：表示jobList只能展示
    edit: {
      type: Number,
      value: 1
    },
    // 查询条件
    query:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
      jobList: [],
      deleteList:[],
      QueryParams: {
        query: "",
        cid: "",
        jobType: "all",
        pagenum: 1,
        pagesize: 10,
      },
      companyId:'',
      show:0,

      // 分页需要的参数
      page_index: 0,
      page_size: 4,
      selectionType: 0,
      loadingTip: "上拉加载更多",
      // 职位分类
      cid: '',


  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { 
      this.getJobList(this.data.QueryParams)
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
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
    // wx.showLoading({
    //   title: '加载中...',
    // })
    db.collection('post').where(this.data.query)
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
            var total = jobList.length;
            var totalPages = Math.ceil(total / QueryParams.pagesize);
            that.setData({
              jobList: jobList,
              totalPages: totalPages,
              show:1
            });
            wx.hideLoading()
          }).catch(err => {
            wx.hideLoading()
          })
        }
      });
  },

  //长按删除卡牌
  longtapDeleteWork(e){
      let that = this;
      let tag = e.currentTarget.dataset.index;
      
      wx.showModal({
        title: '提示',
        content: '确定删除该工作经历吗？',
        complete: (res) => {
          if (res.confirm) {
            var list = that.data.jobList;
            var temp=list.splice(tag, 1)
            this.data.deleteList=this.data.deleteList.concat(temp)
            that.setData({
              jobList: list
            })
            console.log("删除后:",this.data.jobList)
          }
        }
      })
    },

  //提交修改
  submitPost(e){
    console.log(this.data.deleteList)

    // 小程序端的代码
    wx.cloud.callFunction({
      name: 'deleteByIdBatch',
      data: {
        idsToDelete:this.data.deleteList
      }
     }).then(res=>{
      wx.cloud.callFunction({
        name: 'deleteResumeBatch',
        data: {
          idsToDelete:this.data.deleteList
        }
      })
    }).then(res=>{
      // 处理删除成功的情况
      wx.navigateBack()
    }).catch(err=>{
      console.error("批量删除职位失败:",err);
    })


  }
  }
})