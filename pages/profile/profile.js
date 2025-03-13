// pages/profile/profile.js
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
    currentTab: 'all'
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    wx.navigateTo({
      url: `/pages/list/list?type=${tab}`
    })
  }
})