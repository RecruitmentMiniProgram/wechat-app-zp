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
        goods: [],
        // 取消 按钮 是否显示
        isFocus: false,
        // 输入框的值
        inValue: ""
    },
        // 分页需要的参数
        QueryParams: {
            query: "",
            cid: "",
            pageNo: 1,
            pageSize: 100,
            // 职位类型
            jobType: "1"
        },
    TimeId: -1,
    // 输入框的值打印就会触发的事件
    handleInput(e) {
      const that = this;
        // 1 获取输入框的值
        const { value } = e.detail;
        // 2 检测合法性
        if (!value.trim()) {
            that.setData({
                    goods: [],
                    isFocus: false
                })
                // 不合法
            return
        }
        // 3 准备发送请求获取数据
        that.QueryParams.query=value;
        that.setData({
            isFocus: true
        })
        clearTimeout(that.TimeId);
        that.TimeId = setTimeout(() => {
            that.qsearch();
        }, 1000);
    },
    async qsearch() {
      const that = this;
        // const res = await request({ url: "/home/qsearch", data: this.QueryParams });
        // console.log(res);
        // this.setData({
        //     goods: res
        // })
        try {
          const res = await wx.cloud.callFunction({
            name: 'searchpost',
            data: {
              keyword: that.QueryParams.query
            }
          });
      
          console.log(res.result);
          that.setData({
            goods: res.result
          });
        } catch (err) {
          console.error(err);
        }
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