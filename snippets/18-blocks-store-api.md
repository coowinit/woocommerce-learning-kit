# 18 Blocks、Store API 与现代结账

整理经典 hooks 与 Blocks 差异、Store API、Blocks 兼容提示和前端扩展注意点。

> 代码用于学习和研究。复制到正式网站前请先备份并在测试环境验证。

## 1. 检测页面是否包含 Checkout Block

**级别：** 实用

**说明：** 有些经典 checkout hooks 对 Checkout Block 不生效，需要实际测试。

```php
<?php
function mywoo_page_has_checkout_block() {
    if ( ! is_singular() ) {
        return false;
    }

    $post = get_post();

    return $post && has_block( 'woocommerce/checkout', $post );
}
```

## 2. 检测 Cart Block

**级别：** 实用

**说明：** Cart Block 和经典购物车 shortcode 的前端结构不同。

```php
<?php
function mywoo_page_has_cart_block() {
    $post = get_post();

    return $post && has_block( 'woocommerce/cart', $post );
}
```

## 3. 针对 Blocks 页面加载资源

**级别：** 性能

**说明：** 现代结账更多需要前端扩展，不能只依赖 PHP 模板 hooks。

```php
<?php
function mywoo_enqueue_blocks_assets() {
    if ( mywoo_page_has_checkout_block() || mywoo_page_has_cart_block() ) {
        wp_enqueue_script(
            'mywoo-blocks-enhance',
            plugin_dir_url( __FILE__ ) . 'assets/blocks-enhance.js',
            array(),
            '1.0.0',
            true
        );
    }
}
add_action( 'wp_enqueue_scripts', 'mywoo_enqueue_blocks_assets' );
```

## 4. 读取 Store API Cart 示例

**级别：** API

**说明：** Store API 是 WooCommerce Blocks 使用的公开接口之一。

```js
fetch('/wp-json/wc/store/v1/cart')
  .then((response) => response.json())
  .then((cart) => {
    console.log(cart.items);
  });
```

## 5. PHP 中提示当前使用 Blocks

**级别：** 后台

**说明：** 给维护人员提示 Blocks 差异很有用。

```php
<?php
function mywoo_checkout_block_admin_notice() {
    $checkout_page_id = wc_get_page_id( 'checkout' );
    $post = get_post( $checkout_page_id );

    if ( $post && has_block( 'woocommerce/checkout', $post ) ) {
        echo '<div class="notice notice-info"><p>当前结账页使用 Checkout Block，请测试自定义 checkout hooks 是否仍生效。</p></div>';
    }
}
add_action( 'admin_notices', 'mywoo_checkout_block_admin_notice' );
```

## 6. 给 classic checkout 和 block checkout 分流

**级别：** 实用

**说明：** 经典结账和 Blocks 结账最好分开处理。

```php
<?php
function mywoo_checkout_customization_loader() {
    if ( mywoo_page_has_checkout_block() ) {
        // 加载 Blocks 相关资源或提示。
        return;
    }

    // 加载经典结账 hooks 自定义。
    add_action( 'woocommerce_after_order_notes', 'mywoo_add_checkout_project_field' );
}
add_action( 'wp', 'mywoo_checkout_customization_loader' );
```
