Component({
  data: {
    result: {},
    frameTitle: '',
    flag: false,
    wrapAnimate: 'wrapAnimate',
    bgOpacity: 0,
    frameAnimate: 'frameAnimate',
    titleData: ["商圈", "福利待遇", "经验要求", "学历要求", "公司规模"],
    moreData: [
      { type: 0, id: 0, text: "商圈" },
      { type: 1, id: 0, text: ["不限", "火车站", "汽车站"] },
      { type: 1, id: 0, text: ["万达广场", "星湖001", "韩洋澳联商业广场"] },
      { type: 1, id: 0, text: ["田庄邻里中心"] },

      { type: 0, id: 1, text: "福利待遇" },
      { type: 1, id: 1, text: ["五险", "住房公积金", "提供食宿"] },
      { type: 1, id: 1, text: ["年底双薪", "交通补助", "周末双休"] },
      { type: 1, id: 1, text: ["单休", "调休", "加班补助"] },
      { type: 1, id: 1, text: ["餐补", "话补", "房补"] },
      { type: 1, id: 1, text: ["节日福利", "带薪年假", "班车接送"] },
      { type: 1, id: 1, text: ["工作餐", "年终奖", "免费培训"] },
      { type: 1, id: 1, text: ["晋升空间", "年度旅游", "定期体检"] },

      { type: 0, id: 2, text: "经验要求" },
      { type: 1, id: 2, text: ["不限", "在校生", "应届生"] },
      { type: 1, id: 2, text: ["1年以内", "1-3年", "3-5年"] },
      { type: 1, id: 2, text: ["5-10年", "10年以上", ""] },

      { type: 0, id: 3, text: "学历要求" },
      { type: 1, id: 3, text: ["不限", "初中及以下", "高中"] },
      { type: 1, id: 3, text: ["中专/技校", "大专", "本科"] },
      { type: 1, id: 3, text: ["硕士", "博士", "MBA/EMBA"] },

      { type: 0, id: 4, text: "公司规模" },
      { type: 1, id: 4, text: ["不限", "0-20人", "20-99人"] },
      { type: 1, id: 4, text: ["100-499人", "500-999人", "1000-9999人"] },
      { type: 1, id: 4, text: ["10000人以上"] },
    ],
    btnStyle: {}
  },
  // properties: {
  //   frameTitle: {
  //     type: String,
  //     value: '标题',
  //   }
  // },

  methods: {
    updateData: function (frameTitle, newTitle, newData) {
      this.setData({
        frameTitle: frameTitle,
        titleData: newTitle,
        moreData: newData,
      });
    },
    showFrame() {
      this.setData({ flag: true, wrapAnimate: 'wrapAnimate', frameAnimate: 'frameAnimate' });
    },
    hideFrame(e) {
      const that = this;
      that.setData({ wrapAnimate: 'wrapAnimateOut', frameAnimate: 'frameAnimateOut' });
      setTimeout(() => {
        that.setData({ flag: false })
      }, 400);
    },

    catchNone() {
      //阻止冒泡
    },


    _showEvent() {
      this.triggerEvent("showEvent");
    },
    _hideEvent() {
      this.triggerEvent("hideEvent");
    },
    //点击按钮先查看记录中是否有，如果有则删除并改变按钮颜色，如果没用则记录总模块-子模块并改变按钮颜色
    //
    onChooseClick(event) {
      const id = event.currentTarget.dataset.id
      const title = this.data.titleData[id]
      const name = event.currentTarget.dataset.name;
      var ischoose = true
      let result = this.data.result
      if (title in result) {
        var arr = result[title]
        for (let i = arr.length - 1; i >= 0; i--) {
          if (arr[i] == name) {
            arr.splice(i, 1);
            ischoose = false
            break
          }
        }
        if (ischoose) result[title].push(name)
      } else {
        result[title] = []
        result[title].push(name)
      }

      var btnId = event.currentTarget.id
      var style = this.data.btnStyle
      if (event.currentTarget.id in style) {
        style[btnId] = !style[btnId]
      } else {
        style[btnId] = true
      }
      this.setData({
        btnStyle: style
      })

    },

    //重置
    moreReset(e) {
      //清空当前result
      var result = this.data.result
      for (var i = 0; i < this.data.titleData.length; ++i) {
        result[this.data.titleData[i]] = []
      }
      this.setData({ result: result })

      //清空当前按钮样式
      var btnStyle = this.data.btnStyle
      var moreData = this.data.moreData
      for (var i = 0; i < moreData.length; ++i) {
        if (moreData[i].type == 0) continue
        var id = moreData[i].id
        for (var j = 0; j < moreData[i].text.length; ++j) {
          var name = id + moreData[i].text[j]
          if (name in btnStyle) {
            btnStyle[name] = false
          }
        }
      }
      this.setData({
        btnStyle: btnStyle
      })
      // console.log(this.data.titleData)
      // console.log(this.data.result)
      // console.log(this.data.btnStyle)
    },

    moreConfirm(e) {

      this.triggerEvent('moreConfirm', {
        "result": this.data.result
      });
    },

    //关闭弹窗
    close(e) {
      // console.log('click close button')
      this.hideFrame(e);
    }
  }
})