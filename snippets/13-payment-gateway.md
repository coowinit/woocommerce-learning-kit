# 13 支付网关与回调

整理自定义支付网关骨架、process_payment、订单状态、回调验证和日志。

> 代码用于学习和研究。复制到正式网站前请先备份并在测试环境验证。

## 1. 注册自定义支付网关类

**级别：** 进阶

**说明：** 支付网关需要继承 WC_Payment_Gateway。

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

## 2. 支付网关设置字段

**级别：** 进阶

**说明：** 这段方法写在 gateway class 内部。

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

## 3. 处理付款 process_payment

**级别：** 进阶

**说明：** 离线支付通常设为 on-hold；在线支付成功后一般 payment_complete。

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

## 4. 把网关加入 WooCommerce

**级别：** 进阶

**说明：** 类名需要和自定义 gateway class 一致。

```php
<?php
function mywoo_add_invoice_gateway( $gateways ) {
    $gateways[] = 'MyWoo_Invoice_Gateway';
    return $gateways;
}
add_filter( 'woocommerce_payment_gateways', 'mywoo_add_invoice_gateway' );
```

## 5. 付款成功时完成订单

**级别：** 支付

**说明：** 真实网关回调必须验证签名，不能只相信请求参数。

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

## 6. 支付回调 webhook 骨架

**级别：** 安全

**说明：** 支付 webhook 必须验证签名、金额、订单号和幂等处理。

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
