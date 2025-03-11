// app.js
App({
  globalData: {
    userInfo: null,      // 用户信息
    userId: null,        // 用户ID
    token: null          // 登录凭证
  },

  // 登录方法
  login() {
    return new Promise((resolve, reject) => {
      // 1. 获取微信登录凭证
      wx.login({
        success: async (loginRes) => {
          try {
            const { code } = loginRes

            // 2. 获取用户信息
            const userInfo = await this.getUserProfile()

            // 3. 获取手机号
            const phoneNumber = await this.getPhoneNumber()

            // 4. 调用后端登录接口
            const { data } = await wx.request({
              url: 'https://your-api.com/login',
              method: 'POST',
              data: {
                code,
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl,
                phoneNumber
              }
            })

            // 5. 保存登录状态
            if (data.code === 200) {
              this.globalData.userId = data.userId
              this.globalData.token = data.token
              this.globalData.userInfo = userInfo
              resolve()
            } else {
              reject(new Error(data.message || '登录失败'))
            }
          } catch (e) {
            reject(e)
          }
        },
        fail: reject
      })
    })
  },

  // 获取用户信息
  getUserProfile() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '用于完善会员资料',
        success: (res) => {
          resolve(res.userInfo)
        },
        fail: reject
      })
    })
  },

  // 获取手机号
  getPhoneNumber() {
    return new Promise((resolve, reject) => {
      wx.getPhoneNumber({
        success: (res) => {
          wx.request({
            url: 'https://your-api.com/decrypt-phone',
            method: 'POST',
            data: { encryptedData: res.encryptedData, iv: res.iv },
            success: (decryptRes) => {
              resolve(decryptRes.data.phoneNumber)
            },
            fail: reject
          })
        },
        fail: reject
      })
    })
  },

  // 购物车操作方法
  cart: {
    getKey() {
      const userId = getApp().globalData.userId || 'guest'
      return `cart_${userId}`
    },

    get() {
      try {
        return wx.getStorageSync(this.getKey()) || []
      } catch (e) {
        return []
      }
    },

    save(items) {
      wx.setStorageSync(this.getKey(), items)
    },

    add(item) {
      const cart = this.get()
      const existing = cart.find(i => i.product_id === item.product_id)
      if (existing) {
        existing.quantity += item.quantity
      } else {
        cart.push(item)
      }
      this.save(cart)
      return cart
    },

    update(productId, quantity) {
      const cart = this.get()
      const item = cart.find(i => i.product_id === productId)
      if (item) {
        item.quantity = quantity
        this.save(cart)
      }
      return cart
    },

    remove(productId) {
      const cart = this.get().filter(i => i.product_id !== productId)
      this.save(cart)
      return cart
    },

    clear() {
      this.save([])
    }
  }
})