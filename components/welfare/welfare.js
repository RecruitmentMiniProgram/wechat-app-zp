// components/welfare/welfare.js
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
    pickerDisabled:0,
    welfare:"",
    arrayWelfare:[
      "五险",       
      "住房公积金",
      "提供食宿",
      "年底双薪",
      "交通补助",
      "周末双休",
      "单休",
      "调休",
      "加班补助",
      "餐补",
      "话补",
      "房补",
      "节日福利",
      "带薪年假",
      "班车接送",
      "工作餐",
      "年终奖",
      "免费培训",
      "晋升空间",
      "年度旅游",
      "定期体检",
    ],
    labelList:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    updateLabelList(data){
      this.setData({
        labelList:data
      })
    },
    filter(data) {
      var mySet=new Set(data)
      var myArray = Array.from(mySet);
      return myArray
    },
    changeWelfare(e){
      console.log(e.detail.value)
      let arr=this.data.labelList
      arr.push(this.data.arrayWelfare[e.detail.value])
      this.setData({
        labelList:this.filter(arr)
      })
    },
    longtapDeleteLabel(e) {
      let that = this;
      let tag = e.currentTarget.dataset.index;
      wx.showModal({
        title: '提示',
        content: '确定删除该职业吗？',
        complete: (res) => {
          if (res.confirm) {
            var list = that.data.labelList;
            list.splice(tag, 1);
            that.setData({
              labelList: list,
              workNum:this.data.workNum-1
            })
          }
          if(this.data.workNum<5){
            this.setData({
              pickerDisabled:false
            })
          }
        }
      })
    }
  }
})