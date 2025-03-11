// pages/wallet/wallet.js
const app = getApp()

Page({
  data: {
    balance: 0.00,          // 钱包余额
    rechargeAmount: '',     // 充值金额
    paymentMethod: 'wechat', // 支付方式
    quickAmounts: [50, 100, 200, 500], // 快捷金额
    activeAmount: null,     // 选中的快捷金额
    paymentMethods: [       // 支付方式配置
      {
        value: 'wechat',
        name: '微信支付',
        desc: '微信安全支付',
        icon: '/static/icons/wechat-pay.png'
      },
      {
        value: 'alipay',
        name: '支付宝',
        desc: '支付宝快捷支付',
        icon: '/static/icons/alipay.png'
      }
    ]
  },

  onShow() {
    this.loadWalletBalance()
  },

  // 加载钱包余额
  async loadWalletBalance() {
    wx.showLoading({ title: '加载中' })
    try {
      const { data } = await wx.request({
        url: 'https://your-api.com/wallet',
        header: {
          'X-User-Id': app.globalData.userId,
          'Authorization': app.globalData.token
        }
      })
      this.setData({ balance: data.balance.toFixed(2) })
    } catch (error) {
      wx.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },

  // 输入金额处理
  inputAmount(e) {
    const value = e.detail.value
    this.setData({ 
      rechargeAmount: value,
      activeAmount: this.data.quickAmounts.includes(Number(value)) ? Number(value) : null
    })
  },

  // 快捷金额选择
  selectAmount(e) {
    const amount = Number(e.currentTarget.dataset.amount)
    this.setData({
      rechargeAmount: amount.toString(),
      activeAmount: amount
    })
  },

  // 支付方式选择
  selectMethod(e) {
    this.setData({ paymentMethod: e.detail.value })
  },

  // 处理充值请求
  async handleRecharge() {
    if (!this.validateInput()) return

    wx.showLoading({ title: '支付中...' })
    try {
      // 调用支付接口
      const paymentRes = await this.processPayment()

      // 更新本地余额
      const newBalance = this.data.balance + Number(this.data.rechargeAmount)
      this.setData({ balance: newBalance.toFixed(2) })
      
      wx.showToast({ title: '充值成功' })
    } catch (error) {
      wx.showToast({ title: '支付失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },

  // 支付处理逻辑
  async processPayment() {
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        ...this.getPaymentParams(), // 获取支付参数
        success: resolve,
        fail: reject
      })
    })
  },

  // 获取支付参数（示例）
  getPaymentParams() {
    const amount = Number(this.data.rechargeAmount) * 100 // 转为分
    return {
      timeStamp: Date.now().toString(),
      nonceStr: Math.random().toString(36).substr(2, 15),
      package: `prepay_id=${this.generatePrepayId()}`,
      signType: 'MD5',
      paySign: this.generateSign(),
      totalFee: amount
    }
  },

  // 生成模拟预支付ID
  generatePrepayId() {
    return `prepay_${Date.now()}${Math.floor(Math.random()*1000)}`
  },

  // 生成模拟签名
  generateSign() {
    return Math.random().toString(36).substr(2, 32)
  },

  // 输入验证
  validateInput() {
    const amount = Number(this.data.rechargeAmount)
    if (!amount || amount <= 0) {
      wx.showToast({ title: '请输入有效金额', icon: 'none' })
      return false
    }
    if (amount > 10000) {
      wx.showToast({ title: '单次充值不能超过1万元', icon: 'none' })
      return false
    }
    return true
  }
})