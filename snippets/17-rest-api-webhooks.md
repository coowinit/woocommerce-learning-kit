# 17 REST API、Webhooks 与外部系统

整理 WooCommerce REST API 读取、写入、Webhook、签名和外部同步场景。

> 代码用于学习和研究。复制到正式网站前请先备份并在测试环境验证。

## 1. 用 wp_remote_get 调用 WooCommerce REST API

**级别：** API

**说明：** 密钥不要硬编码到公开仓库。

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

## 2. 创建产品 API 请求示例

**级别：** API

**说明：** 真实系统建议使用 HTTPS 和安全存储 API Key。

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

## 3. 注册自定义 REST route 给外部系统

**级别：** 进阶

**说明：** 接口必须有权限验证，不能公开写入库存。

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

## 4. REST 回调更新库存

**级别：** 进阶

**说明：** 返回 WP_Error 可以给 API 客户端明确状态码。

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

## 5. Webhook 接收端骨架

**级别：** Webhook

**说明：** Webhook 要做签名验证、幂等处理和日志记录。

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

## 6. 记录外部同步日志

**级别：** 运维

**说明：** WooCommerce logger 可在状态日志中查看，适合同步和支付排查。

```php
<?php
$logger = wc_get_logger();

$logger->info(
    'Stock sync received for SKU DECK-001',
    array( 'source' => 'mywoo-stock-sync' )
);
```
