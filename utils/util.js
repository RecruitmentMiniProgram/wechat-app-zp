// console.log('util.js is running');  // 添加这行日志
// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }

// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

function formatTime(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

module.exports = {
  formatTime: formatTime
}


function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}
module.exports = {
  json2Form: json2Form,
}
  // 上传图片到云存储
  async function uploadToCloud(filePath,mode) {
    var prefix=mode==0?'resume/':'images/'
    var cloudRes=null
    wx.cloud.uploadFile({
      cloudPath: prefix + new Date().getTime() + '.png',
      filePath: filePath,
      success: (res) => {
        console.log('上传成功', res);
        cloudRes=res
        console.log(cloudRes)
      },
      fail: (error) => {
        console.error('上传失败', error);
      }
    });
  }
  module.exports = {
    uploadToCloud: uploadToCloud,
  }
