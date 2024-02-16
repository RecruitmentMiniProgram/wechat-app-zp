// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("发送手机短信验证码")
  try {
    // const result = await cloud.openapi.cloudbase.sendSms({
    //     "env": 'haianjiuye-9gwh0gp7bb2e3aa1',
    //     "content": event.code,
    //     "phoneNumberList": [
    //       "+86"+event.phone
    //     ]
    //   })
    const result = await cloud.openapi.cloudbase.sendSms({

      "env": "haianjiuye-9gwh0gp7bb2e3aa1", // 环境ID
      
      "phone_number_list":
      
      ["+86"+event.phone
      ],
      "sms_type": 'Notification',
      "template_id": '10000022',
      "template_param_list":
      [event.code,'登录','5'
      ]
      });
    console.log("Result:",result)
    return result
  } catch (err) {
    console.log("Err:",err)
    return err
  }
}