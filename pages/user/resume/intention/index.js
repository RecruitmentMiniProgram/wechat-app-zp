// pages/resume/intention/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arraySalary: ['不限','1千以下', '1千~2千', '2千~3千', '3千~4千', '4千~5千', '5千~6千',
    '6千~7千','7千~8千','8千~9千','9千~1万','1万~2万','2万以上'],
    arrayWorkType:['无要求','全职','实习'],
    workType:null,
    salary:null,
    workList:[],
    
    //职业选择器template的数据
    workNumSelector:0,
    pickerDisabledSelector:false,
    labelListSelector:[]
  },

  /****************************************
   * ***** 职业选择器模板的相关方法*********
   * *********************************** */
  //使用职业分类页面进行选择
  industryChange(e){
    console.log("选择产业类型")
    wx.navigateTo({
      url: '/pages/user/category_job/index',
    })
  },

    // 长安删除图片
  // 长安删除兴趣爱好标签
  longtapDeleteLabel(e) {
    let that = this;
    let tag = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定删除该职业吗？',
      complete: (res) => {
        if (res.confirm) {
          var list = that.data.labelListSelector;
          list.splice(tag, 1);
          that.setData({
            labelListSelector: list,
            workNumSelector:this.data.workNumSelector-1
          })
        }
        if(this.data.workNumSelector<5){
          this.setData({
            pickerDisabledSelector:false
          })
        }
      }
    })
  },

  /**
   * 提交表单
   * @param {*} e 
   */
  formSubmit(e){
    const customData = this.data.workList;
    console.log('自定义组件的数据：', customData);
    if(customData.length==0||this.data.workType===null||this.data.salary==null){
      wx.showModal({  
        title: '提示',  
        content: '请补充完整求职意向',  
        success: function(res) {  
          if (res.confirm) {  
            // 点击确定按钮触发的回调函数  
            console.log('用户点击了确定')  
          } else if (res.cancel) {  
            // 点击取消按钮触发的回调函数  
            console.log('用户点击了取消')  
          }  
        }  
      })
    }else{
      //将用户的意向数据存到localstorage中
      var intentionData={
        salary:this.data.arraySalary[this.data.salary],
        type:this.data.arrayWorkType[this.data.workType],
        workList:customData
      }

      // 获取上一页的数据
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      //修改数据
      prevPage.setData({
        intentionData:intentionData
      })
      wx.navigateBack({
        delta: 1,
      })
    }

  },
  /**
   * 选薪酬
   * @param {*} e 
   */
  salaryChange(e){
    console.log("选择薪酬");
    this.setData({
      salary:e.detail.value
    })
  },
  workTypeChange(e){
    console.log("选择工作类型")
    this.setData({
      workType:e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      labelListSelector:this.data.workList,
      workNumSelector:this.data.workList.length,
      pickerDisabledSelector:this.data.workList.length==5
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})