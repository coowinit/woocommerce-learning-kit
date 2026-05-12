# 12 配送方式、区域与运费

整理配送包裹、区域、运费规则、自定义配送方式和按条件隐藏配送方式。

> 代码用于学习和研究。复制到正式网站前请先备份并在测试环境验证。

## 1. 按购物车金额隐藏固定运费

**级别：** 实用

**说明：** 当免邮可用时隐藏固定运费，是常见需求。

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

## 2. 根据州隐藏配送方式

**级别：** 实用

**说明：** 配送条件要测试不同地址。

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

## 3. 给结账页添加配送说明

**级别：** 前台

**说明：** 适合展示交付说明、偏远地区提示等。

```php
<?php
function mywoo_shipping_notice_checkout() {
    echo '<p class="shipping-note">Delivery times vary by region. Our team will confirm after order review.</p>';
}
add_action( 'woocommerce_review_order_before_shipping', 'mywoo_shipping_notice_checkout' );
```

## 4. 自定义配送方式骨架

**级别：** 进阶

**说明：** 这是骨架，真实项目需要加入设置项、区域、重量体积等规则。

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

## 5. 把自定义配送方式加入列表

**级别：** 进阶

**说明：** 类注册和 methods filter 要配合使用。

```php
<?php
function mywoo_add_custom_shipping_method( $methods ) {
    $methods['mywoo_custom_shipping'] = 'MyWoo_Custom_Shipping_Method';
    return $methods;
}
add_filter( 'woocommerce_shipping_methods', 'mywoo_add_custom_shipping_method' );
```

## 6. 按产品分类增加特殊配送费用

**级别：** 实用

**说明：** 这属于购物车费用，不是配送 rate，但可用于处理特殊搬运费。

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
