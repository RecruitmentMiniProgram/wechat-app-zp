// components/SeachInput/SearchInput.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    wxSearchTab: function () {
      //console.log('wxSearchTab');
      wx.navigateTo({
        url: '../search/search'
      })
    }
  }
})
