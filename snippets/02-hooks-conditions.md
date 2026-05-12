# 02 WooCommerce Hooks 与条件判断

整理商店页、产品页、购物车、结账、账户页常用 hooks 和条件标签。

> 代码用于学习和研究。复制到正式网站前请先备份并在测试环境验证。

## 1. 判断 WooCommerce 页面类型

**级别：** 基础

**说明：** WooCommerce 页面判断常用于按需加载资源或输出模块。

```php
<?php
function mywoo_debug_page_type() {
    if ( is_shop() ) {
        error_log( 'Shop archive page' );
    }

    if ( is_product() ) {
        error_log( 'Single product page' );
    }

    if ( is_product_category() ) {
        error_log( 'Product category page' );
    }

    if ( is_cart() || is_checkout() || is_account_page() ) {
        error_log( 'Cart / Checkout / Account related page' );
    }
}
add_action( 'wp', 'mywoo_debug_page_type' );
```

## 2. 在单产品标题后插入提示

**级别：** 基础

**说明：** woocommerce_single_product_summary 是单产品页最常用 hook 之一。

```php
<?php
function mywoo_after_product_title_notice() {
    echo '<p class="product-note">Free sample available for selected regions.</p>';
}
add_action( 'woocommerce_single_product_summary', 'mywoo_after_product_title_notice', 6 );
```

## 3. 移除默认产品 Meta 信息

**级别：** 实用

**说明：** remove_action 的函数和优先级需要匹配 WooCommerce 默认注册。

```php
<?php
function mywoo_remove_product_meta() {
    remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_meta', 40 );
}
add_action( 'wp', 'mywoo_remove_product_meta' );
```

## 4. 修改商店循环按钮文字

**级别：** 实用

**说明：** filter 必须 return。

```php
<?php
function mywoo_loop_add_to_cart_text( $text, $product ) {
    if ( $product && $product->is_type( 'variable' ) ) {
        return 'Choose Options';
    }

    return 'Add to Quote';
}
add_filter( 'woocommerce_product_add_to_cart_text', 'mywoo_loop_add_to_cart_text', 10, 2 );
```

## 5. 在商店页产品卡片中插入自定义字段

**级别：** 实用

**说明：** 循环中可以使用 global $product，但要判断对象类型。

```php
<?php
function mywoo_loop_product_badge() {
    global $product;

    if ( ! $product instanceof WC_Product ) {
        return;
    }

    if ( $product->is_featured() ) {
        echo '<span class="product-badge">Featured</span>';
    }
}
add_action( 'woocommerce_before_shop_loop_item_title', 'mywoo_loop_product_badge', 9 );
```

## 6. 给 hook 回调接收多个参数

**级别：** 进阶

**说明：** add_filter 第四个参数决定回调接收几个参数。

```php
<?php
function mywoo_cart_item_name_suffix( $name, $cart_item, $cart_item_key ) {
    if ( ! empty( $cart_item['custom_note'] ) ) {
        $name .= '<br><small>' . esc_html( $cart_item['custom_note'] ) . '</small>';
    }

    return $name;
}
add_filter( 'woocommerce_cart_item_name', 'mywoo_cart_item_name_suffix', 10, 3 );
```
