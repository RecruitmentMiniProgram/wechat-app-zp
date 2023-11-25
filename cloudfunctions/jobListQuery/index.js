// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const {jobList} = event;
  try {
    // const res = await db.collection('post').where({_id:jobId}).get();
    // const jobList = res.data;
    
    // 使用 for...of 循环确保等待异步操作完成
    for (const job of jobList) {
      const companyId = job.companyId;
      // 使用 await 等待异步操作完成
      const companyRes = await db.collection('company').where({ _id: companyId }).get();
      // 设置 job 的 company 属性
      job.company = companyRes.data[0];
    }
    const wxContext = cloud.getWXContext();
    return jobList;
  } catch (error) {
    console.error('Error executing cloud function:', error);
    return {
      errorCode: -1,
      errorMessage: error.message,
      statusCode: 443
    };
  }
}