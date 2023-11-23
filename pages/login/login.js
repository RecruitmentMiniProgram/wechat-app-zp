// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonHTML:"发送验证码"
  },
  /**
   * 验证手机号是否合法
   * @param {*} phoneNumber 
   * @returns 
   */
  isValidPhoneNumber(phoneNumber) {  
    var regex = /^1[3-9]\d{9}$/;   
    return regex.test(phoneNumber);  
  },
  /**
   * 生成6位随机字符串作为验证码
   * @param {*} length 
   * @returns 
   */
  generateRandomString(length=6) {  
    var result = '';  
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';  
    var charactersLength = characters.length;  
    for (var i = 0; i < length; i++) {  
        result += characters.charAt(Math.floor(Math.random() * charactersLength));  
    }  
    return result;  
  },
  buttonCount(){
    // 设定新的倒计时  
    var count = 60;  // 倒计时60秒
    let that=this  
    var intervalId = setInterval(function() {  
        count--; 
        that.setData({
          buttonHTML:count + 's'  // 更新按钮显示内容 
        })  
        if (count <= 0) {  
            // 倒计时结束，清除倒计时  
            clearInterval(intervalId);  
            that.setData(
              {
                buttonHTML:"发送验证码"
              }
            )
        }  
    }, 1000);  // 每秒更新一次  
  }, 
  /**
   * 记录用户的手机号码
   */
  getPhone(e){
    this.setData({
      phone: e.detail.value
    })
    console.log(this.data.phone)
  },
  /**
   * 记录验证码
   * @param {*} e 
   */
  getCode(e){
    this.setData({
      code: e.detail.value
    })
    console.log(this.data.code)
  },
  /**
   * 发送手机短信
   */
  sendCode(){
    //手机号合法
    if(this.isValidPhoneNumber(this.data.phone)){
      var code=this.generateRandomString(6)
      //记录真实的手机和验证码
      this.setData(
        {
          realCode:code,
          realPhone:this.data.phone
        }
      )
      this.buttonCount()
    }else{
      wx.showModal({  
        title: '手机号错误',  
        content: '请输入合法的手机号',  
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
    }
  },
  /**
   * 用户登入
   */
  login(){
    //TODO
    //还未实现验证码校验
    if(this.data.phone===this.data.realPhone){
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'userTypeSearch',
        // 传递给云函数的event参数
        data: {
          phone:this.data.phone
        }
      }).then(res => {
        if(res.result.data.data.length>0){
          //账号已经存在,直接跳转到个人信息页面
          //TODO
          console.log("跳转页面")
          if(res.result.data.data[0].type==0){
            console.log("个人用户")
            // 在页面A的js文件中
            wx.redirectTo({
              url: '../../pages/user/index'
            });
            //设置登入状态
            wx.setStorageSync('status', 0);
          }else{
            console.log("企业用户")
            // 在页面A的js文件中
            wx.redirectTo({
              url: '../../pages/company/index'
            });
            //设置登入状态
            wx.setStorageSync('status', 1);
          }
        }else{
          //账号不存在跳转到注册页面
          //TODO
          console.log("账号不存在请进行注册")
        }
      }).catch(err => {
        wx.showModal({  
          title: '登入失败',  
          content: '请检查验证码和手机号',  
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
      })
    }
    else{
      wx.showModal({  
        title: '登入失败',  
        content: '请检查手机号和验证码',  
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
    }
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