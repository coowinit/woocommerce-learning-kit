# 19 后台订单、报表与管理增强

整理后台订单列、筛选、批量操作、订单搜索、日志和 Analytics 数据扩展思路。

> 代码用于学习和研究。复制到正式网站前请先备份并在测试环境验证。

## 1. 后台订单列表增加列

**级别：** 后台

**说明：** HPOS 订单管理页可能使用 wc-orders screen，列 hook 要注意环境。

```php
<?php
function mywoo_shop_order_columns( $columns ) {
    $columns['sales_owner'] = 'Sales Owner';
    return $columns;
}
add_filter( 'manage_woocommerce_page_wc-orders_columns', 'mywoo_shop_order_columns' );
```

## 2. 输出订单自定义列内容

**级别：** 后台

**说明：** HPOS 下优先使用 $order 对象读取 meta。

```php
<?php
function mywoo_shop_order_column_content( $column, $order ) {
    if ( 'sales_owner' === $column && $order instanceof WC_Order ) {
        echo esc_html( $order->get_meta( '_sales_owner' ) );
    }
}
add_action( 'manage_woocommerce_page_wc-orders_custom_column', 'mywoo_shop_order_column_content', 10, 2 );
```

## 3. 添加订单批量操作

**级别：** 后台

**说明：** 批量操作适合订单导出、标记、分配跟进人等。

```php
<?php
function mywoo_order_bulk_actions( $actions ) {
    $actions['mark_exported_to_erp'] = 'Mark exported to ERP';
    return $actions;
}
add_filter( 'bulk_actions-woocommerce_page_wc-orders', 'mywoo_order_bulk_actions' );
```

## 4. 处理订单批量操作

**级别：** 后台

**说明：** 批量操作必须考虑权限和数据量。

```php
<?php
function mywoo_handle_order_bulk_action( $redirect_to, $action, $order_ids ) {
    if ( 'mark_exported_to_erp' !== $action ) {
        return $redirect_to;
    }

    foreach ( $order_ids as $order_id ) {
        $order = wc_get_order( $order_id );
        if ( $order ) {
            $order->update_meta_data( '_exported_to_erp', 'yes' );
            $order->save();
        }
    }

    return add_query_arg( 'mywoo_exported', count( $order_ids ), $redirect_to );
}
add_filter( 'handle_bulk_actions-woocommerce_page_wc-orders', 'mywoo_handle_order_bulk_action', 10, 3 );
```

## 5. 使用 WooCommerce Logger

**级别：** 运维

**说明：** WooCommerce > Status > Logs 可查看 source 对应日志。

```php
<?php
$logger = wc_get_logger();

$logger->info(
    'Order exported to ERP successfully.',
    array(
        'source'   => 'mywoo-erp',
        'order_id' => 123,
    )
);
```

## 6. 后台订单页添加提示框

**级别：** 后台

**说明：** 后台提示适合规范团队订单处理流程。

```php
<?php
function mywoo_order_admin_notice() {
    $screen = get_current_screen();

    if ( $screen && false !== strpos( $screen->id, 'wc-orders' ) ) {
        echo '<div class="notice notice-info"><p>处理订单前请确认付款状态和配送地址。</p></div>';
    }
}
add_action( 'admin_notices', 'mywoo_order_admin_notice' );
```
