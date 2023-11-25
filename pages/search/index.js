/*
1 输入框绑定 值改变事件 input事件
  1 获取合法性输入框的值
  2 合法性判断
  3 检验通过
  4 返回的数据打印
2 防抖(防止抖动)  定时器 节流
  0 防抖 一般 输入框中 防止重复输入 重复发送请求
  1 节流 一般是用在页面下拉和上拉
  1 定义全局的定时器id
*/
import { request } from "../../requests/index.js";
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobList: [],
    // 取消 按钮 是否显示
    isFocus: false,
    // 输入框的值
    inValue: ""
  },
  // 分页需要的参数
  QueryParams: {
    query: "广州",
    cid: "",
    pageNo: 1,
    pageSize: 100,
    // 职位类型
    jobType: "1"
  },
  TimeId: -1,

  onLoad(){
    this.qsearch();
  },
  // 输入框的值打印就会触发的事件
  handleInput(e) {
    // const that = this;
    // 1 获取输入框的值
    const { value } = e.detail;
    // 2 检测合法性
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFocus: false
      })
      return
    }
    // 3 准备发送请求获取数据
    this.QueryParams.query = value;

    this.setData({
      isFocus: true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qsearch();
    }, 1000);
  },
  async qsearch() {
    const that = this;

    const keyword = this.QueryParams.query;
    const collectionInfo = await db.collection('post').limit(1).get();
    const fields = Object.keys(collectionInfo.data[0]);

    db.collection('post')
      .where(
        db.command.or(
          // 对集合中所有字段应用模糊搜索
          fields.map(field => ({
            [field]: db.RegExp({ regexp: '^' + keyword, options: '' })
          }))
        )
      )
      .get({
        success:function(res){
          console.log("res",res.data);
          this.setData({
            jobList: res.data
          });
        }
      });
    


    // wx.cloud.callFunction({
    //   name: 'searchPost',
    //   data: {
    //     keyword: this.QueryParams.query
    //   }
    // }).then(res =>{
    //   console.log(res)
    // }).catch(err=>{
    //   console.log("failed")
    // })

    // try {
    //   const res = await wx.cloud.callFunction({
    //     name: 'searchPost',
    //     data: {
    //       keyword: this.QueryParams.query
    //     }
    //   });
    //   // console.log(that.QueryParams.query)

    //   console.log(res.result);
    //   this.setData({
    //     jobList: res.result
    //   });
    // } catch (err) {
    //   console.error(err);
    // }
  },
  // 点击取消
  handelCancel() {
    this.setData({
      inpValue: "",
      isFocus: false,
      goods: []
    })
  }
})