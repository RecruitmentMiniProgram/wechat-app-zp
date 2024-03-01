Page({
  data:{
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
    arrayEducation: ['小学', '初中', '高中', '大专', '本科', '硕士','博士'],
    intentionData:null,
    invitation:0,
    realIntentionData:null
  },
  generateRandomString(length=6) {  
    var result = '';  
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;  
    for (var i = 0; i < length; i++) {  
        result += characters.charAt(Math.floor(Math.random() * charactersLength));  
    }  
    return result;  
  },
  onLoad(options) {
    wx.hideLoading()
  },
  userRegister: function() {
    console.log("个人用户注册")
    wx.navigateTo({
      url: '../resume/index', // 请根据实际路径修改
    });
    //将用户的数据存到数据库中
    // var phone=wx.getStorageSync('phone')
    // var userData={
    //   name:this.generateRandomString(6),
    //   sex:"男",
    //   age:"",
    //   experience:this.data.experience,
    //   intention:{},
    //   degree:this.data.arrayEducation[0],
    //   work:this.data.workList,
    //   education:{
    //     school:this.data.school,
    //     major:this.data.major,
    //     beginDate:this.data.beginDate,
    //     endDate:this.data.endDate
    //   },
    //   skill:"",
    //   phone:phone,
    //   resume:'',
    //   address:this.data.region,
    //   deliver:0,
    //   communication:0,
    //   collection:[],
    //   interview:0,
    //   headUrl:'/images/male.png',
    //   self:'',
    //   email:this.data.email,
    //   invitation:0,
    //   createTime:new Date(),
    //   idPhone:phone
    // }
      //使用云函数直接插入数据库中
      // TODO
      // wx.cloud.callFunction({
      //   name: 'userlogin',
      //   data: {
      //     data:userData
      //   }
      // }).then(res=>{
      //   console.log("用户注册成功",res)
      //   wx.setStorageSync(
      //     "userId",res.result.data.user._id
      //   )
      //   wx.setStorageSync(
      //     "status",1
      //   )
      //   wx.setStorageSync(
      //     "companyId",''
      //   )
      //   if(this.data.invitation.length!=0){
      //     try{
      //       let id=this.data.invitation.split('::')[1]
      //       db.collection('user').doc(id).update({
      //         data:{
      //           invitation:_.inc(1)
      //         }
      //       })
      //     }catch(err){
      //       console.log("用户邀请码失效:",err)
      //     }
      //   }
      // }).then(res=>{
      //   // 跳转到个人页面
      //   wx.switchTab({
      //     url: '../user/index'
      //   })
      // }).catch(err=>{
      //   console.log("用户注册失败:",err)
      // })
  },

  companyRegister: function() {
    console.log("企业用户注册")
    wx.navigateTo({
      url: '../user/edit/index?edit=0', // 请根据实际路径修改
    });
  },
});
