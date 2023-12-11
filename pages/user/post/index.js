// index.js
const db=wx.cloud.database()
const _=db.command
const util = require('../../../utils/util.js');
Page({
  data: {
    show: false,
    hobby: false,
    arrayEducation: [
      "不限",
      "初中及以下",
      "高中",
      "中专/技校",
      "大专",
      "本科",
      "硕士",
      "博士",
      "MBA/EMBA",
    ],
    arrayExperience: [
      "不限",
      "在校生",
      "应届生",
      "1年以内",
      "1-3年",
      "3-5年",
      "5-10年",
      "10年以上",
    ],
    arrayGraduate:['不接受','接受'],
    arrayKind:['全职','实习','兼职'],
    arraySalary:['面议','不面议'],
    education:0,
    experience:0,
    graduate:0,
    salary:0,
    region:0,
    arrayRegion:[
      "不限",
      "海安镇",
      "孙庄镇",
      "高新区",
      "开发区",
      "滨海新区",
      "城东镇",
      "角斜镇",
      "李堡镇",
      "大公镇",
      "雅周镇",
      "曲塘镇",
      "南莫镇",
      "白甸镇",
      "墩头镇"
    ],
    district:0,
    arrayBusinessDistrict:[
      "不限",
      "火车站",
      "汽车站",
      "万达广场",
      "星湖001",
      "韩洋澳联商业广场",
      "田庄邻里中心"
    ],
    attrImg: [],
    description:'',
    descriptionLength:0,
    responsibility:'',
    responsibilityLength:0,
    kind:0,
    companyId:null,
    //判断是编辑页面 1 还是注册页面 0
    edit:0,
    postId:'',
    minSalary:'',
    maxSalary:'',
    address:'',
    name:'',
    workTime:'',
    logoUrl:'',
    settlement:2,
    arraySettlement:['日','周','月','年'],
    industry:"",
    workList:[],
    welfare:[],
    scale:"",
    age:"18-55周岁",
    ageIndex:[0,0],
    arrayAge:[[],[]],
  },
    /**
     * 获取时间
     * @returns 
     */
    getTime(){
      var currentDate=new Date()
      // 获取年、月、日
      var year = currentDate.getFullYear();
      var month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // 注意月份是从0开始的，需要补零
      var day = ('0' + currentDate.getDate()).slice(-2); // 补零
      // 构建日期字符串
      var formattedDate = year + '-' + month + '-' + day;
      return {
        currentDate:currentDate,
        formattedDate:formattedDate
      }
    },
    bindAgeChange(e){
      var index=e.detail.value
      var minAge=this.data.arrayAge[0][index[0]]
      var maxAge=this.data.arrayAge[1][index[1]]
      if(minAge>maxAge){
        wx.showModal({
          title: '警告',
          content: '请输入合法的年龄',
        })
      }else{
        this.setData({
          age:minAge+"-"+maxAge+"周岁"
        })
      }

    },
    /**
   * 生命周期函数--监听页面加载
   */
    onLoad(options) {
      var tempArray=[[],[]]
      for(var i=16;i<=65;i++){
        tempArray[0].push(i)
        tempArray[1].push(i)
      }
      this.setData({
        arrayAge:tempArray
      })
      this.getCompany()
      this.setData({
        edit:options.edit,
        postId:options.postId
      })
      if(this.data.edit==1){
        this.getPost()
      }
      console.log("onLoad")
    },
    onShow(){
      console.log(this.data.workList)
      this.setData({
        industry:this.data.workList.length==0?'':this.data.workList[this.data.workList.length-1]
      })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
      console.log("onReady")
    },
    /**
     * 获取企业信息
     */
    async getCompany(){
      var id=wx.getStorageSync("companyId")
      let that=this
      that.data.companyId=id
      db.collection("company").doc(id).get()
      .then((result) => {
        that.data.logoUrl=result.data.logo
        that.data.company=result.data.fullName,
        that.data.companyMinName=result.data.minName,
        that.data.boss=result.data.boss
        that.data.tele=result.data.tele
        that.data.attrLogo=[result.data.logo]
        that.data.welfare=result.data.welfare
        that.data.scale=result.data.scale
      }).catch((err) => {
        console.log("加载信息失败",err)
      });
    },

    /**
     * 加载用户信息
     */
    getPost(){
            var id=wx.getStorageSync("companyId")
            let that=this
            that.data.companyId=id
            db.collection("post").doc(this.data.postId).get()
            .then((result) => {
              console.log("岗位信息",result)
              that.setData({
                name:result.data.name,
                description:result.data.description,
                descriptionLength:result.data.description.length,
                salary:this.data.arraySalary.indexOf(result.data.salary),
                minSalary:result.data.min_salary,
                maxSalary:result.data.max_salary,
                education:this.data.arrayEducation.indexOf(result.data.education),
                experience:this.data.arrayExperience.indexOf(result.data.experience),
                address:result.data.position,
                responsibility:result.data.responsibility,
                responsibilityLength:result.data.responsibility.length,
                kind:this.data.arrayKind.indexOf(result.data.kind),
                graduate:result.data.graduate,
                workTime:result.data.workTime,
                logoUrl:result.data.img,
                settlement:this.data.arraySettlement.indexOf(result.data.settlement),
                industry:result.data.industry,
                district:this.data.arrayBusinessDistrict.indexOf(result.data.businessDistrict),
                //TODO
                age:result.data.age
              })
            }).catch((err) => {
              console.log("编辑post时加载信息失败",err)
            });
          },
  industryChange(e){
    console.log("选择产业类型")
    wx.navigateTo({
      url: '/pages/user/category_job/index',
    })
  },
  bindDistrictChange(e){
    this.setData({
      district:e.detail.value
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
      if((this.data.name==''||
        this.data.descriptionLength==0||
        ((this.data.minSalary==''||this.data.maxSalary=='')
        &&this.data.salary==1)||
        (this.data.region==''&&this.data.address=='')||
        this.data.responsibilityLength==0)){
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
        var id=wx.getStorageSync("companyId")
        this.data.companyId=id
        //将企业的数据存到数据库中
        var date=this.getTime()
        var postData={
          companyId:this.data.companyId,
          name:this.data.name,
          description:this.data.description,
          min_salary:this.data.salary==0?-1:this.data.minSalary,
          max_salary:this.data.salary==0?-1:this.data.maxSalary,
          education:this.data.arrayEducation[this.data.education],
          experience:this.data.arrayExperience[this.data.experience],
          position:this.data.arrayRegion[this.data.region],
          responsibility:this.data.responsibility,
          kind:this.data.arrayKind[this.data.kind],
          graduate:this.data.graduate,
          workTime:this.data.workTime,
          timestamp:date.currentDate,
          time:date.formattedDate,
          img:this.data.logoUrl.length==0?'/images/damage_map.png':this.data.logoUrl,
          salary:this.data.arraySalary[this.data.salary],
          settlement:this.data.arraySettlement[this.data.settlement],
          industry:this.data.industry,
          companyMinName:this.data.companyMinName,
          companyFullName:this.data.company,
          businessDistrict:this.data.arrayBusinessDistrict[this.data.district],
          age:this.data.age,
          welfare:this.data.welfare,
          scale:this.data.scale
        } 
        wx.showLoading({
          title: '更新中...',
        })

        if(this.data.edit==0){
          //使用云函数直接插入数据库中
          db.collection("post").add({
            data:postData
          }).then(res=>{
            console.log("发布职位成功")
            wx.navigateBack()
          }).catch(err=>{
            console.log("发布职位失败")
            wx.hideLoading()
          })
        }else{
          db.collection("post").doc(this.data.postId)
          .update({
            data:postData
          }).then(res=>{
            console.log("编辑职位成功")
            wx.navigateBack()
          }).catch(err=>{
            wx.hideLoading()
            console.log("编辑失败")
          })
        }        
      }
    },


    /**
     * 岗位职责
     * @param {*} e 
     */
    responsibilityChange(e){
      const inputValue = e.detail.value;
      const textLength = inputValue.length;
  
      this.setData({
        responsibilityLength: textLength
      })
      this.data.responsibility=e.detail.value
    },
    /**
   * 岗位描述
   * @param {*} e 
   */
    descriptionChange: function (e) {
      const inputValue = e.detail.value;
      const textLength = inputValue.length;
  
      this.setData({
        descriptionLength: textLength
      })
      this.data.description=e.detail.value
    },

    /**
     * 工作经验
     * @param {*} e 
     */
    experienceChange : function (e) {
      this.setData({
        experience: e.detail.value,
      })
      
    },
    /**
     * 是否接受应届
     * @param {*} e 
     */
    bindGraduateChange(e){
      this.setData({
        graduate: e.detail.value,
      })
    },
    /**
     * 工作种类
     * @param {*} e 
     */
    bindKindChange(e){
      this.setData({
        kind: e.detail.value,
      })
    },
    /**
     * 工作城市
     * @param {*} e 
     */
    bindRegionChange : function (e) {
          this.setData({
            region: e.detail.value,
          })
        },
  /**
   * 结算方式
   * @param {*} e 
   */
  bindSettlementChange : function (e) {
    this.setData({
      settlement: e.detail.value,
    })
  },
  /**
   * 学历要求
   * @param {*} e 
   */
  bindEducationChange: function(e) {
      this.setData({
        education:e.detail.value
      })
  },

  /**
   * 最高月薪
   * @param {*} e 
   */
  maxSalaryChange(e){
    this.setData({
      maxSalary:parseInt(e.detail.value)
    })
  },
  /**
   * 最低月薪
   * @param {*} e 
   */
  minSalaryChange(e){
    this.setData({
      minSalary:parseInt(e.detail.value)
    })
  },
  /**
   * 记录是否面议
   * @param {*} e 
   */
  bindSalaryChange: function(e) {
      this.setData({
        salary:e.detail.value
      })

  },
  /**
   * 记录岗位名字
   * @param {*} e 
   */
  postNameChange: function(e) {
    this.setData({
      name:e.detail.value
    })

  },
  /**
   * 记录工作时间
   * @param {*} e 
   */
  workTimeChange: function(e) {
    this.setData({
      workTime: e.detail.value
    })
  },
  editClick() {
    this.setData({
      show: true,
      hobby: false
    })
  },
  //上传图片
    // 上传图片到云存储
    uploadToCloud: function (filePath) {
      wx.cloud.uploadFile({
        cloudPath: 'uploaded_images/' + new Date().getTime() + '.png', // 云存储路径，这里使用时间戳作为文件名
        filePath: filePath, // 选择的图片文件路径
        success: (res) => {
          console.log('上传成功', res.fileID);
  
          // 更新 data 中的 chosenImages 数组，保存云存储的文件 ID
          this.setData({
            chosenImages: [res.fileID],
          });
        },
        fail: (error) => {
          console.error('上传失败', error);
        },
      });
    },
  // 添加证件照头像、证书【type为0则为上传证件照头像，反之为证书图片】
  selectImage(e) {
    var that = this;
    var type = e.currentTarget.dataset.tag;
    var attr = this.data.attrImg;
    wx.chooseMedia({
      count: 1,
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

            that.setData({
                attrImg: [filePath]
              })
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
    console.log(e)
    let path = e.currentTarget.dataset.url;
    wx.previewImage({
      current: path, // 当前显示图片的http链接
      urls: this.data.attrImg // 需要预览的图片http链接列表
    })
  },


  /**
   * 公司Logo
   */
    // 添加证件照头像、证书【type为0则为上传证件照头像，反之为证书图片】
  selectLogo(e) {
      var that = this;
      wx.chooseMedia({
        count: 1,
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
              that.setData({
                logoUrl: filePath,
                attrLogo:[filePath]
              })
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
    longtapDeleteLogo(e) {
      let that = this;
      let tag = e.currentTarget.dataset.index;
      wx.showModal({
        title: '提示',
        content: '确定删除该图片吗？',
        complete: (res) => {
          if (res.confirm) {
            var list = that.data.attrLogo;
            list.splice(tag, 1);
            that.setData({
              attrLogo: list
            })
          }
        }
      })
    },
    // 图片查看
    previewClickLogo(e) {
      console.log(e)
      let path = e.currentTarget.dataset.url;
      wx.previewImage({
        current: path, // 当前显示图片的http链接
        urls: this.data.attrLogo // 需要预览的图片http链接列表
      })
    },

})
