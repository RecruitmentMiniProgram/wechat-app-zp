// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const _=db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log("查询用户类型")
  var res=await db.collection('userType').where({
     phone:_.eq(event.phone)
  }). get()
  const wxContext = cloud.getWXContext()
  return await {
    msg:"查询用户类型",
    data:res,
    openid: wxContext.OPENID,
    appid: wxContext.APPID
  }
}
