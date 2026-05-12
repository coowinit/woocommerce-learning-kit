# WooCommerce HTML Page Learning Kit

一个从静态 HTML 页面开始学习 WooCommerce 前台页面结构的练习包。

这个版本不重点讲复杂 PHP、hooks、HPOS、REST API 或支付网关，而是回到最基础、最容易理解的页面结构：

- 页面骨架
- 头部导航
- 首页 Banner
- 产品卡片
- 产品列表
- 响应式产品网格
- 分类侧栏
- 搜索筛选栏
- 产品详情页
- 产品图集
- 规格选择
- 产品详情 Tab
- 相关产品
- 购物车页面
- 结账页面
- 我的账户订单页面
- 完整商店页组合

## 项目定位

这不是 WooCommerce 主题，也不是插件，而是一套静态 HTML + CSS 学习资料。

它适合在学习 WooCommerce 模板之前使用。先通过静态页面理解页面结构，再逐步学习 WooCommerce 如何动态输出产品、价格、购物车和订单数据。

## 文件结构

```text
woocommerce-html-page-learning-kit/
├── index.html
├── 01-page-structure.html
├── 02-header-navigation.html
├── 03-hero-banner.html
├── 04-product-card.html
├── 05-product-grid.html
├── 06-responsive-grid.html
├── 07-category-sidebar.html
├── 08-toolbar-filter.html
├── 09-card-details.html
├── 10-list-view.html
├── 11-pagination.html
├── 12-product-detail.html
├── 13-product-gallery.html
├── 14-variation-selector.html
├── 15-product-tabs.html
├── 16-related-products.html
├── 17-cart-page.html
├── 18-checkout-page.html
├── 19-account-orders.html
├── 20-complete-store-page.html
├── css/
│   └── common.css
├── js/
│   └── main.js
├── assets/
│   └── *.svg
└── README.md
```

## 推荐学习顺序

```text
页面结构
↓
头部导航
↓
首页 Banner
↓
单个产品卡片
↓
产品 Grid 列表
↓
响应式产品列表
↓
分类侧栏
↓
搜索和排序工具栏
↓
产品卡片细节
↓
横向列表视图
↓
分页
↓
产品详情页
↓
产品图集
↓
规格选择
↓
产品详情 Tab
↓
相关产品
↓
购物车
↓
结账页
↓
账户订单页
↓
完整商店页
```

## 和 WooCommerce 的对应关系

| 静态模块 | WooCommerce 中的动态来源 |
|---|---|
| 产品卡片 | Product Loop |
| 产品列表 | Shop / Category Archive |
| 产品图 | Product Image |
| 产品价格 | Product Price |
| 加入购物车按钮 | Add to Cart Button |
| 产品详情 | Single Product Template |
| 购物车页面 | Cart Template |
| 结账页面 | Checkout Template |
| 我的账户 | My Account Template |

## 使用方法

1. 解压项目文件
2. 打开 `index.html`
3. 按编号学习每个页面
4. 修改 `css/common.css` 观察页面变化

## 学习建议

建议重点练习：

- 修改产品卡片样式
- 修改产品列表列数
- 增加更多产品卡片
- 改造产品详情页结构
- 修改购物车表格
- 优化手机端布局
- 把多个模块组合成完整商店页

## 技术栈

- HTML5
- CSS3
- JavaScript
- Responsive Design
- SVG placeholder assets

## License

MIT License
