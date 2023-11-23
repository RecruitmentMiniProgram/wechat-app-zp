
const utils = require('../../../utils/util.js');
// index.js
Page({
  data: {
    show: false,
    hobby: false,
    // 编辑时临时数据
    tempList: {
      avatarTemp: 'https://img0.baidu.com/it/u=345359896,661384602&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      nameTemp: '布吉岛',
      phoneTemp: '0000000000',
    },
    arrayScale: ['10人以上', '50人以上', '100人以上', '500人以上', '1000人以上', '5000人以上','10000人以上'],
    scale:'',
    attrImg: [],
    introductionLength:0,
    addressLength:0,
    introduction:'',
    address:'',
    company:'',
    boss:'',
    tele:'',
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
        //将企业的数据存到数据库中
        var companyData={
          name:this.data.company,
          scale:this.data.arrayScale[this.data.scale],
          certification:this.data.attrImg,
          tele:this.data.tele,
          address:this.data.address,
          introduction:this.data.introduction
        }
        
          //使用云函数直接插入数据库中
          // TODO
          wx.cloud.callFunction({
            name: 'companylogin',
            data: {
              data:companyData
            }
          }).then(res=>{
            console.log("企业用户注册成功")
            console.log(res)
            wx.setStorageSync(
              "companyId",res.result.data.company._id
            )
            wx.setStorageSync(
              "userId",''
            )
            wx.setStorageSync(
              "status",2
            )
            // 跳转到个人页面
            wx.redirectTo({
              url: '../../company/index',
            })
          }).catch(err=>{
            console.log("企业用户注册失败")
          })
        
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
    console.log(e)
    let path = e.currentTarget.dataset.url;
    wx.previewImage({
      current: path, // 当前显示图片的http链接
      urls: this.data.attrImg // 需要预览的图片http链接列表
    })
  },




})
