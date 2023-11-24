Page({
  data: {
    departments: ['内科', '外科', '儿科', '妇产科', '眼科'],
    doctors: {
      '内科': ['张医生', '王医生', '李医生'],
      '外科': ['赵医生', '钱医生', '孙医生'],
      '儿科': ['周医生', '吴医生', '郑医生'],
      '妇产科': ['冯医生', '陈医生', '楮医生'],
      '眼科': ['卫医生', '蒋医生', '沈医生'],
    },
    multiSelectorRange: [],
    multiSelectorDefault: [0, 0], // 默认选中第一个科室和第一个医生
    selectedDepartment: '',
    selectedDoctor: '',
    showPicker: false,
    lastType:0,
    lastValue:0
  },

  onLoad: function () {
    this.generateMultiSelectorRange();
  },

  generateMultiSelectorRange: function () {
    const multiSelectorRange = [this.data.departments, this.data.doctors[this.data.departments[0]]];
    this.setData({
      multiSelectorRange: multiSelectorRange,
    });
  },

  showPicker: function () {
    this.setData({
      showPicker: true,
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
});
