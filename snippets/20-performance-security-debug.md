# 20 性能、安全、迁移与调试

整理 HPOS、缓存、日志、Action Scheduler、CLI、模板覆盖、安全密钥和排查流程。

> 代码用于学习和研究。复制到正式网站前请先备份并在测试环境验证。

## 1. HPOS 友好订单读取

**级别：** HPOS

**说明：** HPOS 下订单不应直接依赖 postmeta。

```php
<?php
// 推荐：CRUD API
$order = wc_get_order( 123 );
$email = $order ? $order->get_billing_email() : '';

// 不推荐：直接假设订单在 wp_posts/wp_postmeta 中。
// get_post_meta( 123, '_billing_email', true );
```

## 2. 检测 HPOS 状态

**级别：** HPOS

**说明：** 只有写底层兼容逻辑时才需要检测，普通业务优先 CRUD。

```php
<?php
use Automattic\WooCommerce\Utilities\OrderUtil;

if ( class_exists( OrderUtil::class ) ) {
    $enabled = OrderUtil::custom_orders_table_usage_is_enabled();
    error_log( 'HPOS enabled: ' . ( $enabled ? 'yes' : 'no' ) );
}
```

## 3. WooCommerce 模板覆盖路径

**级别：** 主题

**说明：** 模板覆盖后要关注 WooCommerce 模板版本更新提示。

```text
your-theme/
└── woocommerce/
    ├── single-product.php
    ├── archive-product.php
    └── checkout/
        └── form-checkout.php
```

## 4. 检查模板覆盖版本提示

**级别：** 维护

**说明：** 模板覆盖是强定制手段，维护成本比 hooks 更高。

```php
<?php
// 后台路径：WooCommerce > Status > Templates
// 如果显示 outdated templates，需要对比插件模板新版本并更新主题覆盖文件。
```

## 5. Action Scheduler 注册异步任务

**级别：** 进阶

**说明：** 耗时任务不要阻塞结账流程，可交给 Action Scheduler。

```php
<?php
function mywoo_schedule_order_export( $order_id ) {
    if ( function_exists( 'as_enqueue_async_action' ) ) {
        as_enqueue_async_action( 'mywoo_export_order_to_erp', array(
            'order_id' => $order_id,
        ), 'mywoo' );
    }
}
add_action( 'woocommerce_checkout_order_processed', 'mywoo_schedule_order_export' );

function mywoo_export_order_to_erp( $order_id ) {
    // 执行耗时的 ERP 导出。
}
add_action( 'mywoo_export_order_to_erp', 'mywoo_export_order_to_erp' );
```

## 6. WooCommerce 日志排查

**级别：** 调试

**说明：** 支付、同步、库存、邮件排查都建议写 source 明确的日志。

```php
<?php
$logger = wc_get_logger();

$logger->error(
    'Payment webhook signature failed.',
    array(
        'source' => 'mywoo-payment',
        'order'  => 123,
    )
);
```

## 7. WP-CLI 常用维护命令

**级别：** 运维

**说明：** 真实执行前先确认环境、备份和权限。

```bash
wp plugin list
wp wc tool list
wp wc hpos status
wp wc hpos sync --batch-size=100
wp transient delete --all
```

## 8. 更新前代码维护清单

**级别：** 维护

**说明：** 电商网站更新必须以订单和支付安全为第一优先级。

```text
1. 备份数据库和 uploads
2. 记录 WooCommerce、主题、支付、配送插件版本
3. 在测试环境更新
4. 测试商店页、产品页、购物车、结账、支付、邮件、订单后台
5. 检查 WooCommerce Status、Logs、Templates
6. 检查 HPOS 兼容性和 Action Scheduler 队列
```
