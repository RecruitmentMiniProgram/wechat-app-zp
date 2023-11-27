// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db=cloud.database()
const _=db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const { idsToDelete } = event;

  try {
    // 遍历 idsToDelete，删除数据库中的每一条记录
    const deletions = idsToDelete.map(async (e) => {
      console.log(e)
      await db.collection('resume').where({
        post_id:e._id
      }).remove();
    });

    // 等待所有删除完成
    await Promise.all(deletions);

    return {
      code: 0,
      message: '批量删除成功'
    };
  } catch (err) {
    console.error(err);
    return {
      code: 1,
      message: '批量删除失败'
    };
  }
}