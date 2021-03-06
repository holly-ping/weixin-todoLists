const pageData = {
  data: {
    taskList: [],
    task: '',
    tipsHidden: true,
    pageXStart:0
  },

  onShow: function () {
    this.setData({
      taskList: wx.getStorageSync('taskList') || []
    });
  },

  bindTask: function (e) {
    this.setData({
      task: e.detail.value
    });
  },

  toCreate: function () {
    let taskList = this.data.taskList;
    if (this.data.task.trim().length < 1) {
      this.toShowTips();
    } else {
      taskList.unshift({
        id: Date.now(),
        text: this.data.task,
        done: false
      });
      this.setData({
        task: '',
        taskList: taskList
      });
      wx.setStorageSync('taskList', taskList);
    }

  },

  toggleDone: function (e) {
    let id = e.currentTarget.id;
    let modify = this.data.taskList.map((item) => {
      return item.id == id ? Object.assign({}, item, { done: !item.done }) : item;
    });
    this.setData({
      'taskList': modify
    });
    wx.setStorageSync('taskList', modify);
  },

  toRemove: function (e) {
    let id = e.currentTarget.id;
    wx.showModal({
      title: '警告',
      content: '您确定要删除么？',
      confirmText: '删除',
      confirmColor: '#ff0000',
      success: (res) => {
        if (res.confirm) {
          let modify = this.data.taskList.filter((item) => {
            return item.id != id;
          });
          this.setData({
            'taskList': modify
          });
          wx.setStorageSync('taskList', modify);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })



  },

  toHideTips: function () {
    this.setData({
      tipsHidden: true
    });
  },

  toShowTips: function () {
    this.setData({
      tipsHidden: false
    });
  },

  confirmRemove: function () {

  },

  touchStart: function(e){
    this.setData({ pageXStart: e.changedTouches[0].pageX});
  },

  touchEnd:  function(e) {
    let pageXMove = (e.changedTouches[0].pageX) - this.data.pageXStart
    if (Math.abs(pageXMove) > 35){
      console.log(pageXMove)
      this.toRemove(e)
    }
    
  }
};

Page(pageData);