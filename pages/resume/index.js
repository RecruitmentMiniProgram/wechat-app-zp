// index.js
Page({
  data: {
    show: false,
    hobby: false,
    avatar: 'https://img0.baidu.com/it/u=345359896,661384602&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    nickName: '请填写姓名',
    phone: '请填写手机号',
    // 编辑时临时数据
    tempList: {
      avatarTemp: 'https://img0.baidu.com/it/u=345359896,661384602&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      nameTemp: '布吉岛',
      phoneTemp: '0000000000',
    },
    arraySex: ['女', '男'],
    sex: '',
    arrayMarry: ['未婚', '已婚'],
    indexMarry: 0,
    arrayEducation: ['小学', '初中', '高中', '大专', '本科', '硕士','博士'],
    indexEducation: 4,
    attrImg: [],
    hobbyVal: '',
    labelList: [],
    experienceLength:0,
    selfLength:0,
    skillLength:0,
    email:'',
    school:'',
    major:'',
    education:'',
    beginDate:'',
    endDate:'',
    date:'',
    experience:'',
    region:'',
    workList:[],
    intentionData:null,
    itemStyle: []// 用于存储每个 item 的样式
  },
    /**
   * 生命周期函数--监听页面加载
   */
    onLoad(options) {
      console.log("onLoad")
    },
  
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
      console.log("onReady")
    },
  bindRegionChange(e){
    console.log("选择区域")
    console.log(e.detail.value)
    var temp=''
    for(var i=0;i<e.detail.value.length;i++){
      temp+=e.detail.value[i]
    }
    this.setData({
      region:temp
    })
  },
  //长按删除卡牌
  longtapDeleteWork(e){
    let that = this;
    let tag = e.currentTarget.dataset.index;
    
    wx.showModal({
      title: '提示',
      content: '确定删除该工作经历吗？',
      complete: (res) => {
        if (res.confirm) {
          var list = that.data.workList;
          list.splice(tag, 1);
          that.setData({
            workList: list
          })
          console.log("删除后")
          console.log(this.data.workList)
        }
      }
    })
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
   * 提交数据
   * @param {*} e 
   */
    formSubmit(e){
      if((this.data.nickName=='请填写姓名'||
        this.data.phone=='请填写手机号'||
        this.data.sex==''||
        this.data.education==''||
        this.data.intentionData==null||
        this.data.date==''||
        this.data.experience.length==0)){
          console.log(this.data.nickName)
          console.log(this.data.sex)
          console.log(this.data.phone)
          console.log(this.data.education)
          console.log(this.data.intentionData)
          console.log(this.data.date)
          console.log(this.data.experience)
        wx.showModal({  
          title: '提示',  
          content: '请补充完整必填项',  
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
        if(!this.isValidPhoneNumber(this.data.phone)){
          wx.showModal({  
            title: '提示',  
            content: '请填写合法手机号',  
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
          console.log(this.data.workList)
          console.log(this.data.intentionData)
            //将用户的数据存到数据库中
        var userData={
          name:this.data.nickName,
          sex:this.data.arraySex[this.data.sex],
          age:this.data.date,
          experience:this.data.experience,
          intention:this.data.intentionData,
          degree:this.data.arrayEducation[this.data.education],
          work:this.data.workList,
          education:{
            school:this.data.school,
            major:this.data.major,
            beginDate:this.data.beginDate,
            endDate:this.data.endDate
          },
          skill:this.data.skill,
          phone:this.data.phone,
          resume:'',
          address:this.data.region
        }
        
          //使用云函数直接插入数据库中
          // TODO
          wx.cloud.callFunction({
            name: 'userlogin',
            data: {
              data:userData
            }
          }).then(res=>{
            console.log("用户注册成功")
            console.log(res)
            wx.setStorageSync(
              "userId",res.result.data.user._id
            )
            wx.setStorageSync(
              "status",1
            )
            wx.setStorageSync(
              "companyId",''
            )
            // 跳转到个人页面
            wx.redirectTo({
              url: '../user/index',
            })
          }).catch(err=>{
            console.log("用户注册失败")
          })
        }
      }
    },
  onShow(){
    //检查回传的数据
    console.log(this.data.intentionData)
    console.log(this.data.workList)
  },
  /**
   * 专业
   * @param {*} e 
   */
  majorChange(e){
    this.setData({
      major:e.detail.value
    })
    console.log(this.data.major)
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
   * 记录学校
   * @param {*} e 
   */
  schoolChange(e){
    this.setData({
      school:e.detail.value
    })
    console.log(this.data.school)
  },
  /**
   * 邮箱
   * @param {} e 
   */
  emailChange(e){
    console.log("记录邮箱")
    this.setData({
      email:e.detail.value
    })
    console.log(this.data.email)
  },
  /**
   * 求职意向
   * @param {} e 
   */
  intentionChange(e){
    console.log("编辑求职意向")
    wx.navigateTo({
      url: './intention/index',
    })
  },
  /**
   * 工作经历
   * @param {*} e 
   */
  workChange(e){
    console.log("编辑工作经历")
    wx.navigateTo({
      url: './work/index',
    })
  },
    /**
   * 经验方向字数
   * @param {*} e 
   */
    inputExperienceChange: function (e) {
      const inputValue = e.detail.value;
      const textLength = inputValue.length;
  
      this.setData({
        experienceLength: textLength
      })
      this.data.experience=e.detail.value
    },
    inputSelfChange: function (e) {
        const inputValue = e.detail.value;
        const textLength = inputValue.length;
    
        this.setData({
          selfLength: textLength
        })
        this.data.self=e.detail.value
      },
    inputSkillChange : function (e) {
          const inputValue = e.detail.value;
          const textLength = inputValue.length;
      
          this.setData({
            skillLength: textLength,
          })
          this.data.skill=e.detail.value
        },
  /**
   * 选择日期出生日期
   * @param {*} e 
   */
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
      this.data.date=e.detail.value
      this.setData({
        date:e.detail.value
      })
  },
  /**
   * 选择学历
   * @param {*} e 
   */
  bindEducationChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        education:e.detail.value
      })

  },
  /**
   * 选择性别
   * @param {*} e 
   */
  bindSexChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sex:e.detail.value
    })

  },
  /**
   * 选择婚姻状况
   * @param {*} e 
   */
  bindMarryChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      marry: e.detail.value
    })
  },
  editClick() {
    this.setData({
      show: true,
      hobby: false
    })
  },
  // 添加兴趣爱好【注意：itemList最长6】
  addHobbyClick() {
    var that = this;
    var list = ['自定义', '打篮球', '打羽毛球', '游泳', '爬山', '踢足球'];
    var attr = this.data.labelList;
    wx.showActionSheet({
      itemList: list,
      success(res) {
        if (res.tapIndex == 0) {
          that.setData({
            show: true,
            hobby: true
          })
        } else {
          that.setData({
            labelList: attr.concat(list[res.tapIndex])
          })
        }
      }
    })
  },
  // 添加证件照头像、证书【type为0则为上传证件照头像，反之为证书图片】
  selectImage(e) {
    var that = this;
    var type = e.currentTarget.dataset.tag;
    var attr = this.data.attrImg;
    wx.chooseMedia({
      count: type == '0' ? 1 : 6,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        console.log(res)
        var filePath=res.tempFiles[0].tempFilePath
        wx.showLoading({
          title: '上传中...',
        });
        wx.cloud.uploadFile({
          cloudPath: "images/" + new Date().getTime() + '.png',
          filePath: filePath,
          success: (res) => {
            console.log('上传成功', res);
            filePath=res.fileID
            if (type == '0') {
              that.setData({
                'tempList.avatarTemp': filePath
              })
            } else {
              that.setData({
                attrImg: attr.concat(filePath)
              })
            }
            // 隐藏加载提示
            wx.hideLoading();
          },
          fail: (error) => {
            // 隐藏加载提示
            wx.hideLoading();
            console.error('上传失败', error);
          }
        });
      }
    })
  },
  // 长安删除图片
  longtapDeleteImg(e) {
    let that = this;
    let tag = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定删除该图片吗？',
      complete: (res) => {
        if (res.confirm) {
          var list = that.data.attrImg;
          list.splice(tag, 1);
          that.setData({
            attrImg: list
          })
        }
      }
    })
  },
  // 图片查看
  previewClick(e) {
    let path = e.currentTarget.dataset.url;
    wx.previewImage({
      current: path, // 当前显示图片的http链接
      urls: this.data.attrImg // 需要预览的图片http链接列表
    })
  },
  // 兴趣爱好输入监听
  inputHobbyClick(e) {
    this.setData({
      hobbyVal: e.detail.value
    })
  },
  // 昵称姓名输入监听
  inputNick(e) {
    this.setData({
      'tempList.nameTemp': e.detail.value
    })
  },
  // 联系电话输入监听
  inputPhone(e) {
    this.setData({
      'tempList.phoneTemp': e.detail.value
    })
  },
  // 长安删除兴趣爱好标签
  longtapDeleteLabel(e) {
    let that = this;
    let tag = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定删除该爱好标签吗？',
      complete: (res) => {
        if (res.confirm) {
          var list = that.data.labelList;
          list.splice(tag, 1);
          that.setData({
            labelList: list
          })
        }
      }
    })
  },
  // 取消监听
  cancelMask() {
    this.setData({
      show: false,
      hobbyVal: '',
      'tempList.avatarTemp': this.data.avatar,
      'tempList.nameTemp': this.data.nickName,
      'tempList.phoneTemp': this.data.phone
    })
  },
  // 确定监听
  defineMask() {
    if (this.data.hobby) {
      if (this.data.hobbyVal == '') {
        wx.showToast({
          title: '兴趣爱好不能为空哦',
          icon: 'none'
        })
      } else {
        var attr = this.data.labelList;
        this.setData({
          show: false,
          hobbyVal: '',
          labelList: attr.concat(this.data.hobbyVal)
        })
      }
    } else {
      this.setData({
        show: false,
        avatar: this.data.tempList.avatarTemp,
        nickName: this.data.tempList.nameTemp,
        phone: this.data.tempList.phoneTemp
      })
    }
  },
})
