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


## 本次优化说明

本版本针对后续真正制作 WooCommerce 商城页面的方向，重点优化了以下页面：

### 1. 分类侧边栏

`07-category-sidebar.html`

- 优化筛选项布局
- 增加筛选数量、已选标签、Reset 按钮
- 桌面端使用 sticky 侧栏
- 手机端自动变成顶部筛选卡片
- 更适合后期替换为 WooCommerce 分类、属性、价格筛选数据

### 2. 产品详情页 Swiper 轮播

`12-product-detail.html`

- 主图区域改为 Swiper 轮播
- 增加缩略图 Swiper
- 支持手机端滑动
- 手机端隐藏左右箭头，保留滑动体验和分页点
- 后期可替换为 WooCommerce 产品主图和产品图集

### 3. 产品图集 Swiper

`13-product-gallery.html`

- 单独整理产品图集 Swiper 结构
- 方便后期作为产品详情页图集模块复用

### 4. 规格选择联动图片

`14-variation-selector.html`

- 点击颜色选项时切换左侧产品大图
- 同步更新价格、SKU、当前变体名称
- 模拟 WooCommerce 可变产品 Variation Image 效果
- 后期可把 `data-image`、`data-price`、`data-sku` 替换为 WooCommerce 变体数据

## 动态化学习方向

后续如果把这些静态页面改成真正的 WooCommerce 页面，可以按下面顺序学习：

```text
静态产品卡片
↓
WooCommerce product loop
↓
静态产品列表
↓
archive-product.php / content-product.php
↓
静态产品详情页
↓
single-product.php / product image gallery
↓
静态规格选择
↓
variable product / variation data
↓
静态购物车和结账页
↓
cart template / checkout template
```

## Swiper 说明

本版本的产品详情页和产品图集页使用 Swiper CDN：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
```

如果后期要完全离线使用，可以把 Swiper 的 CSS 和 JS 下载到本地，再改成本地路径。


## Polished UI v2 更新说明

本次继续对几个重点页面进行视觉和交互打磨，让这套 HTML 页面更适合作为后续真实 WooCommerce 商城页面的静态参考。

### 产品详情页

`12-product-detail.html`

- Swiper 左右箭头改为圆形按钮
- 优化箭头颜色、背景、悬浮状态和点击区域
- 优化分页点样式
- 缩略图选中状态更明显
- 右侧产品信息卡片增加库存、样品、质保标签
- 按钮区分主按钮和辅助按钮

### 产品图集页

`13-product-gallery.html`

- 同步优化 Swiper 箭头、分页点和缩略图
- 更适合作为后续产品详情页 gallery 模块复用

### 规格选项页面

`14-variation-selector.html`

- 规格选项增加颜色圆点
- 增加库存状态
- 增加当前选中变体提示
- 点击颜色选项时同步更新主图、标题、价格、SKU、描述
- 左侧增加变体缩略图，点击缩略图也能切换变体
- 更接近 WooCommerce variable product 的前端体验

### 我的账户页面

`19-account-orders.html`

- 优化账户菜单样式
- 增加订单统计卡片
- 订单状态改成 badge
- 增加订单操作链接
- 更接近 WooCommerce My Account 页面结构

## 后续真正动态化时的对应思路

```text
Swiper 主图
→ WooCommerce product featured image

Swiper 缩略图
→ WooCommerce product gallery images

颜色 / 尺寸选项
→ WooCommerce variation attributes

价格 / SKU / 库存
→ WooCommerce variation data

账户菜单
→ WooCommerce My Account endpoints

订单表格
→ Customer orders loop
```


## Brand Product Detail Polish 更新说明

本次重点优化 `14-variation-selector.html`，让规格选项页面更像品牌官网产品详情界面。

### 重点变化

- 左侧产品图片区更干净，增加浮动标签和当前颜色提示
- 缩略图区域更清晰，选中状态更明显
- 右侧信息区重新梳理层级：
  - 面包屑
  - 产品标题
  - 评分
  - SKU
  - 价格
  - 产品描述
  - 核心卖点
  - 颜色选项
  - 长度选项
  - 数量和按钮
  - 规格信息
- 颜色选项更像真实商城：
  - 色块
  - 名称
  - 简短说明
  - 库存状态
- 点击颜色或缩略图时，会同步更新：
  - 主图
  - 产品标题
  - 当前选中颜色
  - 价格
  - SKU
  - 描述
- 修复了多个 `data-variation-name` 只更新一个的问题，现在同类字段会一起更新。

### 后期动态化方向

后期接入 WooCommerce 时，可以把页面中的静态 `data-*` 替换为 WooCommerce variation data：

```text
data-image       → variation image
data-name        → variation attributes / display name
data-price       → variation price html
data-sku         → variation sku
data-description → variation description
stock pill       → variation availability
```


## v1.3 新增：静态页面动态化学习章节

本版本新增 `21-26` 六个页面，重点讲解这套静态 HTML 页面如何一步步变成真正的 WooCommerce 动态页面。

### 新增页面

| 页面 | 主题 | 重点 |
|---|---|---|
| `21-dynamic-roadmap.html` | 动态化路线 | 从静态 HTML 到 WooCommerce 模板的整体路线 |
| `22-product-card-loop.html` | 产品卡片动态化 | 把静态产品卡片替换为 Product Loop |
| `23-shop-archive-template.html` | 商店列表动态化 | 把产品 Grid 变成 Shop / Category Archive |
| `24-single-product-template.html` | 产品详情动态化 | 接入产品标题、价格、SKU、描述和 Add to Cart |
| `25-variation-data.html` | 变体数据动态化 | 把 `data-*` 模拟数据替换为 variation data |
| `26-cart-checkout-account.html` | 购物车结账账户 | 先保留默认流程，再做样式和局部模板优化 |

### 推荐学习顺序

```text
静态页面结构
↓
产品卡片
↓
产品列表
↓
品牌产品详情页
↓
规格变体交互
↓
动态化路线
↓
Product Loop
↓
Archive Product
↓
Single Product
↓
Variation Data
↓
Cart / Checkout / My Account
```

### 学习重点

这部分内容不追求复杂代码，而是帮助理解：

- 哪些 HTML 可以保留
- 哪些静态内容需要替换成 WooCommerce 数据
- 产品卡片如何变成 Product Loop
- 产品列表如何变成 Archive Template
- 产品详情页如何变成 Single Product Template
- 规格选项如何接入 Variation Data
- 为什么购物车、结账和账户页不建议一开始完全重写


## v1.3.1 更新：修复 21 页面布局，并扩展动态化章节

本次更新重点修复 `21-dynamic-roadmap.html` 中步骤布局错位的问题，并对 `22-26` 页面进行了内容扩展，让动态接入 WooCommerce 的学习路线更完整。

### 修复内容

- 修复 `21-dynamic-roadmap.html` 中箭头和步骤卡片错位的问题
- 将 21 页改成更稳定的路线图卡片 + 时间线布局
- 优化手机端显示，避免步骤内容挤压或错位

### 扩展内容

| 页面 | 新增重点 |
|---|---|
| `21-dynamic-roadmap.html` | 增加五阶段动态化路线、模板对应表、学习优先级 |
| `22-product-card-loop.html` | 增加产品图片、标题、价格、按钮、促销标记的动态替换说明 |
| `23-shop-archive-template.html` | 增加商店页工具栏、排序、分页、筛选侧栏和模板文件关系 |
| `24-single-product-template.html` | 增加产品详情页分阶段接入顺序、图集动态化思路 |
| `25-variation-data.html` | 增加可变产品后台数据、前台交互和 variation data 对应关系 |
| `26-cart-checkout-account.html` | 增加购物车、结账、账户页哪些先保留默认流程，哪些适合先改样式 |
