Page({
  data: {
    categoryId: null,
    products: []
  },
  onLoad(options) {
    const categoryId = options.id;
    this.setData({ categoryId });
    this.loadProducts(categoryId);
    // 动态设置标题
    wx.setNavigationBarTitle({ title: options.title || '分类商品' });
  },
  loadProducts(categoryId) {
    wx.showLoading({ title: '加载中...' });
    wx.request({
      url: `http://localhost:3000/products?category_id=${categoryId}`,
      success: (res) => {
        this.setData({ products: res.data });
      },
      fail: (err) => {
        wx.showToast({ title: '加载失败', icon: 'none' });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },
  onProductTap(e) {
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product/product?id=${productId}`
    });
  }
});