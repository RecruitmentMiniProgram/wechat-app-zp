// components/selector/multiSelector.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    // 二级复选表的类型
    mode: {
      type: String,
      value: 'work'
    },
    innerTitle:{
      type: String,
      value: '职业选择'
    },
    required:{
      type:Boolean,
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    labelList: [],
    workNum:0,
    // 用于进行多级选择
    departments: ["服务","IT互联网","教育","医疗","建筑"],
    doctors: {
      '服务': ['餐饮人员',"银行柜台","银行经理"],
      'IT互联网': ['前端程序员', 'Java程序员', '运维'],
      '教育': ['文具销售', '老师', '教培'],
      '医疗': ['医生', '护士', '药品经理'],
      '建筑': ['材料']
    },
    multiSelectorRange: [],
    multiSelectorDefault: [0, 0], // 默认选中第一个科室和第一个医生
    selectedDepartment: '',
    selectedDoctor: '',
    showPicker: false,
    lastType:0,
    lastValue:0,
    pickerDisabled:false
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { 
      this.generateMultiSelectorRange();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //将数据存到localstorage中便于获取信息
    getData(e){
      console.log("将职业数据放入localstorage中")
      console.log(e.detail)
      // 类型
      var column=e.detail.value[0]
      //职业
      var value=e.detail.value[1]
      var arr=this.data.labelList
      arr.push(this.data.doctors[this.data.departments[column]][value])
      this.setData({
        labelList:arr,
        workNum:this.data.workNum+1
      })
      if(this.data.workNum==5){
        this.setData({
          pickerDisabled:true
        })
      }
      console.log(this.data.labelList)
    },

    generateMultiSelectorRange: function () {
      const multiSelectorRange = [this.data.departments, this.data.doctors[this.data.departments[0]]];
      this.setData({
        multiSelectorRange: multiSelectorRange,
      });
    },
  
  
    multiPickerChange: function (e) {
      console.log("跟新医生列表")
      console.log(e.detail)
      const column=e.detail.column
      const value = e.detail.value;
      // 第一列更新时我们才需要更新第二列
      var selectedDepartment=null
      if(column==0){
        selectedDepartment = this.data.departments[value];
        this.setData({
          lastValue:value
        })
      }else{
        selectedDepartment = this.data.departments[this.data.lastValue];
      }
  
      // // 更新医生列表
      const multiSelectorRange = [this.data.departments, this.data.doctors[selectedDepartment]];
      console.log(multiSelectorRange)
      this.setData({
        multiSelectorRange: multiSelectorRange,
      });
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