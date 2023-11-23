Page({
  userRegister: function() {
    console.log("个人用户注册")
    wx.navigateTo({
      url: '../resume/index', // 请根据实际路径修改
    });
  },

  companyRegister: function() {
    console.log("企业用户注册")
    wx.navigateTo({
      url: '../company/edit/index', // 请根据实际路径修改
    });
  },
});
