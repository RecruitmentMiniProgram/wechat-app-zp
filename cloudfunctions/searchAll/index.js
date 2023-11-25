/**
 * 该函数用于查询所有的表
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db=cloud.database()
const _=db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const table=event.table
  const query=event.query
  // 只会查询最近的50条
  const res1=await db.collection(table).where(query)
  .count()
  const res2=await db.collection(table).where(query)
          .skip(res1.total>=50?res1.total-50:0)
          .limit(50)
          .get()
  console.log(res2)
  return await {
    msg:"查询"+table+"的记录",
    data: res2
  }
}