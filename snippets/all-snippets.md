# WooCommerce Code Study Snippets

本文件汇总所有页面中的代码片段。

## 01 扩展插件基础与安全入口

### 1. 最小 WooCommerce 扩展插件入口

- 级别：基础
- 说明：适合把 WooCommerce 功能型代码独立成插件，而不是塞进主题 functions.php。

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

### 2. WooCommerce 未启用时显示后台提示

- 级别：基础
- 说明：不要在 WooCommerce 未启用时直接调用 WC 函数，否则容易 fatal error。

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

### 3. 声明 HPOS 兼容

- 级别：重要
- 说明：新扩展建议声明 HPOS 兼容，并使用 WooCommerce CRUD API 处理订单。

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

### 4. 用命名空间组织插件类

- 级别：进阶
- 说明：复杂扩展建议使用命名空间或类，减少函数名冲突。

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

### 5. WooCommerce 初始化后执行逻辑

- 级别：基础
- 说明：和普通 WordPress init 不同，WooCommerce 相关逻辑可以放到 woocommerce_init。

```php
<?php
function mywoo_after_wc_init() {
    // 这里可以安全使用 WooCommerce 的大部分函数和类。
    $currency = get_woocommerce_currency();
}
add_action( 'woocommerce_init', 'mywoo_after_wc_init' );
```

### 6. 只在 WooCommerce 页面加载资源

- 级别：性能
- 说明：WooCommerce 页面判断要包含 cart、checkout、account，因为 is_woocommerce() 不包含所有商店相关页面。

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

## 02 WooCommerce Hooks 与条件判断

### 1. 判断 WooCommerce 页面类型

- 级别：基础
- 说明：WooCommerce 页面判断常用于按需加载资源或输出模块。

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

### 2. 在单产品标题后插入提示

- 级别：基础
- 说明：woocommerce_single_product_summary 是单产品页最常用 hook 之一。

```php
<?php
function mywoo_after_product_title_notice() {
    echo '<p class="product-note">Free sample available for selected regions.</p>';
}
add_action( 'woocommerce_single_product_summary', 'mywoo_after_product_title_notice', 6 );
```

### 3. 移除默认产品 Meta 信息

- 级别：实用
- 说明：remove_action 的函数和优先级需要匹配 WooCommerce 默认注册。

```php
<?php
function mywoo_remove_product_meta() {
    remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_meta', 40 );
}
add_action( 'wp', 'mywoo_remove_product_meta' );
```

### 4. 修改商店循环按钮文字

- 级别：实用
- 说明：filter 必须 return。

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

### 5. 在商店页产品卡片中插入自定义字段

- 级别：实用
- 说明：循环中可以使用 global $product，但要判断对象类型。

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

### 6. 给 hook 回调接收多个参数

- 级别：进阶
- 说明：add_filter 第四个参数决定回调接收几个参数。

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

## 03 产品 CRUD 与查询

### 1. 读取产品对象和常用数据

- 级别：基础
- 说明：优先使用 WooCommerce CRUD 方法，而不是直接 get_post_meta。

```php
<?php
$product = wc_get_product( 123 );

if ( $product ) {
    $name  = $product->get_name();
    $sku   = $product->get_sku();
    $price = $product->get_price();

    echo esc_html( $name . ' / ' . $sku . ' / ' . wc_price( $price ) );
}
```

### 2. 创建简单产品

- 级别：实用
- 说明：创建或更新产品时，最后必须 save()。

```php
<?php
function mywoo_create_simple_product() {
    $product = new WC_Product_Simple();

    $product->set_name( 'Sample Decking Board' );
    $product->set_sku( 'DECK-SAMPLE-001' );
    $product->set_regular_price( '29.99' );
    $product->set_description( 'A sample product created by code.' );
    $product->set_status( 'publish' );

    $product_id = $product->save();

    return $product_id;
}
```

### 3. 按 SKU 查找产品 ID

- 级别：基础
- 说明：SKU 应保持唯一，便于同步 ERP、库存和导入数据。

```php
<?php
$sku = 'DECK-SAMPLE-001';

$product_id = wc_get_product_id_by_sku( $sku );

if ( $product_id ) {
    $product = wc_get_product( $product_id );
}
```

### 4. 更新产品价格和库存

- 级别：实用
- 说明：价格和库存都建议通过 CRUD 方法更新。

```php
<?php
$product = wc_get_product( 123 );

if ( $product ) {
    $product->set_regular_price( '49.99' );
    $product->set_sale_price( '39.99' );
    $product->set_manage_stock( true );
    $product->set_stock_quantity( 20 );
    $product->set_stock_status( 'instock' );
    $product->save();
}
```

### 5. 使用 WC_Product_Query 查询产品

- 级别：进阶
- 说明：WC_Product_Query 比直接 WP_Query 更贴近 WooCommerce 产品数据。

```php
<?php
$query = new WC_Product_Query( array(
    'limit'        => 8,
    'status'       => 'publish',
    'featured'     => true,
    'orderby'      => 'date',
    'order'        => 'DESC',
    'return'       => 'objects',
) );

$products = $query->get_products();

foreach ( $products as $product ) {
    echo '<h3>' . esc_html( $product->get_name() ) . '</h3>';
}
```

### 6. 批量给指定分类产品加标签

- 级别：实用
- 说明：批量操作前建议先在测试环境跑，并限制范围。

```php
<?php
function mywoo_tag_products_in_category() {
    $products = wc_get_products( array(
        'limit'    => -1,
        'category' => array( 'decking' ),
        'return'   => 'ids',
    ) );

    foreach ( $products as $product_id ) {
        wp_set_object_terms( $product_id, 'featured-decking', 'product_tag', true );
    }
}
```

## 04 可变产品、属性与变体

### 1. 获取产品属性

- 级别：基础
- 说明：属性可能是全局 taxonomy，也可能是产品自定义属性。

```php
<?php
$product = wc_get_product( 123 );

if ( $product ) {
    foreach ( $product->get_attributes() as $attribute ) {
        echo esc_html( wc_attribute_label( $attribute->get_name() ) );
    }
}
```

### 2. 创建可变产品基础对象

- 级别：进阶
- 说明：可变产品本身不直接售卖，通常通过 variation 售卖。

```php
<?php
$product = new WC_Product_Variable();
$product->set_name( 'Composite Decking Board' );
$product->set_status( 'publish' );
$product_id = $product->save();
```

### 3. 给产品设置自定义属性

- 级别：进阶
- 说明：set_variation(true) 表示该属性可用于变体。

```php
<?php
$product = wc_get_product( $product_id );

$attribute = new WC_Product_Attribute();
$attribute->set_name( 'Color' );
$attribute->set_options( array( 'Teak', 'Walnut', 'Grey' ) );
$attribute->set_position( 0 );
$attribute->set_visible( true );
$attribute->set_variation( true );

$product->set_attributes( array( $attribute ) );
$product->save();
```

### 4. 创建变体

- 级别：进阶
- 说明：变体属性 key/value 要和父产品属性对应。

```php
<?php
$variation = new WC_Product_Variation();
$variation->set_parent_id( $product_id );
$variation->set_attributes( array(
    'Color' => 'Teak',
) );
$variation->set_regular_price( '59.99' );
$variation->set_manage_stock( true );
$variation->set_stock_quantity( 10 );
$variation->save();
```

### 5. 读取可变产品的可用变体

- 级别：基础
- 说明：get_available_variations 返回数组，适合前台展示。

```php
<?php
$product = wc_get_product( 123 );

if ( $product && $product->is_type( 'variable' ) ) {
    $variations = $product->get_available_variations();

    foreach ( $variations as $variation ) {
        echo esc_html( $variation['variation_id'] . ' - ' . $variation['display_price'] );
    }
}
```

### 6. 变体选择后追加自定义数据

- 级别：实用
- 说明：可把变体额外数据传给前端 variation JS 使用。

```php
<?php
function mywoo_available_variation_extra_data( $data, $product, $variation ) {
    $data['custom_lead_time'] = get_post_meta( $variation->get_id(), '_lead_time', true );

    return $data;
}
add_filter( 'woocommerce_available_variation', 'mywoo_available_variation_extra_data', 10, 3 );
```

## 05 产品后台字段与前台展示

### 1. 在产品常规区域添加字段

- 级别：基础
- 说明：woocommerce_wp_text_input 是 WooCommerce 后台字段辅助函数。

```php
<?php
function mywoo_add_product_lead_time_field() {
    woocommerce_wp_text_input( array(
        'id'          => '_lead_time',
        'label'       => 'Lead Time',
        'placeholder' => '2-3 weeks',
        'desc_tip'    => true,
        'description' => 'Estimated production or shipping lead time.',
    ) );
}
add_action( 'woocommerce_product_options_general_product_data', 'mywoo_add_product_lead_time_field' );
```

### 2. 保存产品自定义字段

- 级别：基础
- 说明：保存时用产品对象 update_meta_data，更利于 CRUD 兼容。

```php
<?php
function mywoo_save_product_lead_time( $post_id ) {
    $lead_time = isset( $_POST['_lead_time'] ) ? sanitize_text_field( wp_unslash( $_POST['_lead_time'] ) ) : '';

    $product = wc_get_product( $post_id );
    $product->update_meta_data( '_lead_time', $lead_time );
    $product->save();
}
add_action( 'woocommerce_process_product_meta', 'mywoo_save_product_lead_time' );
```

### 3. 前台单产品页展示字段

- 级别：实用
- 说明：前台输出字段时必须 escape。

```php
<?php
function mywoo_show_lead_time_on_product() {
    global $product;

    if ( ! $product instanceof WC_Product ) {
        return;
    }

    $lead_time = $product->get_meta( '_lead_time' );

    if ( $lead_time ) {
        echo '<p class="lead-time"><strong>Lead Time:</strong> ' . esc_html( $lead_time ) . '</p>';
    }
}
add_action( 'woocommerce_single_product_summary', 'mywoo_show_lead_time_on_product', 25 );
```

### 4. 添加产品详情 Tab

- 级别：实用
- 说明：产品 Tab 适合放规格、安装说明、质保等内容。

```php
<?php
function mywoo_add_product_custom_tab( $tabs ) {
    $tabs['technical_specs'] = array(
        'title'    => 'Technical Specs',
        'priority' => 40,
        'callback' => 'mywoo_product_specs_tab_content',
    );

    return $tabs;
}
add_filter( 'woocommerce_product_tabs', 'mywoo_add_product_custom_tab' );

function mywoo_product_specs_tab_content() {
    global $product;

    echo '<h2>Technical Specifications</h2>';
    echo wp_kses_post( wpautop( $product->get_meta( '_technical_specs' ) ) );
}
```

### 5. 后台产品列表增加 Lead Time 列

- 级别：后台
- 说明：后台列能提升维护效率。

```php
<?php
function mywoo_product_admin_columns( $columns ) {
    $columns['lead_time'] = 'Lead Time';
    return $columns;
}
add_filter( 'manage_edit-product_columns', 'mywoo_product_admin_columns' );

function mywoo_product_admin_column_content( $column, $post_id ) {
    if ( 'lead_time' === $column ) {
        $product = wc_get_product( $post_id );
        echo esc_html( $product ? $product->get_meta( '_lead_time' ) : '' );
    }
}
add_action( 'manage_product_posts_custom_column', 'mywoo_product_admin_column_content', 10, 2 );
```

### 6. 给产品字段加权限判断

- 级别：安全
- 说明：产品后台自定义保存逻辑要注意权限。

```php
<?php
function mywoo_can_edit_product_extra_fields() {
    return current_user_can( 'edit_products' ) || current_user_can( 'manage_woocommerce' );
}

if ( mywoo_can_edit_product_extra_fields() ) {
    // 执行保存或显示敏感字段逻辑。
}
```

## 06 价格、折扣与费用

### 1. 修改价格 HTML 显示

- 级别：基础
- 说明：这个只修改显示，不一定改变实际结账价格。

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

### 2. 给指定分类产品前台隐藏价格

- 级别：实用
- 说明：隐藏价格不等于禁止购买，还需要控制购买按钮。

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

### 3. 购物车中添加手续费

- 级别：实用
- 说明：费用是否 taxable 要按业务和税务规则确认。

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

### 4. 基于购物车小计添加折扣

- 级别：实用
- 说明：负 fee 可做折扣，但要认真测试税费、退款和报表表现。

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

### 5. 动态调整购物车商品价格

- 级别：进阶
- 说明：动态改价要避免重复叠加，并测试购物车刷新、优惠券、税费。

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

### 6. 格式化价格输出

- 级别：基础
- 说明：前台显示金额时使用 wc_price，自动带货币格式。

```php
<?php
$amount = 123.45;

echo wc_price( $amount );
```

## 07 购物车、Session 与提示

### 1. 加入购物车时保存自定义数据

- 级别：实用
- 说明：unique_key 可以避免带不同自定义数据的同产品被合并。

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

### 2. 购物车显示自定义数据

- 级别：实用
- 说明：购物车显示数据和订单保存数据是两个步骤。

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

### 3. 把购物车自定义数据保存到订单 item

- 级别：重要
- 说明：不保存到订单，后台订单里就看不到购物车自定义数据。

```php
<?php
function mywoo_add_cart_data_to_order_item( $item, $cart_item_key, $values, $order ) {
    if ( ! empty( $values['engraving_text'] ) ) {
        $item->add_meta_data( 'Engraving', $values['engraving_text'], true );
    }
}
add_action( 'woocommerce_checkout_create_order_line_item', 'mywoo_add_cart_data_to_order_item', 10, 4 );
```

### 4. 加入购物车前验证

- 级别：安全
- 说明：验证失败返回 false，并用 wc_add_notice 给用户反馈。

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

### 5. 使用 WooCommerce Session

- 级别：实用
- 说明：session 适合保存临时结账/购物流程数据。

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

### 6. 更新迷你购物车 fragments

- 级别：前端
- 说明：AJAX 加入购物车后，fragments 用于刷新页面局部内容。

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

## 08 结账字段、验证与订单 Meta

### 1. 修改结账字段 label 和 required

- 级别：基础
- 说明：经典结账字段可通过 woocommerce_checkout_fields 过滤。

```php
<?php
function mywoo_customize_checkout_fields( $fields ) {
    $fields['billing']['billing_phone']['label'] = 'Phone / WhatsApp';
    $fields['billing']['billing_phone']['required'] = true;

    unset( $fields['billing']['billing_company'] );

    return $fields;
}
add_filter( 'woocommerce_checkout_fields', 'mywoo_customize_checkout_fields' );
```

### 2. 添加自定义结账字段

- 级别：实用
- 说明：woocommerce_form_field 可生成 WooCommerce 风格字段。

```php
<?php
function mywoo_add_checkout_project_field( $checkout ) {
    woocommerce_form_field( 'project_type', array(
        'type'     => 'select',
        'class'    => array( 'form-row-wide' ),
        'label'    => 'Project Type',
        'required' => true,
        'options'  => array(
            ''          => 'Select project type',
            'decking'   => 'Decking',
            'cladding'  => 'Cladding',
            'fencing'   => 'Fencing',
        ),
    ), $checkout->get_value( 'project_type' ) );
}
add_action( 'woocommerce_after_order_notes', 'mywoo_add_checkout_project_field' );
```

### 3. 验证自定义字段

- 级别：基础
- 说明：验证失败用 wc_add_notice，结账会阻止提交。

```php
<?php
function mywoo_validate_project_type() {
    if ( empty( $_POST['project_type'] ) ) {
        wc_add_notice( 'Please select a project type.', 'error' );
    }
}
add_action( 'woocommerce_checkout_process', 'mywoo_validate_project_type' );
```

### 4. 保存字段到订单

- 级别：重要
- 说明：保存订单 meta 推荐使用订单对象，兼容 HPOS。

```php
<?php
function mywoo_save_project_type_to_order( $order, $data ) {
    if ( isset( $_POST['project_type'] ) ) {
        $order->update_meta_data(
            '_project_type',
            sanitize_text_field( wp_unslash( $_POST['project_type'] ) )
        );
    }
}
add_action( 'woocommerce_checkout_create_order', 'mywoo_save_project_type_to_order', 10, 2 );
```

### 5. 后台订单页显示字段

- 级别：实用
- 说明：后台显示时不要直接 get_post_meta 订单 ID，优先使用 $order->get_meta。

```php
<?php
function mywoo_show_project_type_admin_order( $order ) {
    $project_type = $order->get_meta( '_project_type' );

    if ( $project_type ) {
        echo '<p><strong>Project Type:</strong> ' . esc_html( $project_type ) . '</p>';
    }
}
add_action( 'woocommerce_admin_order_data_after_billing_address', 'mywoo_show_project_type_admin_order' );
```

### 6. 根据字段内容修改订单备注

- 级别：进阶
- 说明：订单备注适合保存内部处理提示。

```php
<?php
function mywoo_add_project_note_to_order( $order, $data ) {
    $project_type = $order->get_meta( '_project_type' );

    if ( $project_type ) {
        $order->add_order_note( 'Project type selected at checkout: ' . $project_type );
    }
}
add_action( 'woocommerce_checkout_order_processed', 'mywoo_add_project_note_to_order', 20, 2 );
```

## 09 订单 CRUD 与 HPOS 兼容

### 1. 读取订单基础数据

- 级别：基础
- 说明：订单读取优先使用 wc_get_order。

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

### 2. 更新订单 meta 并保存

- 级别：基础
- 说明：HPOS 兼容代码应使用订单对象 CRUD。

```php
<?php
$order = wc_get_order( 123 );

if ( $order ) {
    $order->update_meta_data( '_sales_owner', 'Felix' );
    $order->save();
}
```

### 3. 添加订单备注

- 级别：基础
- 说明：订单备注适合记录内部跟进或自动化处理结果。

```php
<?php
$order = wc_get_order( 123 );

if ( $order ) {
    $order->add_order_note( 'Customer requested installation guide.' );
}
```

### 4. 查询最近处理中订单

- 级别：实用
- 说明：wc_get_orders 是 HPOS 友好的订单查询方式。

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

### 5. 监听订单状态变化

- 级别：重要
- 说明：订单状态变更是自动化流程的关键 hook。

```php
<?php
function mywoo_order_status_changed( $order_id, $old_status, $new_status, $order ) {
    if ( 'processing' === $new_status ) {
        $order->add_order_note( 'Order moved to processing. Start fulfillment workflow.' );
    }
}
add_action( 'woocommerce_order_status_changed', 'mywoo_order_status_changed', 10, 4 );
```

### 6. 检测 HPOS 是否启用

- 级别：进阶
- 说明：一般业务代码优先用 CRUD，只有写底层 SQL 时才需要判断 HPOS。

```php
<?php
use Automattic\WooCommerce\Utilities\OrderUtil;

if ( class_exists( OrderUtil::class ) && OrderUtil::custom_orders_table_usage_is_enabled() ) {
    error_log( 'HPOS custom order tables are enabled.' );
} else {
    error_log( 'Orders may be using legacy post storage.' );
}
```

## 10 订单商品、退款与发货信息

### 1. 遍历订单商品

- 级别：基础
- 说明：订单 item 中可获取产品、数量、小计等信息。

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

### 2. 读取订单 item meta

- 级别：基础
- 说明：购物车自定义数据保存到订单 item 后，可在这里读取。

```php
<?php
foreach ( $order->get_items() as $item ) {
    $engraving = $item->get_meta( 'Engraving' );

    if ( $engraving ) {
        echo esc_html( $engraving );
    }
}
```

### 3. 给订单 item 添加内部 meta

- 级别：实用
- 说明：以下划线开头的 meta 通常不在前台明显展示，适合内部信息。

```php
<?php
function mywoo_add_line_item_internal_meta( $item, $cart_item_key, $values, $order ) {
    if ( ! empty( $values['production_batch'] ) ) {
        $item->add_meta_data( '_production_batch', $values['production_batch'], true );
    }
}
add_action( 'woocommerce_checkout_create_order_line_item', 'mywoo_add_line_item_internal_meta', 10, 4 );
```

### 4. 创建部分退款

- 级别：进阶
- 说明：真实退款可能涉及支付网关 refund_payment，务必测试。

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

### 5. 保存物流单号到订单 meta

- 级别：实用
- 说明：物流信息可保存到订单 meta，也可用专业物流插件。

```php
<?php
$order = wc_get_order( 123 );

if ( $order ) {
    $order->update_meta_data( '_tracking_number', 'TRACK123456' );
    $order->add_order_note( 'Tracking number added: TRACK123456' );
    $order->save();
}
```

### 6. 邮件中显示物流单号

- 级别：实用
- 说明：邮件输出要注意 HTML 和纯文本兼容。

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

## 11 邮件通知与模板

### 1. 订单邮件表格后添加内容

- 级别：基础
- 说明：适合给客户邮件补充说明。

```php
<?php
function mywoo_email_extra_content( $order, $sent_to_admin, $plain_text, $email ) {
    if ( $sent_to_admin ) {
        return;
    }

    echo '<p>Thank you for your order. Our team will contact you soon.</p>';
}
add_action( 'woocommerce_email_after_order_table', 'mywoo_email_extra_content', 10, 4 );
```

### 2. 修改新订单管理员收件人

- 级别：实用
- 说明：多个收件人用英文逗号分隔。

```php
<?php
function mywoo_new_order_recipients( $recipient, $order ) {
    if ( ! $order instanceof WC_Order ) {
        return $recipient;
    }

    $recipient .= ', sales@example.com';

    return $recipient;
}
add_filter( 'woocommerce_email_recipient_new_order', 'mywoo_new_order_recipients', 10, 2 );
```

### 3. 根据订单地区增加收件人

- 级别：实用
- 说明：按地区分配订单跟进很常见。

```php
<?php
function mywoo_region_based_order_recipient( $recipient, $order ) {
    if ( ! $order instanceof WC_Order ) {
        return $recipient;
    }

    if ( 'QLD' === $order->get_shipping_state() ) {
        $recipient .= ', qld-sales@example.com';
    }

    return $recipient;
}
add_filter( 'woocommerce_email_recipient_new_order', 'mywoo_region_based_order_recipient', 20, 2 );
```

### 4. 修改邮件主题

- 级别：实用
- 说明：邮件标题清晰有助于销售快速识别订单来源。

```php
<?php
function mywoo_new_order_subject( $subject, $order ) {
    if ( $order instanceof WC_Order ) {
        $subject = 'New Order #' . $order->get_order_number() . ' - ' . $order->get_billing_state();
    }

    return $subject;
}
add_filter( 'woocommerce_email_subject_new_order', 'mywoo_new_order_subject', 10, 2 );
```

### 5. 给邮件添加附件

- 级别：进阶
- 说明：附件过大会影响邮件送达，建议谨慎使用。

```php
<?php
function mywoo_email_attachments( $attachments, $email_id, $order ) {
    if ( 'customer_completed_order' === $email_id ) {
        $file = WP_CONTENT_DIR . '/uploads/guides/installation-guide.pdf';

        if ( file_exists( $file ) ) {
            $attachments[] = $file;
        }
    }

    return $attachments;
}
add_filter( 'woocommerce_email_attachments', 'mywoo_email_attachments', 10, 3 );
```

### 6. 订单完成时发送内部提醒

- 级别：实用
- 说明：内部自动邮件也需要 SMTP 和日志监控。

```php
<?php
function mywoo_completed_order_internal_notice( $order_id ) {
    $order = wc_get_order( $order_id );

    if ( ! $order ) {
        return;
    }

    wp_mail(
        'operations@example.com',
        'Order completed: #' . $order->get_order_number(),
        'Please archive documents for this completed order.'
    );
}
add_action( 'woocommerce_order_status_completed', 'mywoo_completed_order_internal_notice' );
```

## 12 配送方式、区域与运费

### 1. 按购物车金额隐藏固定运费

- 级别：实用
- 说明：当免邮可用时隐藏固定运费，是常见需求。

```php
<?php
function mywoo_hide_flat_rate_when_free_shipping( $rates, $package ) {
    $free_shipping_available = false;

    foreach ( $rates as $rate ) {
        if ( 'free_shipping' === $rate->method_id ) {
            $free_shipping_available = true;
            break;
        }
    }

    if ( $free_shipping_available ) {
        foreach ( $rates as $rate_id => $rate ) {
            if ( 'flat_rate' === $rate->method_id ) {
                unset( $rates[ $rate_id ] );
            }
        }
    }

    return $rates;
}
add_filter( 'woocommerce_package_rates', 'mywoo_hide_flat_rate_when_free_shipping', 10, 2 );
```

### 2. 根据州隐藏配送方式

- 级别：实用
- 说明：配送条件要测试不同地址。

```php
<?php
function mywoo_limit_shipping_by_state( $rates, $package ) {
    $state = isset( $package['destination']['state'] ) ? $package['destination']['state'] : '';

    if ( 'QLD' !== $state ) {
        foreach ( $rates as $rate_id => $rate ) {
            if ( 'local_pickup' === $rate->method_id ) {
                unset( $rates[ $rate_id ] );
            }
        }
    }

    return $rates;
}
add_filter( 'woocommerce_package_rates', 'mywoo_limit_shipping_by_state', 10, 2 );
```

### 3. 给结账页添加配送说明

- 级别：前台
- 说明：适合展示交付说明、偏远地区提示等。

```php
<?php
function mywoo_shipping_notice_checkout() {
    echo '<p class="shipping-note">Delivery times vary by region. Our team will confirm after order review.</p>';
}
add_action( 'woocommerce_review_order_before_shipping', 'mywoo_shipping_notice_checkout' );
```

### 4. 自定义配送方式骨架

- 级别：进阶
- 说明：这是骨架，真实项目需要加入设置项、区域、重量体积等规则。

```php
<?php
function mywoo_register_custom_shipping_method() {
    if ( ! class_exists( 'WC_Shipping_Method' ) ) {
        return;
    }

    class MyWoo_Custom_Shipping_Method extends WC_Shipping_Method {
        public function __construct() {
            $this->id                 = 'mywoo_custom_shipping';
            $this->method_title       = 'Custom Project Delivery';
            $this->method_description = 'Custom delivery method for project orders.';
            $this->enabled            = 'yes';
            $this->title              = 'Project Delivery';

            $this->init();
        }

        public function init() {
            $this->init_form_fields();
            $this->init_settings();

            add_action( 'woocommerce_update_options_shipping_' . $this->id, array( $this, 'process_admin_options' ) );
        }

        public function calculate_shipping( $package = array() ) {
            $this->add_rate( array(
                'id'    => $this->id,
                'label' => $this->title,
                'cost'  => 50,
            ) );
        }
    }
}
add_action( 'woocommerce_shipping_init', 'mywoo_register_custom_shipping_method' );
```

### 5. 把自定义配送方式加入列表

- 级别：进阶
- 说明：类注册和 methods filter 要配合使用。

```php
<?php
function mywoo_add_custom_shipping_method( $methods ) {
    $methods['mywoo_custom_shipping'] = 'MyWoo_Custom_Shipping_Method';
    return $methods;
}
add_filter( 'woocommerce_shipping_methods', 'mywoo_add_custom_shipping_method' );
```

### 6. 按产品分类增加特殊配送费用

- 级别：实用
- 说明：这属于购物车费用，不是配送 rate，但可用于处理特殊搬运费。

```php
<?php
function mywoo_oversize_shipping_fee( $cart ) {
    foreach ( $cart->get_cart() as $cart_item ) {
        if ( has_term( 'oversize', 'product_cat', $cart_item['product_id'] ) ) {
            $cart->add_fee( 'Oversize Handling', 35, true );
            return;
        }
    }
}
add_action( 'woocommerce_cart_calculate_fees', 'mywoo_oversize_shipping_fee' );
```

## 13 支付网关与回调

### 1. 注册自定义支付网关类

- 级别：进阶
- 说明：支付网关需要继承 WC_Payment_Gateway。

```php
<?php
function mywoo_register_gateway_class() {
    if ( ! class_exists( 'WC_Payment_Gateway' ) ) {
        return;
    }

    class MyWoo_Invoice_Gateway extends WC_Payment_Gateway {
        public function __construct() {
            $this->id                 = 'mywoo_invoice';
            $this->method_title       = 'Invoice Payment';
            $this->method_description = 'Pay by invoice after order review.';
            $this->has_fields         = false;

            $this->init_form_fields();
            $this->init_settings();

            $this->title       = $this->get_option( 'title', 'Invoice Payment' );
            $this->description = $this->get_option( 'description', 'We will send an invoice after reviewing your order.' );

            add_action( 'woocommerce_update_options_payment_gateways_' . $this->id, array( $this, 'process_admin_options' ) );
        }
    }
}
add_action( 'plugins_loaded', 'mywoo_register_gateway_class' );
```

### 2. 支付网关设置字段

- 级别：进阶
- 说明：这段方法写在 gateway class 内部。

```php
<?php
public function init_form_fields() {
    $this->form_fields = array(
        'enabled' => array(
            'title'   => 'Enable/Disable',
            'type'    => 'checkbox',
            'label'   => 'Enable Invoice Payment',
            'default' => 'no',
        ),
        'title' => array(
            'title'   => 'Title',
            'type'    => 'text',
            'default' => 'Invoice Payment',
        ),
        'description' => array(
            'title'   => 'Description',
            'type'    => 'textarea',
            'default' => 'We will contact you with invoice details.',
        ),
    );
}
```

### 3. 处理付款 process_payment

- 级别：进阶
- 说明：离线支付通常设为 on-hold；在线支付成功后一般 payment_complete。

```php
<?php
public function process_payment( $order_id ) {
    $order = wc_get_order( $order_id );

    if ( ! $order ) {
        return array( 'result' => 'failure' );
    }

    $order->update_status( 'on-hold', 'Awaiting invoice payment.' );
    WC()->cart->empty_cart();

    return array(
        'result'   => 'success',
        'redirect' => $this->get_return_url( $order ),
    );
}
```

### 4. 把网关加入 WooCommerce

- 级别：进阶
- 说明：类名需要和自定义 gateway class 一致。

```php
<?php
function mywoo_add_invoice_gateway( $gateways ) {
    $gateways[] = 'MyWoo_Invoice_Gateway';
    return $gateways;
}
add_filter( 'woocommerce_payment_gateways', 'mywoo_add_invoice_gateway' );
```

### 5. 付款成功时完成订单

- 级别：支付
- 说明：真实网关回调必须验证签名，不能只相信请求参数。

```php
<?php
function mywoo_mark_payment_complete( $order_id, $transaction_id ) {
    $order = wc_get_order( $order_id );

    if ( $order && ! $order->is_paid() ) {
        $order->payment_complete( $transaction_id );
        $order->add_order_note( 'Payment confirmed by gateway callback.' );
    }
}
```

### 6. 支付回调 webhook 骨架

- 级别：安全
- 说明：支付 webhook 必须验证签名、金额、订单号和幂等处理。

```php
<?php
function mywoo_payment_webhook_endpoint() {
    if ( ! isset( $_GET['mywoo_payment_webhook'] ) ) {
        return;
    }

    $payload = file_get_contents( 'php://input' );
    $signature = isset( $_SERVER['HTTP_X_SIGNATURE'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_SIGNATURE'] ) ) : '';

    // TODO: 验证签名、解析 payload、查找订单、更新状态。

    status_header( 200 );
    echo 'OK';
    exit;
}
add_action( 'init', 'mywoo_payment_webhook_endpoint' );
```

## 14 优惠券与促销规则

### 1. 用代码创建优惠券

- 级别：基础
- 说明：优惠券创建后会保存为 WooCommerce coupon 数据。

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

### 2. 自动应用优惠券

- 级别：实用
- 说明：自动优惠券要避免重复应用。

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

### 3. 按产品分类限制优惠券

- 级别：实用
- 说明：woocommerce_coupon_is_valid 可自定义优惠券有效性。

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

### 4. 自定义优惠券错误信息

- 级别：实用
- 说明：错误提示清楚能减少客户困惑。

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

### 5. 购物车显示促销提示

- 级别：前台
- 说明：促销提示要和实际规则保持一致。

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

### 6. 禁止优惠券与特定支付方式共用

- 级别：进阶
- 说明：支付方式依赖 session，结账刷新时要反复测试。

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

## 15 客户、账户与自定义 Endpoint

### 1. 读取当前客户信息

- 级别：基础
- 说明：客户信息可能来自用户 meta 和订单账单信息。

```php
<?php
$user_id = get_current_user_id();

if ( $user_id ) {
    $customer = new WC_Customer( $user_id );

    echo esc_html( $customer->get_billing_email() );
    echo esc_html( $customer->get_billing_phone() );
}
```

### 2. 添加我的账户菜单项

- 级别：实用
- 说明：可以在我的账户中插入自定义功能入口。

```php
<?php
function mywoo_account_menu_items( $items ) {
    $new = array();

    foreach ( $items as $key => $label ) {
        $new[ $key ] = $label;

        if ( 'orders' === $key ) {
            $new['project-files'] = 'Project Files';
        }
    }

    return $new;
}
add_filter( 'woocommerce_account_menu_items', 'mywoo_account_menu_items' );
```

### 3. 注册我的账户 endpoint

- 级别：实用
- 说明：新增 endpoint 后需要刷新固定链接。

```php
<?php
function mywoo_add_account_endpoint() {
    add_rewrite_endpoint( 'project-files', EP_ROOT | EP_PAGES );
}
add_action( 'init', 'mywoo_add_account_endpoint' );
```

### 4. 输出 endpoint 内容

- 级别：实用
- 说明：hook 名包含 endpoint slug。

```php
<?php
function mywoo_project_files_endpoint_content() {
    echo '<h3>Project Files</h3>';
    echo '<p>Your downloadable project documents will appear here.</p>';
}
add_action( 'woocommerce_account_project-files_endpoint', 'mywoo_project_files_endpoint_content' );
```

### 5. 保存客户资料字段

- 级别：进阶
- 说明：客户输入必须 sanitize。

```php
<?php
function mywoo_save_account_extra_fields( $user_id ) {
    if ( isset( $_POST['company_type'] ) ) {
        update_user_meta(
            $user_id,
            'company_type',
            sanitize_text_field( wp_unslash( $_POST['company_type'] ) )
        );
    }
}
add_action( 'woocommerce_save_account_details', 'mywoo_save_account_extra_fields' );
```

### 6. 账户订单列表增加操作按钮

- 级别：实用
- 说明：可根据订单状态给客户提供后续操作。

```php
<?php
function mywoo_account_order_actions( $actions, $order ) {
    if ( $order->has_status( 'completed' ) ) {
        $actions['download-guide'] = array(
            'url'  => home_url( '/installation-guide/' ),
            'name' => 'Installation Guide',
        );
    }

    return $actions;
}
add_filter( 'woocommerce_my_account_my_orders_actions', 'mywoo_account_order_actions', 10, 2 );
```

## 16 库存、SKU 与低库存提醒

### 1. 读取库存信息

- 级别：基础
- 说明：库存状态和库存数量不是同一个概念。

```php
<?php
$product = wc_get_product( 123 );

if ( $product ) {
    echo esc_html( $product->get_sku() );
    echo esc_html( $product->get_stock_quantity() );
    echo esc_html( $product->get_stock_status() );
}
```

### 2. 更新库存数量

- 级别：基础
- 说明：库存更新建议通过产品对象完成。

```php
<?php
$product = wc_get_product( 123 );

if ( $product ) {
    $product->set_manage_stock( true );
    $product->set_stock_quantity( 50 );
    $product->set_stock_status( 'instock' );
    $product->save();
}
```

### 3. 根据 SKU 同步库存

- 级别：实用
- 说明：外部 ERP 同步时常按 SKU 匹配产品。

```php
<?php
function mywoo_update_stock_by_sku( $sku, $qty ) {
    $product_id = wc_get_product_id_by_sku( $sku );

    if ( ! $product_id ) {
        return false;
    }

    wc_update_product_stock( $product_id, absint( $qty ), 'set' );

    return true;
}
```

### 4. 监听低库存事件

- 级别：实用
- 说明：邮件提醒仍依赖 SMTP 送达。

```php
<?php
function mywoo_low_stock_alert( $product ) {
    if ( ! $product instanceof WC_Product ) {
        return;
    }

    wp_mail(
        'inventory@example.com',
        'Low stock: ' . $product->get_name(),
        'Current stock: ' . $product->get_stock_quantity()
    );
}
add_action( 'woocommerce_low_stock', 'mywoo_low_stock_alert' );
```

### 5. 下单后追加库存备注

- 级别：实用
- 说明：库存扣减后记录备注，便于排查。

```php
<?php
function mywoo_order_stock_note( $order_id ) {
    $order = wc_get_order( $order_id );

    foreach ( $order->get_items() as $item ) {
        $product = $item->get_product();

        if ( $product && $product->managing_stock() ) {
            $order->add_order_note(
                'Stock after order for ' . $product->get_name() . ': ' . $product->get_stock_quantity()
            );
        }
    }
}
add_action( 'woocommerce_reduce_order_stock', 'mywoo_order_stock_note' );
```

### 6. 禁止缺货产品购买

- 级别：实用
- 说明：是否允许缺货购买要结合业务规则。

```php
<?php
function mywoo_disable_purchase_for_backorder( $purchasable, $product ) {
    if ( $product->is_on_backorder() ) {
        return false;
    }

    return $purchasable;
}
add_filter( 'woocommerce_is_purchasable', 'mywoo_disable_purchase_for_backorder', 10, 2 );
```

## 17 REST API、Webhooks 与外部系统

### 1. 用 wp_remote_get 调用 WooCommerce REST API

- 级别：API
- 说明：密钥不要硬编码到公开仓库。

```php
<?php
$url = add_query_arg(
    array(
        'consumer_key'    => 'ck_xxx',
        'consumer_secret' => 'cs_xxx',
    ),
    home_url( '/wp-json/wc/v3/products' )
);

$response = wp_remote_get( $url );

if ( is_wp_error( $response ) ) {
    error_log( $response->get_error_message() );
} else {
    $body = json_decode( wp_remote_retrieve_body( $response ), true );
}
```

### 2. 创建产品 API 请求示例

- 级别：API
- 说明：真实系统建议使用 HTTPS 和安全存储 API Key。

```php
<?php
$response = wp_remote_post( home_url( '/wp-json/wc/v3/products' ), array(
    'headers' => array(
        'Authorization' => 'Basic ' . base64_encode( 'ck_xxx:cs_xxx' ),
        'Content-Type'  => 'application/json',
    ),
    'body' => wp_json_encode( array(
        'name'          => 'API Product',
        'type'          => 'simple',
        'regular_price' => '19.99',
    ) ),
) );
```

### 3. 注册自定义 REST route 给外部系统

- 级别：进阶
- 说明：接口必须有权限验证，不能公开写入库存。

```php
<?php
function mywoo_register_sync_route() {
    register_rest_route( 'mywoo/v1', '/stock-sync', array(
        'methods'             => 'POST',
        'callback'            => 'mywoo_stock_sync_callback',
        'permission_callback' => 'mywoo_stock_sync_permission',
    ) );
}
add_action( 'rest_api_init', 'mywoo_register_sync_route' );

function mywoo_stock_sync_permission( WP_REST_Request $request ) {
    return hash_equals( 'secret-token', $request->get_header( 'x-sync-token' ) );
}
```

### 4. REST 回调更新库存

- 级别：进阶
- 说明：返回 WP_Error 可以给 API 客户端明确状态码。

```php
<?php
function mywoo_stock_sync_callback( WP_REST_Request $request ) {
    $sku = sanitize_text_field( $request->get_param( 'sku' ) );
    $qty = absint( $request->get_param( 'qty' ) );

    $product_id = wc_get_product_id_by_sku( $sku );

    if ( ! $product_id ) {
        return new WP_Error( 'not_found', 'Product not found.', array( 'status' => 404 ) );
    }

    wc_update_product_stock( $product_id, $qty, 'set' );

    return rest_ensure_response( array( 'success' => true ) );
}
```

### 5. Webhook 接收端骨架

- 级别：Webhook
- 说明：Webhook 要做签名验证、幂等处理和日志记录。

```php
<?php
function mywoo_receive_webhook() {
    if ( ! isset( $_GET['mywoo_webhook'] ) ) {
        return;
    }

    $payload = file_get_contents( 'php://input' );
    $signature = isset( $_SERVER['HTTP_X_WC_WEBHOOK_SIGNATURE'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_WC_WEBHOOK_SIGNATURE'] ) ) : '';

    // TODO: 验证签名，解析 JSON，幂等处理。

    status_header( 200 );
    echo 'OK';
    exit;
}
add_action( 'init', 'mywoo_receive_webhook' );
```

### 6. 记录外部同步日志

- 级别：运维
- 说明：WooCommerce logger 可在状态日志中查看，适合同步和支付排查。

```php
<?php
$logger = wc_get_logger();

$logger->info(
    'Stock sync received for SKU DECK-001',
    array( 'source' => 'mywoo-stock-sync' )
);
```

## 18 Blocks、Store API 与现代结账

### 1. 检测页面是否包含 Checkout Block

- 级别：实用
- 说明：有些经典 checkout hooks 对 Checkout Block 不生效，需要实际测试。

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

### 2. 检测 Cart Block

- 级别：实用
- 说明：Cart Block 和经典购物车 shortcode 的前端结构不同。

```php
<?php
function mywoo_page_has_cart_block() {
    $post = get_post();

    return $post && has_block( 'woocommerce/cart', $post );
}
```

### 3. 针对 Blocks 页面加载资源

- 级别：性能
- 说明：现代结账更多需要前端扩展，不能只依赖 PHP 模板 hooks。

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

### 4. 读取 Store API Cart 示例

- 级别：API
- 说明：Store API 是 WooCommerce Blocks 使用的公开接口之一。

```js
fetch('/wp-json/wc/store/v1/cart')
  .then((response) => response.json())
  .then((cart) => {
    console.log(cart.items);
  });
```

### 5. PHP 中提示当前使用 Blocks

- 级别：后台
- 说明：给维护人员提示 Blocks 差异很有用。

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

### 6. 给 classic checkout 和 block checkout 分流

- 级别：实用
- 说明：经典结账和 Blocks 结账最好分开处理。

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

## 19 后台订单、报表与管理增强

### 1. 后台订单列表增加列

- 级别：后台
- 说明：HPOS 订单管理页可能使用 wc-orders screen，列 hook 要注意环境。

```php
<?php
function mywoo_shop_order_columns( $columns ) {
    $columns['sales_owner'] = 'Sales Owner';
    return $columns;
}
add_filter( 'manage_woocommerce_page_wc-orders_columns', 'mywoo_shop_order_columns' );
```

### 2. 输出订单自定义列内容

- 级别：后台
- 说明：HPOS 下优先使用 $order 对象读取 meta。

```php
<?php
function mywoo_shop_order_column_content( $column, $order ) {
    if ( 'sales_owner' === $column && $order instanceof WC_Order ) {
        echo esc_html( $order->get_meta( '_sales_owner' ) );
    }
}
add_action( 'manage_woocommerce_page_wc-orders_custom_column', 'mywoo_shop_order_column_content', 10, 2 );
```

### 3. 添加订单批量操作

- 级别：后台
- 说明：批量操作适合订单导出、标记、分配跟进人等。

```php
<?php
function mywoo_order_bulk_actions( $actions ) {
    $actions['mark_exported_to_erp'] = 'Mark exported to ERP';
    return $actions;
}
add_filter( 'bulk_actions-woocommerce_page_wc-orders', 'mywoo_order_bulk_actions' );
```

### 4. 处理订单批量操作

- 级别：后台
- 说明：批量操作必须考虑权限和数据量。

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

### 5. 使用 WooCommerce Logger

- 级别：运维
- 说明：WooCommerce > Status > Logs 可查看 source 对应日志。

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

### 6. 后台订单页添加提示框

- 级别：后台
- 说明：后台提示适合规范团队订单处理流程。

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

## 20 性能、安全、迁移与调试

### 1. HPOS 友好订单读取

- 级别：HPOS
- 说明：HPOS 下订单不应直接依赖 postmeta。

```php
<?php
// 推荐：CRUD API
$order = wc_get_order( 123 );
$email = $order ? $order->get_billing_email() : '';

// 不推荐：直接假设订单在 wp_posts/wp_postmeta 中。
// get_post_meta( 123, '_billing_email', true );
```

### 2. 检测 HPOS 状态

- 级别：HPOS
- 说明：只有写底层兼容逻辑时才需要检测，普通业务优先 CRUD。

```php
<?php
use Automattic\WooCommerce\Utilities\OrderUtil;

if ( class_exists( OrderUtil::class ) ) {
    $enabled = OrderUtil::custom_orders_table_usage_is_enabled();
    error_log( 'HPOS enabled: ' . ( $enabled ? 'yes' : 'no' ) );
}
```

### 3. WooCommerce 模板覆盖路径

- 级别：主题
- 说明：模板覆盖后要关注 WooCommerce 模板版本更新提示。

```text
your-theme/
└── woocommerce/
    ├── single-product.php
    ├── archive-product.php
    └── checkout/
        └── form-checkout.php
```

### 4. 检查模板覆盖版本提示

- 级别：维护
- 说明：模板覆盖是强定制手段，维护成本比 hooks 更高。

```php
<?php
// 后台路径：WooCommerce > Status > Templates
// 如果显示 outdated templates，需要对比插件模板新版本并更新主题覆盖文件。
```

### 5. Action Scheduler 注册异步任务

- 级别：进阶
- 说明：耗时任务不要阻塞结账流程，可交给 Action Scheduler。

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

### 6. WooCommerce 日志排查

- 级别：调试
- 说明：支付、同步、库存、邮件排查都建议写 source 明确的日志。

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

### 7. WP-CLI 常用维护命令

- 级别：运维
- 说明：真实执行前先确认环境、备份和权限。

```bash
wp plugin list
wp wc tool list
wp wc hpos status
wp wc hpos sync --batch-size=100
wp transient delete --all
```

### 8. 更新前代码维护清单

- 级别：维护
- 说明：电商网站更新必须以订单和支付安全为第一优先级。

```text
1. 备份数据库和 uploads
2. 记录 WooCommerce、主题、支付、配送插件版本
3. 在测试环境更新
4. 测试商店页、产品页、购物车、结账、支付、邮件、订单后台
5. 检查 WooCommerce Status、Logs、Templates
6. 检查 HPOS 兼容性和 Action Scheduler 队列
```
