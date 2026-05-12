# 08 结账字段、验证与订单 Meta

整理经典结账字段修改、自定义字段、验证、保存订单、后台显示和 Blocks 注意事项。

> 代码用于学习和研究。复制到正式网站前请先备份并在测试环境验证。

## 1. 修改结账字段 label 和 required

**级别：** 基础

**说明：** 经典结账字段可通过 woocommerce_checkout_fields 过滤。

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

## 2. 添加自定义结账字段

**级别：** 实用

**说明：** woocommerce_form_field 可生成 WooCommerce 风格字段。

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

## 3. 验证自定义字段

**级别：** 基础

**说明：** 验证失败用 wc_add_notice，结账会阻止提交。

```php
<?php
function mywoo_validate_project_type() {
    if ( empty( $_POST['project_type'] ) ) {
        wc_add_notice( 'Please select a project type.', 'error' );
    }
}
add_action( 'woocommerce_checkout_process', 'mywoo_validate_project_type' );
```

## 4. 保存字段到订单

**级别：** 重要

**说明：** 保存订单 meta 推荐使用订单对象，兼容 HPOS。

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

## 5. 后台订单页显示字段

**级别：** 实用

**说明：** 后台显示时不要直接 get_post_meta 订单 ID，优先使用 $order->get_meta。

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

## 6. 根据字段内容修改订单备注

**级别：** 进阶

**说明：** 订单备注适合保存内部处理提示。

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
