// 云函数入口文件
//用户注册
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db=cloud.database()
const _=db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log("个人用户登入/注册")
  //插入到用户表中
  var user=await db.collection('user').add(
    {
      data:event.data
    }
  )
  //插入到类型表中
  var userType=await db.collection('userType').add({
    data:{
      phone:event.data.phone,
      userType:0
    }
  })
  const res={
    user:user,
    userType:userType
  }
 const wxContext = cloud.getWXContext()
 return await {
   msg:"个人用户注册",
   data:res,
   openid: wxContext.OPENID,
   appid: wxContext.APPID
 }
}