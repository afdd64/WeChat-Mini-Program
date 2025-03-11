// pages/address/address.js
const app = getApp()

Page({
  data: {
    addressList: [],        // 地址列表
    showForm: false,        // 显示编辑表单
    editIndex: -1,          // 当前编辑的地址索引
    formData: {             // 表单数据
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      is_default: false
    }
  },

  onShow() {
    this.loadAddressList()
  },

  async loadAddressList() {
    try {
      const { data } = await wx.request({
        url: 'http://localhost:3000/api/addresses',
        header: {
          'X-User-Id': app.globalData.userId,
          'Authorization': app.globalData.token
        }
      })
      this.setData({ addressList: data.data })
    } 
    catch (error) {
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  // 显示编辑表单
  showEditForm() {
    this.setData({ 
      showForm: true,
      editIndex: -1,
      formData: this.getEmptyFormData()
    })
  },

  // 获取空表单数据
  getEmptyFormData() {
    return {
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      is_default: false
    }
  },

  // 地区选择处理
  bindRegionChange(e) {
    const [province, city, district] = e.detail.value
    this.setData({
      'formData.province': province,
      'formData.city': city,
      'formData.district': district
    })
  },

  // 表单字段绑定
  bindNameInput(e) {
    this.setData({ 'formData.name': e.detail.value })
  },
  bindPhoneInput(e) {
    this.setData({ 'formData.phone': e.detail.value })
  },
  bindDetailInput(e) {
    this.setData({ 'formData.detail': e.detail.value })
  },
  bindDefaultChange(e) {
    this.setData({ 'formData.is_default': e.detail.value })
  },

  // 提交表单
  async submitForm() {
    if (!this.validateForm()) return

    wx.showLoading({ title: '保存中' })
    try {
      if (this.data.editIndex === -1) {
        await this.createAddress()
      } else {
        await this.updateAddress()
      }
      this.hideForm()
      this.loadAddressList()
    } catch (error) {
      wx.showToast({ title: '保存失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },

  // 创建新地址
  async createAddress() {
    return wx.request({
      url: 'http://localhost:3000/addresses',
      method: 'POST',
      header: {
        'X-User-Id': app.globalData.userId,
        'Authorization': app.globalData.token
      },
      data: this.data.formData
    })
  },

  // 更新地址
  async updateAddress() {
    const addressId = this.data.addressList[this.data.editIndex].id
    return wx.request({
      url: `http://localhost:3000/addresses/${addressId}`,
      method: 'PUT',
      header: {
        'X-User-Id': app.globalData.userId,
        'Authorization': app.globalData.token
      },
      data: this.data.formData
    })
  },

  // 编辑地址
  editAddress(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      showForm: true,
      editIndex: index,
      formData: { ...this.data.addressList[index] }
    })
  },

  // 删除地址
  async deleteAddress(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个地址吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await wx.request({
              url: `http://localhost:3000/addresses/${id}`,
              method: 'DELETE',
              header: {
                'X-User-Id': app.globalData.userId,
                'Authorization': app.globalData.token
              }
            })
            this.loadAddressList()
          } catch (error) {
            wx.showToast({ title: '删除失败', icon: 'none' })
          }
        }
      }
    })
  },

  onLoad(options) {
    this.setData({ selectMode: options.selectMode === 'true' })
  },
  
  selectAddress(e) {
    if (!this.data.selectMode) return
    const index = e.currentTarget.dataset.index
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    prevPage.setData({ selectedAddress: this.data.addressList[index] })
    wx.navigateBack()
  },

  // 表单验证
  validateForm() {
    const form = this.data.formData
    if (!form.name.trim()) {
      wx.showToast({ title: '请输入收货人姓名', icon: 'none' })
      return false
    }
    if (!/^1[3-9]\d{9}$/.test(form.phone)) {
      wx.showToast({ title: '请输入正确手机号', icon: 'none' })
      return false
    }
    if (!form.province || !form.city) {
      wx.showToast({ title: '请选择所在地区', icon: 'none' })
      return false
    }
    if (!form.detail.trim()) {
      wx.showToast({ title: '请输入详细地址', icon: 'none' })
      return false
    }
    return true
  },

  // 隐藏表单
  hideForm() {
    this.setData({ showForm: false })
  }
})