# 10 订单商品、退款与发货信息

整理订单 item、item meta、退款创建、发货字段、物流备注和订单总额相关场景。

> 代码用于学习和研究。复制到正式网站前请先备份并在测试环境验证。

## 1. 遍历订单商品

**级别：** 基础

**说明：** 订单 item 中可获取产品、数量、小计等信息。

```php
<?php
$order = wc_get_order( 123 );

foreach ( $order->get_items() as $item_id => $item ) {
    $product = $item->get_product();
    $name    = $item->get_name();
    $qty     = $item->get_quantity();

    echo esc_html( $name . ' x ' . $qty );
}
```

## 2. 读取订单 item meta

**级别：** 基础

**说明：** 购物车自定义数据保存到订单 item 后，可在这里读取。

```php
<?php
foreach ( $order->get_items() as $item ) {
    $engraving = $item->get_meta( 'Engraving' );

    if ( $engraving ) {
        echo esc_html( $engraving );
    }
}
```

## 3. 给订单 item 添加内部 meta

**级别：** 实用

**说明：** 以下划线开头的 meta 通常不在前台明显展示，适合内部信息。

```php
<?php
function mywoo_add_line_item_internal_meta( $item, $cart_item_key, $values, $order ) {
    if ( ! empty( $values['production_batch'] ) ) {
        $item->add_meta_data( '_production_batch', $values['production_batch'], true );
    }
}
add_action( 'woocommerce_checkout_create_order_line_item', 'mywoo_add_line_item_internal_meta', 10, 4 );
```

## 4. 创建部分退款

**级别：** 进阶

**说明：** 真实退款可能涉及支付网关 refund_payment，务必测试。

```php
<?php
$refund = wc_create_refund( array(
    'amount'         => 10.00,
    'reason'         => 'Partial refund for shipping adjustment.',
    'order_id'       => 123,
    'refund_payment' => false,
    'restock_items'  => false,
) );

if ( is_wp_error( $refund ) ) {
    error_log( $refund->get_error_message() );
}
```

## 5. 保存物流单号到订单 meta

**级别：** 实用

**说明：** 物流信息可保存到订单 meta，也可用专业物流插件。

```php
<?php
$order = wc_get_order( 123 );

if ( $order ) {
    $order->update_meta_data( '_tracking_number', 'TRACK123456' );
    $order->add_order_note( 'Tracking number added: TRACK123456' );
    $order->save();
}
```

## 6. 邮件中显示物流单号

**级别：** 实用

**说明：** 邮件输出要注意 HTML 和纯文本兼容。

```php
<?php
function mywoo_email_tracking_number( $order, $sent_to_admin, $plain_text, $email ) {
    $tracking = $order->get_meta( '_tracking_number' );

    if ( $tracking ) {
        echo '<p><strong>Tracking Number:</strong> ' . esc_html( $tracking ) . '</p>';
    }
}
add_action( 'woocommerce_email_after_order_table', 'mywoo_email_tracking_number', 10, 4 );
```
