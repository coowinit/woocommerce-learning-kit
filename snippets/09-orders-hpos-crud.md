# 09 订单 CRUD 与 HPOS 兼容

整理 wc_get_order、订单状态、订单备注、订单查询、HPOS 兼容和订单 meta。

> 代码用于学习和研究。复制到正式网站前请先备份并在测试环境验证。

## 1. 读取订单基础数据

**级别：** 基础

**说明：** 订单读取优先使用 wc_get_order。

```php
<?php
$order = wc_get_order( 123 );

if ( $order ) {
    $email = $order->get_billing_email();
    $total = $order->get_total();
    $status = $order->get_status();

    echo esc_html( $email . ' / ' . $status . ' / ' . $total );
}
```

## 2. 更新订单 meta 并保存

**级别：** 基础

**说明：** HPOS 兼容代码应使用订单对象 CRUD。

```php
<?php
$order = wc_get_order( 123 );

if ( $order ) {
    $order->update_meta_data( '_sales_owner', 'Felix' );
    $order->save();
}
```

## 3. 添加订单备注

**级别：** 基础

**说明：** 订单备注适合记录内部跟进或自动化处理结果。

```php
<?php
$order = wc_get_order( 123 );

if ( $order ) {
    $order->add_order_note( 'Customer requested installation guide.' );
}
```

## 4. 查询最近处理中订单

**级别：** 实用

**说明：** wc_get_orders 是 HPOS 友好的订单查询方式。

```php
<?php
$orders = wc_get_orders( array(
    'limit'  => 20,
    'status' => array( 'processing' ),
    'orderby'=> 'date',
    'order'  => 'DESC',
) );

foreach ( $orders as $order ) {
    echo esc_html( $order->get_order_number() );
}
```

## 5. 监听订单状态变化

**级别：** 重要

**说明：** 订单状态变更是自动化流程的关键 hook。

```php
<?php
function mywoo_order_status_changed( $order_id, $old_status, $new_status, $order ) {
    if ( 'processing' === $new_status ) {
        $order->add_order_note( 'Order moved to processing. Start fulfillment workflow.' );
    }
}
add_action( 'woocommerce_order_status_changed', 'mywoo_order_status_changed', 10, 4 );
```

## 6. 检测 HPOS 是否启用

**级别：** 进阶

**说明：** 一般业务代码优先用 CRUD，只有写底层 SQL 时才需要判断 HPOS。

```php
<?php
use Automattic\WooCommerce\Utilities\OrderUtil;

if ( class_exists( OrderUtil::class ) && OrderUtil::custom_orders_table_usage_is_enabled() ) {
    error_log( 'HPOS custom order tables are enabled.' );
} else {
    error_log( 'Orders may be using legacy post storage.' );
}
```
