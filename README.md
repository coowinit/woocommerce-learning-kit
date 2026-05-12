# WooCommerce Learning Kit - Code Study Edition

一个偏向功能开发和代码研究的 WooCommerce 学习包。

本版本围绕 WooCommerce 深入学习需求整理，重点不再是后台基础操作，而是尽可能多地覆盖 WooCommerce 二次开发中常见的代码场景。

## 项目定位

这不是 WooCommerce 主题，也不是可直接上线的完整插件，而是一套静态 HTML 学习资料和代码片段集合。

适合用于：

- 深入学习 WooCommerce 功能代码
- 研究产品、购物车、结账、订单和支付流程
- 整理 WooCommerce 常用 hooks 和 CRUD 写法
- 建立自己的 WooCommerce 代码片段库
- 后期拆分成自定义插件或子主题代码

## 本版本重点

- 20 个代码主题页面
- 122+ 个 WooCommerce 代码使用场景
- 每页多个代码片段
- 每个代码片段都有说明
- 额外提供 `snippets/` Markdown 文件
- 包含 `snippets/all-snippets.md` 汇总文件
- README 中不包含 GitHub 上传信息

## 文件结构

```text
woocommerce-learning-kit-code-study/
├── index.html
├── 01-extension-foundation.html
├── 02-hooks-conditions.html
├── 03-product-crud.html
├── 04-variable-products-attributes.html
├── 05-product-fields-tabs.html
├── 06-pricing-discounts-fees.html
├── 07-cart-session-notices.html
├── 08-checkout-fields-validation.html
├── 09-orders-hpos-crud.html
├── 10-order-items-refunds.html
├── 11-emails-notifications.html
├── 12-shipping-methods-zones.html
├── 13-payment-gateway.html
├── 14-coupons-promotions.html
├── 15-customers-account-endpoints.html
├── 16-stock-inventory.html
├── 17-rest-api-webhooks.html
├── 18-blocks-store-api.html
├── 19-admin-reports-analytics.html
├── 20-performance-security-debug.html
├── css/
│   └── common.css
├── assets/
│   └── *.svg
├── snippets/
│   ├── all-snippets.md
│   └── *.md
└── README.md
```

## 页面说明

| 页面 | 主题 | 代码数量 |
|---|---|---|
| `01-extension-foundation.html` | 01 扩展插件基础与安全入口 | 6 个代码场景 |
| `02-hooks-conditions.html` | 02 WooCommerce Hooks 与条件判断 | 6 个代码场景 |
| `03-product-crud.html` | 03 产品 CRUD 与查询 | 6 个代码场景 |
| `04-variable-products-attributes.html` | 04 可变产品、属性与变体 | 6 个代码场景 |
| `05-product-fields-tabs.html` | 05 产品后台字段与前台展示 | 6 个代码场景 |
| `06-pricing-discounts-fees.html` | 06 价格、折扣与费用 | 6 个代码场景 |
| `07-cart-session-notices.html` | 07 购物车、Session 与提示 | 6 个代码场景 |
| `08-checkout-fields-validation.html` | 08 结账字段、验证与订单 Meta | 6 个代码场景 |
| `09-orders-hpos-crud.html` | 09 订单 CRUD 与 HPOS 兼容 | 6 个代码场景 |
| `10-order-items-refunds.html` | 10 订单商品、退款与发货信息 | 6 个代码场景 |
| `11-emails-notifications.html` | 11 邮件通知与模板 | 6 个代码场景 |
| `12-shipping-methods-zones.html` | 12 配送方式、区域与运费 | 6 个代码场景 |
| `13-payment-gateway.html` | 13 支付网关与回调 | 6 个代码场景 |
| `14-coupons-promotions.html` | 14 优惠券与促销规则 | 6 个代码场景 |
| `15-customers-account-endpoints.html` | 15 客户、账户与自定义 Endpoint | 6 个代码场景 |
| `16-stock-inventory.html` | 16 库存、SKU 与低库存提醒 | 6 个代码场景 |
| `17-rest-api-webhooks.html` | 17 REST API、Webhooks 与外部系统 | 6 个代码场景 |
| `18-blocks-store-api.html` | 18 Blocks、Store API 与现代结账 | 6 个代码场景 |
| `19-admin-reports-analytics.html` | 19 后台订单、报表与管理增强 | 6 个代码场景 |
| `20-performance-security-debug.html` | 20 性能、安全、迁移与调试 | 8 个代码场景 |

## snippets 文件

所有页面中的代码片段也单独整理到了 Markdown 文件中：

- `snippets/01-extension-foundation.md`
- `snippets/02-hooks-conditions.md`
- `snippets/03-product-crud.md`
- `snippets/04-variable-products-attributes.md`
- `snippets/05-product-fields-tabs.md`
- `snippets/06-pricing-discounts-fees.md`
- `snippets/07-cart-session-notices.md`
- `snippets/08-checkout-fields-validation.md`
- `snippets/09-orders-hpos-crud.md`
- `snippets/10-order-items-refunds.md`
- `snippets/11-emails-notifications.md`
- `snippets/12-shipping-methods-zones.md`
- `snippets/13-payment-gateway.md`
- `snippets/14-coupons-promotions.md`
- `snippets/15-customers-account-endpoints.md`
- `snippets/16-stock-inventory.md`
- `snippets/17-rest-api-webhooks.md`
- `snippets/18-blocks-store-api.md`
- `snippets/19-admin-reports-analytics.md`
- `snippets/20-performance-security-debug.md`

另外还有完整汇总文件：

```text
snippets/all-snippets.md
```

## 推荐学习顺序

```text
扩展插件基础与安全入口
↓
WooCommerce Hooks 与条件判断
↓
产品 CRUD 与查询
↓
可变产品、属性与变体
↓
产品后台字段与前台展示
↓
价格、折扣与费用
↓
购物车、Session 与提示
↓
结账字段、验证与订单 Meta
↓
订单 CRUD 与 HPOS 兼容
↓
订单商品、退款与发货信息
↓
邮件通知与模板
↓
配送方式、区域与运费
↓
支付网关与回调
↓
优惠券与促销规则
↓
客户、账户与自定义 Endpoint
↓
库存、SKU 与低库存提醒
↓
REST API、Webhooks 与外部系统
↓
Blocks、Store API 与现代结账
↓
后台订单、报表与管理增强
↓
性能、安全、迁移与调试
```

## 重点代码能力

### WooCommerce 扩展入口

```php
add_action( 'plugins_loaded', 'mywoo_bootstrap' );
```

### HPOS 兼容声明

```php
\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility(
    'custom_order_tables',
    __FILE__,
    true
);
```

### 产品 CRUD

```php
$product = wc_get_product( 123 );
$product->set_regular_price( '49.99' );
$product->save();
```

### 订单 CRUD

```php
$order = wc_get_order( 123 );
$order->update_meta_data( '_sales_owner', 'Felix' );
$order->save();
```

### 购物车费用

```php
WC()->cart->add_fee( 'Handling Fee', 10, true );
```

### 结账字段

```php
add_filter( 'woocommerce_checkout_fields', 'my_custom_checkout_fields' );
```

### 邮件扩展

```php
add_action( 'woocommerce_email_after_order_table', 'my_email_extra_content', 10, 4 );
```

### REST API

```php
register_rest_route( 'mywoo/v1', '/stock-sync', array(
    'methods'  => 'POST',
    'callback' => 'mywoo_stock_sync_callback',
) );
```

## 如何使用

### 方法一：直接阅读

1. 下载并解压项目
2. 双击打开 `index.html`
3. 按编号阅读不同页面

### 方法二：用 VS Code 研究代码

1. 用 VS Code 打开整个文件夹
2. 阅读 HTML 页面
3. 打开 `snippets/` 文件夹查看代码片段
4. 把需要测试的片段复制到自定义插件或子主题中
5. 在测试环境验证

## 重要提醒

本项目中的代码用于学习和研究。复制到正式 WooCommerce 网站前，请先备份，并优先在测试环境验证。

不要把以下信息提交到公开仓库：

- 支付网关密钥
- WooCommerce REST API Key
- SMTP 密码
- 数据库账号和密码
- 客户个人数据
- 订单真实数据
- wp-config.php 中的真实密钥
- 服务器敏感路径

## 特别注意

WooCommerce 涉及订单、支付、税费、库存和客户数据。任何影响以下流程的代码，都必须完整测试：

- 产品页
- 加入购物车
- 购物车更新
- 结账字段
- 支付成功
- 支付失败
- 订单邮件
- 订单后台
- 退款
- 库存扣减和恢复
- 客户账户页
- 移动端结账

## 后续可扩展方向

这套学习包后续可以继续扩展：

- WooCommerce Payment Gateway Kit
- WooCommerce Shipping Method Kit
- WooCommerce Product Import Kit
- WooCommerce Checkout Customization Kit
- WooCommerce HPOS Compatibility Kit
- WooCommerce REST API Examples
- WooCommerce Blocks Extension Kit

## 技术栈

- HTML5
- CSS3
- PHP code snippets
- WooCommerce APIs
- WordPress APIs
- Responsive Design
- SVG placeholder assets

## License

MIT License
