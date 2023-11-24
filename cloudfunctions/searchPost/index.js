const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();

exports.main = async (event, context) => {
  const { keyword } = event;

  try {
    const collectionInfo = await db.collection('yourCollection').limit(1).get();
    const fields = collectionInfo.data[0];
    const result = await db.collection('post')
      .where(
        db.command.or(
          // 对集合中所有字段应用模糊搜索
          Object.keys(fields).map(field => ({
            [field]: db.RegExp({ regexp: keyword, options: 'i' })
          }))
        )
      )
      .get();

    return result.data;
  } catch (err) {
    console.error(err);
    return err;
  }
};
