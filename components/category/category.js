// components/category.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    frameTitle: {
      type: String,
      value: '标题',
    }
  },

  data: {
    result: "全部",
    flag: false,
    wrapAnimate: 'wrapAnimate',
    bgOpacity: 0,
    leftMenuList: [],
    rightContent: [],
    currentIndex: 0,
    currentIndexJob: 0,
    scrollTop: 0,
    top: 0,
    //判断职业分类表是用于搜索还是选择
    isSearch: 1,

    frameAnimate: 'frameAnimate',
    occupation: [
      {
        "name": "普工/技工",
        "subList": ["普工/操作工", "焊工", "镗工", "油漆工", "包装工", "门窗制作", "学徒工", "组装/装配工", "氩弧焊工", "CNC/数控操作工", "注塑工", "切割工", "模具工", "钳工", "磨工", "铣工", "车床工", "铆工/钣金工", "折弯工", "冲压工", "钻工", "抛光工", "镗工", "热处理工", "喷塑工", "刨工", "电镀工", "机加工", "机修工", "锅炉工", "调色/配色师", "万能工"]
      },
      {
        "name": "司机/物流",
        "subList": ["送餐员/外卖骑手", "快递员", "装卸/搬运工", "配/理/拣/发货", "货运司机", "客运司机", "驾校教练", "仓储人员", "调度员", "货运代理", "物流专员", "物流业务"]
      },
      {
        "name": "销售",
        "subList": ["电话销售", "网络销售", "房地产销售", "课程销售", "客户经理", "汽车销售", "金融销售", "医疗销售", "销售管理", "商务", "销售支持", "销售技术支持"]
      },
      {
        "name": "餐饮",
        "subList": ["前厅服务", "厨师", "饮品调制", "餐饮管理"]

      },
      {
        "name": "门店零售",
        "subList": ["店面店员", "零售管理"]
      },
      {
        "name": "安保消防",
        "subList": ["保安/门卫", "交通安全", "安全消防"]
      },
      {
        "name": "运营/客服",
        "subList": ["客服", "新媒体运营", "电商运营", "社区运营", "游戏运营", "内容审核", "运营管理"]
      },
      {
        "name": "人事/行政/财务",
        "subList": ["行政/文员", "财务", "人事"]
      },
      {
        "name": "服务业",
        "subList": ["家政服务", "汽车服务", "物业/维修", "酒店服务", "酒店管理", "旅游", "运动健身", "休闲娱乐服务", "宠物服务", "花艺/婚礼"]
      },
      {
        "name": "生产制造",
        "subList": ["生产质量", "生产营运", "机械仪器", "服装纺织", "食品生产", "雕刻/印刷", "电子/电气", "硬件研发", "化工", "生物制药", "汽车设计与制造", "新能源"]

      },
      {
        "name": "传媒/影视/直播",
        "subList": ["直播", "影视传媒", "编辑出版"]
      },
      {
        "name": "医疗/健康",
        "subList": ["护士/护理", "药店", "医生/医师", "健康/心理"]
      },
      {
        "name": "设计",
        "subList": ["工业/艺术设计", "设计管理", "视觉/交互设计"]
      },
      {
        "name": "市场",
        "subList": ["广告", "公关/媒介", "会展/会务", "策划/执行", "市场营销"]

      },
      {
        "name": "房地产建筑",
        "subList": ["建筑/装修工人", "装修设计", "建筑规划开发", "建筑工程设计", "施工管理"]

      },
      {
        "name": "金融/贸易",
        "subList": ["对外贸易", "采购", "金融风控/服务", "保险", "证券/基金/期货", "银行", "投资金融"]
      },
      {
        "name": "教育培训",
        "subList": ["教师", "特长培训", "职业培训", "教育产品开发", "教育行政"]
      },
      {
        "name": "咨询/翻译/法律",
        "subList": ["咨询", "翻译", "法律/法务"]
      },
      {
        "name": "互联网/通信",
        "subList": ["软件研发", "移动研发", "人工智能", "数据开发/分析", "技术测试", "运维/技术支持", "产品经理", "项目管理", "技术管理", "通信技术"]
      },
      {
        "name": "农/林/牧/渔",
        "subList": ["畜牧/渔业", "农业/林业"]
      },
      {
        "name": "其他职位",
        "subList": ["其他职位"]
      }
    ],




    btnStyle: {},
    currentIndex: 0

  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.initData(this.data.occupation);
    }
  },


  /**
   * 组件的方法列表
   */
  methods: {

    initData: function (occupation) {
      // 初始化数据的逻辑
      const leftMenuList = occupation.map(item => item.name);
      const rightContent = occupation[0].subList;
      var newArray = rightContent.slice();
      newArray.unshift("全部")


      this.setData({
        leftMenuList,
        rightContent: newArray
      });
      // console.log(this.data)
    },

    handleItemTap(e) {
      // 点击事件
      const { index } = e.currentTarget.dataset;
      // let content = this.data.occupation[index].subList;
      let rightContent = this.data.occupation[index].subList;
      var newArray = rightContent.slice();
      newArray.unshift("全部")

      // console.log(e)
      // 2 触发 父组件的事件 自定义
      this.triggerEvent("tabsItemChange", { index });
      this.setData({
        currentIndexJob: 0,
        currentIndex: index,
        rightContent: newArray
      })

    },

    handleJobTap(e) {
      const { index, name } = e.currentTarget.dataset;
      this.setData({
        currentIndexJob: index,
        result: name
      })
    },


    updateData: function (newTitle, newData) {
      this.setData({
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
      // console.log(event)
      // const id = event.currentTarget.dataset.id
      const id = this.data.currentIndex
      const title = this.data.occupation[id].name
      const name = event.currentTarget.dataset.name;
      console.log(id, title, name)

      var ischoose = true
      var result = this.data.result
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

    scrollTop(event) {
      // Your scroll handling logic
    },

    //重置
    moreReset(e) {
      const rightContent = this.data.occupation[0].subList;
      var newArray = rightContent.slice();
      newArray.unshift("全部")


      this.setData({
        rightContent: newArray,
        currentIndexJob: 0,
        currentIndex: 0,
        result: "全部"
      })
    },

    moreConfirm(e) {
      this.triggerEvent('moreConfirm', {
        "result": this.data.result
      });
    },

    //关闭弹窗
    close(e) {
      this.triggerEvent(
        'closeFrame',{

        }
      ) 
      // console.log('click close button')
      this.hideFrame(e);
    }


  }
})