# 06 价格、折扣与费用

整理价格显示、动态价格、购物车费用、条件折扣、价格 HTML 和税费相关注意点。

> 代码用于学习和研究。复制到正式网站前请先备份并在测试环境验证。

## 1. 修改价格 HTML 显示

**级别：** 基础

**说明：** 这个只修改显示，不一定改变实际结账价格。

```php
<?php
function mywoo_custom_price_html( $price_html, $product ) {
    if ( $product->is_on_sale() ) {
        $price_html .= '<span class="sale-note"> Limited time offer</span>';
    }

    return $price_html;
}
add_filter( 'woocommerce_get_price_html', 'mywoo_custom_price_html', 10, 2 );
```

## 2. 给指定分类产品前台隐藏价格

**级别：** 实用

**说明：** 隐藏价格不等于禁止购买，还需要控制购买按钮。

```php
<?php
function mywoo_hide_price_for_quote_category( $price_html, $product ) {
    if ( has_term( 'quote-only', 'product_cat', $product->get_id() ) ) {
        return '<span class="quote-only">Request a Quote</span>';
    }

    return $price_html;
}
add_filter( 'woocommerce_get_price_html', 'mywoo_hide_price_for_quote_category', 10, 2 );
```

## 3. 购物车中添加手续费

**级别：** 实用

**说明：** 费用是否 taxable 要按业务和税务规则确认。

```php
<?php
function mywoo_add_handling_fee( $cart ) {
    if ( is_admin() && ! defined( 'DOING_AJAX' ) ) {
        return;
    }

    if ( $cart->get_subtotal() < 100 ) {
        $cart->add_fee( 'Small Order Handling Fee', 10, true );
    }
}
add_action( 'woocommerce_cart_calculate_fees', 'mywoo_add_handling_fee' );
```

## 4. 基于购物车小计添加折扣

**级别：** 实用

**说明：** 负 fee 可做折扣，但要认真测试税费、退款和报表表现。

```php
<?php
function mywoo_bulk_order_discount( $cart ) {
    if ( $cart->get_subtotal() >= 500 ) {
        $discount = $cart->get_subtotal() * 0.05;
        $cart->add_fee( 'Bulk Order Discount', -$discount, false );
    }
}
add_action( 'woocommerce_cart_calculate_fees', 'mywoo_bulk_order_discount' );
```

## 5. 动态调整购物车商品价格

**级别：** 进阶

**说明：** 动态改价要避免重复叠加，并测试购物车刷新、优惠券、税费。

```php
<?php
function mywoo_dynamic_cart_item_price( $cart ) {
    if ( is_admin() && ! defined( 'DOING_AJAX' ) ) {
        return;
    }

    foreach ( $cart->get_cart() as $cart_item ) {
        $product = $cart_item['data'];

        if ( has_term( 'clearance', 'product_cat', $product->get_id() ) ) {
            $product->set_price( $product->get_price() * 0.9 );
        }
    }
}
add_action( 'woocommerce_before_calculate_totals', 'mywoo_dynamic_cart_item_price' );
```

## 6. 格式化价格输出

**级别：** 基础

**说明：** 前台显示金额时使用 wc_price，自动带货币格式。

```php
<?php
$amount = 123.45;

echo wc_price( $amount );
```
