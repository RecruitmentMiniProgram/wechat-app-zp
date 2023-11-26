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

  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
  return [year, month, day].map(formatNumber).join('-')
}

var formatDateString = function (inputDate) {
  var formattedDate = inputDate.substring(5);
  return formattedDate;
}


function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}

// 上传图片到云存储
async function uploadToCloud(filePath, mode) {
  var prefix = mode == 0 ? 'resume/' : 'images/'
  var cloudRes = null
  wx.cloud.uploadFile({
    cloudPath: prefix + new Date().getTime() + '.png',
    filePath: filePath,
    success: (res) => {
      console.log('上传成功', res);
      cloudRes = res
      console.log(cloudRes)
    },
    fail: (error) => {
      console.error('上传失败', error);
    }
  });
}
module.exports = {
  formatTime: formatTime,
  formatDateString: formatDateString,
  json2Form: json2Form,
  uploadToCloud: uploadToCloud,
}
