// pages/profile/profile.js
const app = getApp();

Page({
  data: {
    orderTabs: [
      { label: '全部', value: 'all' },
      { label: '待付款', value: 'unpaid' },
      { label: '待发货', value: 'undelivered' },
      { label: '待评价', value: 'unreviewed' }
    ],
    menuItems: [
      { label: '收货地址管理', url: '/pages/address/address' },
      { label: '钱包管理', url: '/pages/wallet/wallet' }
    ],
    currentTab: 'all',
    userInfo: {
      nickName: '请登录',
      avatarUrl: '/static/icons/default-avatar.png' // 默认头像路径，需确保存在该图片
    }
  },

  onShow() {
    this.updateUserInfo();
  },

  updateUserInfo() {
    const { userInfo } = app.globalData;
    if (userInfo) {
      this.setData({
        userInfo: {
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      });
    } else {
      this.setData({
        userInfo: {
          nickName: '请登录',
          avatarUrl: '/static/icons/default-avatar.png'
        }
      });
    }
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    wx.navigateTo({
      url: `/pages/list/list?type=${tab}`
    });
  },

  async handleLogin() {
    if (!app.globalData.userId) {
      try {
        // 1. 获取微信登录凭证
        const loginRes = await new Promise((resolve, reject) => {
          wx.login({
            success: resolve,
            fail: reject
          });
        });
        const { code } = loginRes;

        // 2. 获取用户信息
        const userInfo = await new Promise((resolve, reject) => {
          wx.getUserProfile({
            desc: '用于完善会员资料',
            success: resolve,
            fail: reject
          });
        });

        // 3. 获取手机号
        const phoneNumber = await app.getPhoneNumber();

        // 调用 app.js 中的 login 方法
        await app.login(code, userInfo.userInfo, phoneNumber);

        this.updateUserInfo();
        wx.showToast({ title: '登录成功' });
      } catch (error) {
        wx.showToast({ title: '登录失败', icon: 'none' });
      }
    }
  }
});