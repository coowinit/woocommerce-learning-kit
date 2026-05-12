# 07 购物车、Session 与提示

整理加入购物车、购物车 item data、session、notices、fragments 和购物车验证。

> 代码用于学习和研究。复制到正式网站前请先备份并在测试环境验证。

## 1. 加入购物车时保存自定义数据

**级别：** 实用

**说明：** unique_key 可以避免带不同自定义数据的同产品被合并。

```php
<?php
function mywoo_add_custom_cart_item_data( $cart_item_data, $product_id, $variation_id ) {
    if ( isset( $_POST['engraving_text'] ) ) {
        $cart_item_data['engraving_text'] = sanitize_text_field( wp_unslash( $_POST['engraving_text'] ) );
        $cart_item_data['unique_key'] = md5( microtime() . wp_rand() );
    }

    return $cart_item_data;
}
add_filter( 'woocommerce_add_cart_item_data', 'mywoo_add_custom_cart_item_data', 10, 3 );
```

## 2. 购物车显示自定义数据

**级别：** 实用

**说明：** 购物车显示数据和订单保存数据是两个步骤。

```php
<?php
function mywoo_display_cart_item_data( $item_data, $cart_item ) {
    if ( ! empty( $cart_item['engraving_text'] ) ) {
        $item_data[] = array(
            'key'   => 'Engraving',
            'value' => esc_html( $cart_item['engraving_text'] ),
        );
    }

    return $item_data;
}
add_filter( 'woocommerce_get_item_data', 'mywoo_display_cart_item_data', 10, 2 );
```

## 3. 把购物车自定义数据保存到订单 item

**级别：** 重要

**说明：** 不保存到订单，后台订单里就看不到购物车自定义数据。

```php
<?php
function mywoo_add_cart_data_to_order_item( $item, $cart_item_key, $values, $order ) {
    if ( ! empty( $values['engraving_text'] ) ) {
        $item->add_meta_data( 'Engraving', $values['engraving_text'], true );
    }
}
add_action( 'woocommerce_checkout_create_order_line_item', 'mywoo_add_cart_data_to_order_item', 10, 4 );
```

## 4. 加入购物车前验证

**级别：** 安全

**说明：** 验证失败返回 false，并用 wc_add_notice 给用户反馈。

```php
<?php
function mywoo_validate_add_to_cart( $passed, $product_id, $quantity ) {
    if ( has_term( 'sample', 'product_cat', $product_id ) && $quantity > 3 ) {
        wc_add_notice( 'Samples are limited to 3 per order.', 'error' );
        return false;
    }

    return $passed;
}
add_filter( 'woocommerce_add_to_cart_validation', 'mywoo_validate_add_to_cart', 10, 3 );
```

## 5. 使用 WooCommerce Session

**级别：** 实用

**说明：** session 适合保存临时结账/购物流程数据。

```php
<?php
function mywoo_store_region_in_session() {
    if ( isset( $_POST['customer_region'] ) ) {
        WC()->session->set(
            'customer_region',
            sanitize_text_field( wp_unslash( $_POST['customer_region'] ) )
        );
    }
}
add_action( 'wp_loaded', 'mywoo_store_region_in_session' );

$region = WC()->session ? WC()->session->get( 'customer_region' ) : '';
```

## 6. 更新迷你购物车 fragments

**级别：** 前端

**说明：** AJAX 加入购物车后，fragments 用于刷新页面局部内容。

```php
<?php
function mywoo_cart_count_fragment( $fragments ) {
    ob_start();
    ?>
    <span class="cart-count"><?php echo esc_html( WC()->cart->get_cart_contents_count() ); ?></span>
    <?php
    $fragments['span.cart-count'] = ob_get_clean();

    return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'mywoo_cart_count_fragment' );
```
