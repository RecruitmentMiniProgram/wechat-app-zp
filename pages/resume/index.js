// index.js
const db=wx.cloud.database()
const _=db.command
Page({
  data: {
    show: false,
    hobby: false,

    defaultUrl:'cloud://haianjiuye-9gwh0gp7bb2e3aa1.6861-haianjiuye-9gwh0gp7bb2e3aa1-1322761802/static/male.png',
    avatar: 'cloud://haianjiuye-9gwh0gp7bb2e3aa1.6861-haianjiuye-9gwh0gp7bb2e3aa1-1322761802/static/male.png',
    nickName: '请填写姓名',
    phone: '请填写手机号',
    // 编辑时临时数据
    tempList: {
      avatarTemp: 'cloud://haianjiuye-9gwh0gp7bb2e3aa1.6861-haianjiuye-9gwh0gp7bb2e3aa1-1322761802/static/male.png',
      nameTemp: '请填写用户名',
      phoneTemp: '请填写手机号',
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
    invitation:0,
    realIntentionData:null,
    today:new Date().getFullYear+"-"+(new Date().getMonth+1)+"-"+new Date().getDate(),
    itemStyle: []// 用于存储每个 item 的样式
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
  bindRegionChange(e){
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
   * 邀请码
   * @param {*} e 
   */
    invitationChange(e){
      this.setData({
        invitation:e.detail.value
      })
    },
    /**
   * 提交数据
   * @param {*} e 
   */
    formSubmit(e){
      if(0||(this.data.nickName=='请填写姓名'||
        this.data.phone=='请填写手机号'||
        this.data.sex==''||
        this.data.education==''||
        this.data.date==''||
        this.data.experience.length==0||
        this.data.realIntentionData==null)){
        wx.showModal({  
          title: '提示',  
          content: '请补充完整必填项',  
          success: function(res) {  
            if (res.confirm) {  
              // 点击确定按钮触发的回调函数  
            } else if (res.cancel) {  
              // 点击取消按钮触发的回调函数  
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
              } else if (res.cancel) {  
                // 点击取消按钮触发的回调函数  
              }  
            }  
          })
        }else{
            //将用户的数据存到数据库中
        var idPhone=wx.getStorageSync('phone')
        var userData={
          name:this.data.nickName,
          sex:this.data.arraySex[this.data.sex],
          age:this.data.date,
          experience:this.data.experience,
          intention:this.data.realIntentionData,
          degree:this.data.arrayEducation[this.data.education],
          work:this.data.realWorkList,
          education:{
            school:this.data.school,
            major:this.data.major,
            beginDate:this.data.beginDate,
            endDate:this.data.endDate
          },
          skill:this.data.skill,
          phone:this.data.phone,
          resume:'',
          address:this.data.region,
          deliver:0,
          communication:0,
          collection:[],
          interview:0,
          headUrl:this.data.avatar==this.data.defaultUrl?(this.data.sex==0?'/images/female.png':'/images/male.png'):this.data.avatar,
          self:this.data.self,
          email:this.data.email,
          invitation:0,
          createTime:new Date(),
          idPhone:idPhone
        }
        
          //使用云函数直接插入数据库中
          // TODO
          wx.cloud.callFunction({
            name: 'userlogin',
            data: {
              data:userData
            }
          }).then(res=>{
            console.log("用户注册成功",res)
            wx.setStorageSync(
              "userId",res.result.data.user._id
            )
            wx.setStorageSync(
              "status",1
            )
            wx.setStorageSync(
              "companyId",''
            )
            if(this.data.invitation.length!=0){
              try{
                let id=this.data.invitation.split('::')[1]
                db.collection('user').doc(id).update({
                  data:{
                    invitation:_.inc(1)
                  }
                })
              }catch(err){
                console.log("用户邀请码失效:",err)
              }
            }
          }).then(res=>{
            // 跳转到个人页面
            wx.switchTab({
              url: '../user/index'
            })
          }).catch(err=>{
            console.log("用户注册失败:",err)
          })
        }
      }
    },
  onShow(){
    //检查回传的数据
    if(this.data.intentionData!=null||this.data.intentionData!=undefined){
      this.setData({
        realIntentionData:this.data.intentionData
      })
    }
    if(this.data.workList!=[]||this.data.workList!=undefined){
      this.setData({
        realWorkList:this.data.workList
      })
    }

  },
  /**
   * 专业
   * @param {*} e 
   */
  majorChange(e){
    this.setData({
      major:e.detail.value
    })
  },
  /**
   * 毕业时间
   */
  bindEndDateChange(e){
    this.setData({
      endDate:e.detail.value
    })
  },
  /**
   * 入学时间
   * @param {*} e 
   */
  bindBeginDateChange(e){
    this.setData({
      beginDate:e.detail.value
    })
  },
  /**
   * 记录学校
   * @param {*} e 
   */
  schoolChange(e){
    this.setData({
      school:e.detail.value
    })
  },
  /**
   * 邮箱
   * @param {} e 
   */
  emailChange(e){
    this.setData({
      email:e.detail.value
    })

  },
  /**
   * 求职意向
   * @param {} e 
   */
  intentionChange(e){
    wx.navigateTo({
      url: './intention/index',
    })
  },
  /**
   * 工作经历
   * @param {*} e 
   */
  workChange(e){
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
      this.setData({
        education:e.detail.value
      })

  },
  /**
   * 选择性别
   * @param {*} e 
   */
  bindSexChange: function(e) {
    this.setData({
      sex:e.detail.value
    })

  },
  /**
   * 选择婚姻状况
   * @param {*} e 
   */
  bindMarryChange: function(e) {
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
        var filePath=res.tempFiles[0].tempFilePath
        wx.showLoading({
          title: '上传中...',
        });
        wx.cloud.uploadFile({
          cloudPath: "images/" + new Date().getTime() + '.png',
          filePath: filePath,
          success: (uploadRes) => {
            filePath=uploadRes.fileID
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
