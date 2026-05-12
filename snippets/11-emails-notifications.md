# 11 邮件通知与模板

整理订单邮件内容、邮件收件人、主题、标题、附件、HTML 邮件和自定义邮件触发。

> 代码用于学习和研究。复制到正式网站前请先备份并在测试环境验证。

## 1. 订单邮件表格后添加内容

**级别：** 基础

**说明：** 适合给客户邮件补充说明。

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

## 2. 修改新订单管理员收件人

**级别：** 实用

**说明：** 多个收件人用英文逗号分隔。

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

## 3. 根据订单地区增加收件人

**级别：** 实用

**说明：** 按地区分配订单跟进很常见。

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

## 4. 修改邮件主题

**级别：** 实用

**说明：** 邮件标题清晰有助于销售快速识别订单来源。

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

## 5. 给邮件添加附件

**级别：** 进阶

**说明：** 附件过大会影响邮件送达，建议谨慎使用。

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

## 6. 订单完成时发送内部提醒

**级别：** 实用

**说明：** 内部自动邮件也需要 SMTP 和日志监控。

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
