// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("发送手机短信验证码")
  try {
    const result = await cloud.openapi.cloudbase.sendSms({
        "env": 'haianjiuye-9gwh0gp7bb2e3aa1',
        "content": '您的验证码是：'+event.code+'​​。请不要将验证码泄露给他人，有效期为10分钟。如非本人操作，请忽略本消息。',
        // "path": '/index.html',
        "phoneNumberList": [
          "+86"+event.phone
        ]
      })
    return result
  } catch (err) {
    return err
  }
}