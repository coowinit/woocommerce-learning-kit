# 14 优惠券与促销规则

整理优惠券 CRUD、自动应用优惠券、自定义验证、限制条件和活动提示。

> 代码用于学习和研究。复制到正式网站前请先备份并在测试环境验证。

## 1. 用代码创建优惠券

**级别：** 基础

**说明：** 优惠券创建后会保存为 WooCommerce coupon 数据。

```php
<?php
function mywoo_create_coupon() {
    $coupon = new WC_Coupon();

    $coupon->set_code( 'WELCOME10' );
    $coupon->set_discount_type( 'percent' );
    $coupon->set_amount( 10 );
    $coupon->set_individual_use( true );
    $coupon->set_usage_limit( 100 );
    $coupon->save();
}
```

## 2. 自动应用优惠券

**级别：** 实用

**说明：** 自动优惠券要避免重复应用。

```php
<?php
function mywoo_auto_apply_coupon() {
    if ( is_admin() || ! WC()->cart ) {
        return;
    }

    $coupon_code = 'WELCOME10';

    if ( WC()->cart->get_subtotal() >= 100 && ! WC()->cart->has_discount( $coupon_code ) ) {
        WC()->cart->apply_coupon( $coupon_code );
    }
}
add_action( 'woocommerce_before_calculate_totals', 'mywoo_auto_apply_coupon' );
```

## 3. 按产品分类限制优惠券

**级别：** 实用

**说明：** woocommerce_coupon_is_valid 可自定义优惠券有效性。

```php
<?php
function mywoo_coupon_valid_for_category( $valid, $coupon, $discount ) {
    if ( 'DECKING10' !== strtoupper( $coupon->get_code() ) ) {
        return $valid;
    }

    foreach ( WC()->cart->get_cart() as $cart_item ) {
        if ( has_term( 'decking', 'product_cat', $cart_item['product_id'] ) ) {
            return true;
        }
    }

    return false;
}
add_filter( 'woocommerce_coupon_is_valid', 'mywoo_coupon_valid_for_category', 10, 3 );
```

## 4. 自定义优惠券错误信息

**级别：** 实用

**说明：** 错误提示清楚能减少客户困惑。

```php
<?php
function mywoo_coupon_error_message( $err, $err_code, $coupon ) {
    if ( $coupon && 'DECKING10' === strtoupper( $coupon->get_code() ) ) {
        return 'This coupon is only available for decking products.';
    }

    return $err;
}
add_filter( 'woocommerce_coupon_error', 'mywoo_coupon_error_message', 10, 3 );
```

## 5. 购物车显示促销提示

**级别：** 前台

**说明：** 促销提示要和实际规则保持一致。

```php
<?php
function mywoo_cart_promo_notice() {
    if ( WC()->cart && WC()->cart->get_subtotal() < 200 ) {
        $remaining = 200 - WC()->cart->get_subtotal();

        wc_print_notice(
            'Spend ' . wc_price( $remaining ) . ' more to unlock free shipping.',
            'notice'
        );
    }
}
add_action( 'woocommerce_before_cart', 'mywoo_cart_promo_notice' );
```

## 6. 禁止优惠券与特定支付方式共用

**级别：** 进阶

**说明：** 支付方式依赖 session，结账刷新时要反复测试。

```php
<?php
function mywoo_remove_coupon_for_cod( $valid, $coupon ) {
    if ( isset( WC()->session ) && 'cod' === WC()->session->get( 'chosen_payment_method' ) ) {
        return false;
    }

    return $valid;
}
add_filter( 'woocommerce_coupon_is_valid', 'mywoo_remove_coupon_for_cod', 10, 2 );
```
