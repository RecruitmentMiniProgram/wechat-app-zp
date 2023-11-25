const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { keyword } = event;
  // try {
  //   const collectionInfo = await db.collection('post').limit(1).get();
  //   const fields = collectionInfo.data[0];
  //   const result = await db.collection('post')
  //     .where(
  //       db.command.or(
  //         // 对集合中所有字段应用模糊搜索
  //         Object.keys(fields).map(field => ({
  //           [field]: db.RegExp({ regexp: keyword, options: '' })
  //         }))
  //       )
  //     )
  //     .get();

  //   return result;
  // } catch (err) {
  //   console.error(err);
  //   return err;
  // }

  try {
    var result = await db.collection('post')
      .where({position: keyword})
      .get();

    return result;
    // const wxContext = cloud.getWXContext()

    // return await {
    //   msg:"搜索地点",
    //   data:result,
    //   openid: wxContext.OPENID,
    //   appid: wxContext.APPID
    // }
  } catch (err) {
    console.error(err);
    return err;
  }
};
