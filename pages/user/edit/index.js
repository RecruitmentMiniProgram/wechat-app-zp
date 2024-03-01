
const util = require('../../../utils/util.js');
// index.js
const db=wx.cloud.database()
const _=db.command
Page({
  data: {
    show: false,
    hobby: false,
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
    // 编辑时临时数据
    arrayScale: ["不限",
      "0-20人",
      "20-99人",
      "100-499人",
      "500-999人",
      "1000-9999人",
      "10000人以上"
      ],
    scale:0,
    attrImg: [],
    introductionLength:0,
    addressLength:0,
    introduction:'',
    address:'',
    company:'',
    boss:'',
    tele:'',
    industry:"",
    arrayIndustry:[],
    website:"",
    minName:"",
    logoUrl:"",
    beginDate:"",
    companyId:null,
    welfare:[],
    //邀请码，只有注册时才有效
    invitation:'',
    //判断是编辑页面 1 还是注册页面 0
    edit:0,
    today:new Date().getFullYear+"-"+(new Date().getMonth+1)+"-"+new Date().getDate()
  },

    /**
   * 生命周期函数--监听页面加载
   */
    onLoad(options) {

      this.setData({
        edit:options.edit
      })
      util.readJson()
      .then(res=>{
        console.log("读取成功")
        console.log(res)
        var data=res.data["industry"]
        var arrayIndustry=[]
        data.forEach(element => {
          arrayIndustry.push(element.name)
        });
        this.setData({
          arrayIndustry:arrayIndustry
        })
      }).catch(err=>{
        console.log(err)
      })
      console.log("onLoad")
    },
    onShow(){
      if(this.data.edit==1){
        this.getCompany()
      }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
      console.log("onReady")
    },
    /**
     * 加载用户信息
     */
    getCompany(){
            const myComponent = this.selectComponent('#welfare');
            var id=wx.getStorageSync("companyId")
            let that=this
            that.data.companyId=id
            db.collection("company").doc(id).get()
            .then((result) => {
              console.log("加载企业信息",result)
              that.setData({
                logoUrl:result.data.logo.length==0?'/images/damage_map.png':result.data.logo,
                scale:this.data.arrayScale.indexOf(result.data.scale),
                attrImg: [result.data.certification],
                introductionLength:result.data.introduction.length,
                addressLength:result.data.address.length,
                introduction:result.data.introduction,
                address:result.data.address,
                company:result.data.fullName,
                boss:result.data.boss,
                tele:result.data.tele,
                industry:this.data.arrayIndustry.indexOf(result.data.industry),
                region:result.data.region?this.data.arrayRegion.indexOf(result.data.region):0,
                welfare:result.data.welfare?result.data.welfare:[],
                website:result.data.website,
                minName:result.data.minName,
                attrLogo:[result.data.logo],
                beginDate:result.data.incorporationDate,
              })
              myComponent.updateLabelList(this.data.welfare)
            }).catch((err) => {
              console.log("加载信息失败",err)
            });
          },
  /**
   * 选择区域
   * @param {*} e 
   */ 
  bindRegionChange(e){
    this.setData({
      region:e.detail.value
    })
  },        
  /**
   * 注册时间
   * @param {*} e 
   */
  bindBeginDateChange(e){
    this.setData({
      beginDate:e.detail.value
    })
    console.log(this.data.beginDate)
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
     * 公司简称
     * @param {*} e 
     */
    companyMinNameChange(e){
      this.setData({
        minName:e.detail.value
      })
    },
    /**
     * 公司官网
     * @param {*} e 
     */
    websiteChange(e){
      this.setData({
        website:e.detail.value
      })
    },
    industryChange(e){
      this.setData({
        industry:e.detail.value
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
      if((this.data.company==''||
        this.data.tele==''||
        this.data.boss==''||
        this.data.address==''||
        this.data.scale==''||
        this.data.attrImg.length==0||
        this.data.introductionLength==0)){
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
        const myComponent = this.selectComponent('#welfare');
        this.data.welfare=myComponent.data.labelList
        var phone=wx.getStorageSync('phone')
        //将企业的数据存到数据库中
        var companyData={
          minName:this.data.minName,
          fullName:this.data.company,
          scale:this.data.arrayScale[this.data.scale],
          certification:this.data.attrImg[0],
          tele:this.data.tele,
          address:this.data.address,
          introduction:this.data.introduction,
          incorporationDate:this.data.beginDate,
          industry:this.data.arrayIndustry[this.data.industry],
          logo:this.data.logoUrl.length==0?'/images/damage_map.png':this.data.logoUrl,
          website:this.data.website,
          boss:this.data.boss,
          invitation:0,
          examine:0,
          createTime:new Date(),
          welfare:this.data.welfare,
          region:this.data.arrayRegion[this.data.region],
          recommend:0,
          idPhone:phone
        } 
        wx.showLoading({
          title: '更新中...',
        })

        if(this.data.edit==0){
          //使用云函数直接插入数据库中

          wx.cloud.callFunction({
            name: 'companylogin',
            data: {
              data:companyData,
              phone:phone
            }
          }).then(res=>{
            //根据邀请码给予奖励
            if(this.data.invitation.length!=0){
              try{
                let id=this.data.invitation.split('::')[1]
                db.collection('company').doc(id).update({
                  data:{
                    invitation:_.inc(1)
                  }
                })
              }catch(err){
                console.log("企业邀请码失效:",err)
              }
            }
            wx.setStorageSync(
              "companyId",res.result.data.company._id
            )
            wx.setStorageSync(
              "userId",''
            )
            wx.setStorageSync(
              "status",2
            )

          }).then(res=>{
            console.log("企业用户注册成功")
            // 跳转到个人中心
            wx.switchTab({
              url: '../index',
            })
          }).catch(err=>{
            wx.hideLoading()
            console.log("企业用户注册失败")
          })

        }else{
          db.collection("company").doc(this.data.companyId)
          .update({
            data:companyData
          }).then(res=>{
            wx.navigateBack()
          }).catch(err=>{
            wx.hideLoading()
            console.log("编辑失败")
          })
        }        
      }
    },




    /**
   * 公司简介
   * @param {*} e 
   */
    introductionChange: function (e) {
      const inputValue = e.detail.value;
      const textLength = inputValue.length;
  
      this.setData({
        introductionLength: textLength
      })
      this.data.introduction=e.detail.value
    },
      addressChange : function (e) {
          const inputValue = e.detail.value;
          const textLength = inputValue.length;
      
          this.setData({
            addressLength: textLength,
          })
          this.data.address=e.detail.value
        },
  /**
   * 公司规模
   * @param {*} e 
   */
  bindScaleChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
      this.data.date=e.detail.value
      this.setData({
        scale:e.detail.value
      })
  },
  /**
   * 记录联系方式
   * @param {*} e 
   */
  phoneChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        tele:e.detail.value
      })

  },
  /**
   * 记录公司名字
   * @param {*} e 
   */
  companyChange: function(e) {
    this.setData({
      company:e.detail.value
    })

  },
  /**
   * 记录联系人
   * @param {*} e 
   */
  bossChange: function(e) {
    this.setData({
      boss: e.detail.value
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
        cloudPath: 'images/' + new Date().getTime() + '.png', // 云存储路径，这里使用时间戳作为文件名
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
            attrImg: []
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
