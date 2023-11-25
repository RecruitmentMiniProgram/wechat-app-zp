function calculateAge(birthdateString) {
  // 步骤 1：获取当前日期
  var currentDate = new Date();
  // 步骤 2：解析出生日期字符串
  var birthdate = new Date(birthdateString);
  // 步骤 3：计算年龄
  var age = currentDate.getFullYear() - birthdate.getFullYear();
  // 考虑生日还未到的情况
  if (
      currentDate.getMonth() < birthdate.getMonth() ||
      (currentDate.getMonth() === birthdate.getMonth() &&
          currentDate.getDate() < birthdate.getDate())
  ) {
      age--;
  }
  return age;
}


// pages/show_resume/show_resume.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const db = wx.cloud.database()
    var userId = options.userId
    var userInfo = await db.collection('user').doc(userId).get()
    var user = userInfo.data

    var age = calculateAge(user.age)
    this.setData({
      date: user.age,
      nickName: user.name,
      phone: user.phone,
      sex: user.sex,
      age: age,
      experience: user.experience,
      intention: user.intention,
      degree: user.degree,
      skill: user.skill,
      address: user.address,
      education: user.education,
      work: user.work,
      self: user.self,
      resume: user.resume
    })
  },

  pdf: function() {
    wx.cloud.downloadFile({
      fileID: this.data.resume,
      success: res => {
        // 2. 下载成功后，可以通过 res.tempFilePath 获取文件的临时路径
        const tempFilePath = res.tempFilePath;
    
        // 3. 使用 wx.saveFile 将文件保存到本地
        wx.saveFile({
          tempFilePath: tempFilePath,
          success: saveRes => {
            // 4. 文件保存成功后，可以通过 saveRes.savedFilePath 获取保存在本地的文件路径
            const savedFilePath = saveRes.savedFilePath;
    
            // 5. 使用 wx.openDocument 打开保存在本地的文件
            wx.openDocument({
              filePath: savedFilePath,
              success: openRes => {
                console.log('打开文档成功');
              },
              fail: openErr => {
                console.error('打开文档失败', openErr);
              }
            });
          },
          fail: saveErr => {
            console.error('保存文件失败', saveErr);
          }
        });
      },
      fail: err => {
        console.error('下载文件失败', err);
      }
    });
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