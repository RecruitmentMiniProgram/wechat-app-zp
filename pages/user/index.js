// pages/mine/mine.js
const db=wx.cloud.database()
const _=db.command
Page({
    data: {
      login:true,
      //已经沟通
      communication:0,
      //已经投递
      deliver:0,
      headUrl:null,
      name:"用户名",
      userId:null,
      pdfFile:null,
      //用于指定用户类型 1:个体 2:企业
      status:1,
      windowsHeight:"100%"
    },
    /**
     * 点击进入登入页面
     * @param {*} e 
     */
    onLoginButtonClick(e){
      wx.navigateTo({
        url: '../login/login',
      })
    },
      /**
   * 生命周期函数--监听页面加载
   */
    onLoad(options) {
      this.checkLogin()
      this.initChatInfo()
      wx.hideLoading()
    },

    async initChatInfo() {
      //初始化聊天信息
      var id = null
      var status = wx.getStorageSync("status")
      if(status == 1) id = wx.getStorageSync("userId")
      else id = wx.getStorageSync("companyId")

      var chatListResult = await db.collection('chat_list').where({user_id: id}).get()
      if(chatListResult.data.length == 0) {
        await  db.collection('chat_list').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            user_id: id,
            data:[]
          },
        })
      }

    },
    /**
     * 页面显示时才加载
     */
    onShow(){
      this.checkLogin()
      this.getUser()
    },
    /**
     * 加载用户信息
     */
    getUser(){
      var id=wx.getStorageSync("userId")
      let that=this
      that.data.userId=id
      db.collection("user").doc(id).get()
      .then((result) => {
        console.log("个人用户信息:",result)
        that.data.userData=result.data
        that.setData({
          headUrl:result.data.headUrl,
          name:result.data.name,
          deliver:result.data.deliver,
          communication:result.data.communication,
          pdfFile:(result.data.resume.length==0||result.data.resume==null)?null:result.data.resume
        })
      }).catch((err) => {
        console.log("加载信息失败",err)
      });
    },

    /**
     * 判断是否登入成功
     */
    checkLogin(){
      //判断是否登入成功
      var status = wx.getStorageSync('status')    
      try{
        if(status == 0 || status == null) {        
          //未登录
          this.setData({
            login: false,
          });
          var height=wx.getSystemInfoSync().windowHeight;
          this.setData({
            windowsHeight:height
          })
          console.log(height)
          console.log("未登入")
        } else {
         //登录
          this.setData({
            status:status,
            login: true,
          });
          console.log("登入")
        }
      }catch (e) {
        console.log('读取session发生错误' + e)
      }
    },
    /**
     * 检查文件是否为PDF
     */
    isValidPDF(filePath){    
        console.log(filePath)    
        // 获取文件后缀名
        const fileExtension = filePath.split('.').pop().toLowerCase();

        // 判断文件是否为 PDF
        if (fileExtension === 'pdf') {
          return true
        } else {
          return false
        }
    },
    //查看简历
    showPdf(e){
      if(this.data.pdfFile!=null){
        wx.cloud.downloadFile({
          fileID: this.data.pdfFile,
          success: res => {
            // 2. 下载成功后，可以通过 res.tempFilePath 获取文件的临时路径
            const tempFilePath = res.tempFilePath;
        
            // 3. 使用 wx.saveFile 将文件保存到本地
            wx.saveFile({
              tempFilePath: tempFilePath,
              success: saveRes => {
                // 4. 文件保存成功后，可以通过 saveRes.savedFilePath 获取保存在本地的文件路径
                const savedFilePath = saveRes.savedFilePath;
        
                // 5. 使用 wx.openDocument 打开保存在本地的文件
                wx.openDocument({
                  filePath: savedFilePath,
                  success: openRes => {
                    console.log('打开文档成功');
                  },
                  fail: openErr => {
                    console.error('打开文档失败', openErr);
                  }
                });
              },
              fail: saveErr => {
                console.error('保存文件失败', saveErr);
              }
            });
          },
          fail: err => {
            console.error('下载文件失败', err);
          }
        });
      }else{
        wx.showModal({
          title: '提示',
          content: '请先上传PDF简历',
        })
      }

    },
    //提交简历附件
    submitResume() {
      console.log("上传简历附件只能是PDF")
      // 在小程序中选择文件
      let that=this
      wx.chooseMessageFile({
        count: 1,
        type: 'file',
        success(res) {
          var tempFilePath=res.tempFiles[0].path
          console.log(res)
          if(that.isValidPDF(tempFilePath)){
            wx.showLoading({
              title: '上传中...',
            });
            // 上传文件到服务器
            wx.cloud.uploadFile({
              cloudPath: "resume/" + new Date().getTime() + '.pdf',
              filePath: tempFilePath,
              success(uploadRes) {
                console.log('上传成功', uploadRes);
                // 在这里可以处理上传成功后的逻辑
                var filePath=uploadRes.fileID
                that.setData({
                  pdfFile:filePath
                })
                //将数据更新到user表中
                db.collection("user").doc(that.data.userId).update(
                  { 
                    data:{
                      resume:filePath
                    }
                  }
                ).then((dataRes)=>{
                  console.log("更新user表简历成功")
                  // 隐藏加载提示
                  wx.hideLoading();
                }).catch(dataErr=>{
                  console.log("更新user表失败")
                  wx.hideLoading();
                })

              },
              fail(error) {
                console.error('上传失败', error);
                // 处理上传失败的逻辑
                // 隐藏加载提示
                wx.hideLoading();
              },
            });
          }else{
            wx.showModal({
              title: '提示',
              content: '请上传PDF简历',
            })
          }

        },
      });
    },
    //个人中心的我的余额,点击跳转到我的余额
    resumeChange() {
      console.log("编辑在线简历")
      wx.navigateTo({
        url: './resume/index',
      })
    },
    //个人中心的意见反馈,点击跳转到意见反馈
    view() {
      console.log("意见反馈")
      wx.navigateTo({
        url: './view/view',
      })
    },
    //我的地址
    addr(){
      wx.navigateTo({
        url: '../myAddr/myAddr',
      })
    },
    //退出登录
    signOut(){
      wx.setStorageSync('status', 0)
      wx.setStorageSync('userId','')
      this.setData({
        login:false
      })
    }
  })