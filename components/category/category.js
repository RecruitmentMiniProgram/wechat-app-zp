// components/category.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    leftMenuList:Array,
    rightContent:Array,
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemTap(e) {
      // 点击事件
      const { index } = e.currentTarget.dataset;
      // 2 触发 父组件的事件 自定义
      this.triggerEvent("tabsItemChange", { index });
      this.setData({
        currentIndex: index,
      })
  },

  }
})