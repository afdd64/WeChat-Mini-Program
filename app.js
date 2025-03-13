// app.js
App({
  globalData: {
    userInfo: null,
    userId: null,
    token: null
  },

  // 登录方法
  login() {
    return new Promise((resolve, reject) => {
      // 1. 获取微信登录凭证
      wx.login({
        success: async (loginRes) => {
          try {
            const { code } = loginRes;

            // 2. 获取用户信息
            const userInfo = await this.getUserProfile();

            // 3. 获取手机号
            const phoneNumber = await this.getPhoneNumber();

            // 4. 调用后端登录接口
            const res = await new Promise((resolveReq, rejectReq) => {
              wx.request({
                url: 'http://localhost:3000/login',
                method: 'POST',
                data: {
                  code,
                  nickName: userInfo.nickName,
                  avatarUrl: userInfo.avatarUrl,
                  phoneNumber
                },
                success: resolveReq,
                fail: rejectReq
              });
            });

            // 打印完整的响应信息
            console.log('后端返回的完整响应:', res);
            console.log('后端返回结果:', res.data);

            const data = res.data;
            // 5. 保存登录状态
            if (data && data.code === 200) {
              this.globalData.userId = data.userId;
              this.globalData.token = data.token;
              this.globalData.userInfo = userInfo;
              resolve();
            } else {
              console.error('登录失败，后端返回信息:', data);
              reject(new Error(data.message || '登录失败'));
            }
          } catch (e) {
            console.error('登录过程中出现错误:', e);
            reject(e);
          }
        },
        fail: (err) => {
          console.error('获取微信登录凭证失败:', err);
          reject(err);
        }
      });
    });
  },

  // 获取用户信息
  getUserProfile() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '用于完善会员资料',
        success: (res) => {
          resolve(res.userInfo);
        },
        fail: (err) => {
          console.error('获取用户信息失败:', err);
          reject(err);
        }
      });
    });
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
              resolve(decryptRes.data.phoneNumber);
            },
            fail: (err) => {
              console.error('获取手机号失败:', err);
              reject(err);
            }
          });
        },
        fail: (err) => {
          console.error('获取手机号授权失败:', err);
          reject(err);
        }
      });
    });
  },

  // 购物车操作方法
  cart: {
    getKey() {
      const userId = getApp().globalData.userId || 'guest';
      return `cart_${userId}`;
    },

    get() {
      try {
        return wx.getStorageSync(this.getKey()) || [];
      } catch (e) {
        return [];
      }
    },

    save(items) {
      wx.setStorageSync(this.getKey(), items);
    },

    add(item) {
      const cart = this.get();
      const existing = cart.find(i => i.product_id === item.product_id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        cart.push(item);
      }
      this.save(cart);
      return cart;
    },

    update(productId, quantity) {
      const cart = this.get();
      const item = cart.find(i => i.product_id === productId);
      if (item) {
        item.quantity = quantity;
        this.save(cart);
      }
      return cart;
    },

    remove(productId) {
      const cart = this.get().filter(i => i.product_id !== productId);
      this.save(cart);
      return cart;
    },

    clear() {
      this.save([]);
    }
  }
});