# 15 客户、账户与自定义 Endpoint

整理客户数据、账户菜单、我的账户 endpoint、用户 meta 和订单列表扩展。

> 代码用于学习和研究。复制到正式网站前请先备份并在测试环境验证。

## 1. 读取当前客户信息

**级别：** 基础

**说明：** 客户信息可能来自用户 meta 和订单账单信息。

```php
<?php
$user_id = get_current_user_id();

if ( $user_id ) {
    $customer = new WC_Customer( $user_id );

    echo esc_html( $customer->get_billing_email() );
    echo esc_html( $customer->get_billing_phone() );
}
```

## 2. 添加我的账户菜单项

**级别：** 实用

**说明：** 可以在我的账户中插入自定义功能入口。

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

## 3. 注册我的账户 endpoint

**级别：** 实用

**说明：** 新增 endpoint 后需要刷新固定链接。

```php
<?php
function mywoo_add_account_endpoint() {
    add_rewrite_endpoint( 'project-files', EP_ROOT | EP_PAGES );
}
add_action( 'init', 'mywoo_add_account_endpoint' );
```

## 4. 输出 endpoint 内容

**级别：** 实用

**说明：** hook 名包含 endpoint slug。

```php
<?php
function mywoo_project_files_endpoint_content() {
    echo '<h3>Project Files</h3>';
    echo '<p>Your downloadable project documents will appear here.</p>';
}
add_action( 'woocommerce_account_project-files_endpoint', 'mywoo_project_files_endpoint_content' );
```

## 5. 保存客户资料字段

**级别：** 进阶

**说明：** 客户输入必须 sanitize。

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

## 6. 账户订单列表增加操作按钮

**级别：** 实用

**说明：** 可根据订单状态给客户提供后续操作。

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
