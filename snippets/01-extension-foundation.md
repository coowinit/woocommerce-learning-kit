# 01 扩展插件基础与安全入口

从 WooCommerce 扩展插件结构开始，整理依赖检查、HPOS 声明、常量、加载顺序和初始化。

> 代码用于学习和研究。复制到正式网站前请先备份并在测试环境验证。

## 1. 最小 WooCommerce 扩展插件入口

**级别：** 基础

**说明：** 适合把 WooCommerce 功能型代码独立成插件，而不是塞进主题 functions.php。

```php
<?php
/**
 * Plugin Name: My Woo Toolkit
 * Description: WooCommerce custom code study plugin.
 * Version: 1.0.0
 * Author: Your Name
 * Requires Plugins: woocommerce
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'MYWOO_PATH', plugin_dir_path( __FILE__ ) );
define( 'MYWOO_URL', plugin_dir_url( __FILE__ ) );
define( 'MYWOO_VERSION', '1.0.0' );

add_action( 'plugins_loaded', 'mywoo_bootstrap' );

function mywoo_bootstrap() {
    if ( ! class_exists( 'WooCommerce' ) ) {
        add_action( 'admin_notices', 'mywoo_missing_woocommerce_notice' );
        return;
    }

    require_once MYWOO_PATH . 'includes/products.php';
    require_once MYWOO_PATH . 'includes/cart.php';
    require_once MYWOO_PATH . 'includes/orders.php';
}
```

## 2. WooCommerce 未启用时显示后台提示

**级别：** 基础

**说明：** 不要在 WooCommerce 未启用时直接调用 WC 函数，否则容易 fatal error。

```php
<?php
function mywoo_missing_woocommerce_notice() {
    if ( ! current_user_can( 'activate_plugins' ) ) {
        return;
    }

    echo '<div class="notice notice-error"><p>';
    echo esc_html__( 'My Woo Toolkit 需要先启用 WooCommerce。', 'mywoo' );
    echo '</p></div>';
}
```

## 3. 声明 HPOS 兼容

**级别：** 重要

**说明：** 新扩展建议声明 HPOS 兼容，并使用 WooCommerce CRUD API 处理订单。

```php
<?php
add_action( 'before_woocommerce_init', function() {
    if ( class_exists( '\Automattic\WooCommerce\Utilities\FeaturesUtil' ) ) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility(
            'custom_order_tables',
            __FILE__,
            true
        );
    }
} );
```

## 4. 用命名空间组织插件类

**级别：** 进阶

**说明：** 复杂扩展建议使用命名空间或类，减少函数名冲突。

```php
<?php
namespace MyWooToolkit;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

final class Plugin {
    public function __construct() {
        add_action( 'woocommerce_init', array( $this, 'init' ) );
    }

    public function init() {
        // WooCommerce 已初始化后的逻辑。
    }
}

new Plugin();
```

## 5. WooCommerce 初始化后执行逻辑

**级别：** 基础

**说明：** 和普通 WordPress init 不同，WooCommerce 相关逻辑可以放到 woocommerce_init。

```php
<?php
function mywoo_after_wc_init() {
    // 这里可以安全使用 WooCommerce 的大部分函数和类。
    $currency = get_woocommerce_currency();
}
add_action( 'woocommerce_init', 'mywoo_after_wc_init' );
```

## 6. 只在 WooCommerce 页面加载资源

**级别：** 性能

**说明：** WooCommerce 页面判断要包含 cart、checkout、account，因为 is_woocommerce() 不包含所有商店相关页面。

```php
<?php
function mywoo_enqueue_assets() {
    if ( ! function_exists( 'is_woocommerce' ) ) {
        return;
    }

    if ( is_woocommerce() || is_cart() || is_checkout() || is_account_page() ) {
        wp_enqueue_style(
            'mywoo-store',
            MYWOO_URL . 'assets/store.css',
            array(),
            MYWOO_VERSION
        );
    }
}
add_action( 'wp_enqueue_scripts', 'mywoo_enqueue_assets' );
```
