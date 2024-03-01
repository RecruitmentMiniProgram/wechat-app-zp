// pages/resume/work/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    company:null,
    endDate:'',
    beginDate:'',
    work:null,
    experienceLength:0,
    experience:null,
    today: new Date().getFullYear+"-"+(new Date().getMonth+1)+"-"+new Date().getDate(),
  },
  /**
   * 提交数据
   * @param {*} e 
   */
  formSubmit(e){
    if(this.data.beginDate.length==0||
      this.data.endDate.length==0||
      this.data.work===null||
      this.data.experience==null||
      this.data.company==null){
      wx.showModal({  
        title: '提示',  
        content: '请补充完整工作经历',  
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
      var workData={
        company:this.data.company,
        beginDate:this.data.beginDate,
        endDate:this.data.endDate,
        work:this.data.work,
        experience:this.data.experience 
      }

      // 获取上一页的数据
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      var workList=prevPage.data.workList
      console.log(workList)
      workList.push(workData)
      //修改数据
      prevPage.setData({
        workList:workList
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },
    /**
   * 经验方向字数
   * @param {*} e 
   */
    inputExperienceChange: function (e) {
        const inputValue = e.detail.value;
        const textLength = inputValue.length;
    
        this.setData({
          experienceLength: textLength,
          experience:e.detail.value
        })
      },
  /**
   * 工作岗位
   * @param {*} e 
   */
  workChange(e){
    this.setData({
      work:e.detail.value
    })
  },
  /**
   * 公司名字
   * @param {*} e 
   */
  companyChange(e){
    console.log("编辑公司名字")
    this.setData({
      company:e.detail.value
    })
  },
    /**
   * 毕业时间
   */
  bindEndDateChange(e){
      this.setData({
        endDate:e.detail.value
      })
      console.log(this.data.endDate)
    },
    /**
     * 入学时间
     * @param {*} e 
     */
  bindBeginDateChange(e){
      this.setData({
        beginDate:e.detail.value
      })
      console.log(this.data.beginDate)
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