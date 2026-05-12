# 03 产品 CRUD 与查询

整理 wc_get_product、WC_Product_Simple、WC_Product_Variable、产品查询和批量更新场景。

> 代码用于学习和研究。复制到正式网站前请先备份并在测试环境验证。

## 1. 读取产品对象和常用数据

**级别：** 基础

**说明：** 优先使用 WooCommerce CRUD 方法，而不是直接 get_post_meta。

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

## 2. 创建简单产品

**级别：** 实用

**说明：** 创建或更新产品时，最后必须 save()。

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

## 3. 按 SKU 查找产品 ID

**级别：** 基础

**说明：** SKU 应保持唯一，便于同步 ERP、库存和导入数据。

```php
<?php
$sku = 'DECK-SAMPLE-001';

$product_id = wc_get_product_id_by_sku( $sku );

if ( $product_id ) {
    $product = wc_get_product( $product_id );
}
```

## 4. 更新产品价格和库存

**级别：** 实用

**说明：** 价格和库存都建议通过 CRUD 方法更新。

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

## 5. 使用 WC_Product_Query 查询产品

**级别：** 进阶

**说明：** WC_Product_Query 比直接 WP_Query 更贴近 WooCommerce 产品数据。

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

## 6. 批量给指定分类产品加标签

**级别：** 实用

**说明：** 批量操作前建议先在测试环境跑，并限制范围。

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
