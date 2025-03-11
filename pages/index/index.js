Page({
  data: {
    categories: [], // 分类数据
    products: []   // 商品数据
  },
  onLoad() {
    this.loadCategories();
    this.loadProducts();
  },
  loadCategories() {
    wx.request({
      url: 'http://localhost:3000/categories',
      success: (res) => {
        this.setData({ categories: res.data });
      },
      fail: (err) => {
        console.error('加载分类失败:', err);
      }
    });
  },
  loadProducts() {
    wx.request({
      url: 'http://localhost:3000/products',
      success: (res) => {
        this.setData({ products: res.data });
      },
      fail: (err) => {
        console.error('加载商品失败:', err);
      }
    });
  },
  onBack() {
    wx.navigateBack();
  },
  // ----------------- 新增以下两个方法 -----------------
  onCategoryTap(e) {
    // 跳转到分类商品列表页
    const categoryId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/category/category?id=${categoryId}`
    });
  },
  onProductTap(e) {
    // 跳转到商品详情页
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product/product?id=${productId}`
    });
  }
});