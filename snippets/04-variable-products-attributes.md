# 04 可变产品、属性与变体

整理产品属性、全局属性、变体创建、变体价格库存和前台输出。

> 代码用于学习和研究。复制到正式网站前请先备份并在测试环境验证。

## 1. 获取产品属性

**级别：** 基础

**说明：** 属性可能是全局 taxonomy，也可能是产品自定义属性。

```php
<?php
$product = wc_get_product( 123 );

if ( $product ) {
    foreach ( $product->get_attributes() as $attribute ) {
        echo esc_html( wc_attribute_label( $attribute->get_name() ) );
    }
}
```

## 2. 创建可变产品基础对象

**级别：** 进阶

**说明：** 可变产品本身不直接售卖，通常通过 variation 售卖。

```php
<?php
$product = new WC_Product_Variable();
$product->set_name( 'Composite Decking Board' );
$product->set_status( 'publish' );
$product_id = $product->save();
```

## 3. 给产品设置自定义属性

**级别：** 进阶

**说明：** set_variation(true) 表示该属性可用于变体。

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

## 4. 创建变体

**级别：** 进阶

**说明：** 变体属性 key/value 要和父产品属性对应。

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

## 5. 读取可变产品的可用变体

**级别：** 基础

**说明：** get_available_variations 返回数组，适合前台展示。

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

## 6. 变体选择后追加自定义数据

**级别：** 实用

**说明：** 可把变体额外数据传给前端 variation JS 使用。

```php
<?php
function mywoo_available_variation_extra_data( $data, $product, $variation ) {
    $data['custom_lead_time'] = get_post_meta( $variation->get_id(), '_lead_time', true );

    return $data;
}
add_filter( 'woocommerce_available_variation', 'mywoo_available_variation_extra_data', 10, 3 );
```
