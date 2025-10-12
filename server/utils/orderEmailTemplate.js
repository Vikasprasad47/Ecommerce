// utils/orderEmailTemplate.js
const orderEmailTemplate = (name, orderData) => {
    const { orderId, items, totalAmt, payment_status, delivery_address, estimated_delivery_date } = orderData;
    
    // Format currency using your existing function style
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(price);
    };

    // Format items list with proper pricing
    const itemsList = items.map(item => {
        const itemTotal = item.quantity * item.pricePerUnit;
        return `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #ecf0f1; text-align: left;">
                <strong style="color: #2c3e50;">${item.product_details.name}</strong>
                <br>
                <span style="color: #7f8c8d; font-size: 13px;">
                    Qty: ${item.quantity} × ${formatPrice(item.pricePerUnit)}
                </span>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #ecf0f1; text-align: right; color: #2c3e50; font-weight: 600;">
                ${formatPrice(itemTotal)}
            </td>
        </tr>
    `}).join('');

    // Calculate subtotal using your consistent approach
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0);

    return `
    <div style="font-family: 'Arial', sans-serif; max-width: full; margin: 20px auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); background-color: #ffffff;">
        <!-- Header Section -->
        <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #2c3e50; font-size: 28px; margin-bottom: 5px;">🎉 Order Confirmed!</h1>
            <p style="color: #7f8c8d; font-size: 16px; margin-top: 0;">Hello, ${name}</p>
        </div>

        <!-- Order Summary -->
        <div style="margin-bottom: 25px;">
            <p style="color: #34495e; font-size: 16px; line-height: 1.6;">
                Thank you for your order! We're getting it ready for you and will notify you when it ships.
            </p>
            
            <!-- Order Details Box -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e0e0e0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #7f8c8d; width: 120px;">Order ID:</td>
                        <td style="padding: 8px 0; color: #2c3e50; font-weight: 600;">${orderId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #7f8c8d;">Payment Status:</td>
                        <td style="padding: 8px 0; color: #27ae60; font-weight: 600;">${payment_status}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #7f8c8d;">Total Amount:</td>
                        <td style="padding: 8px 0; color: #2c3e50; font-weight: 600;">${formatPrice(totalAmt)}</td>
                    </tr>
                    ${estimated_delivery_date ? `
                    <tr>
                        <td style="padding: 8px 0; color: #7f8c8d;">Est. Delivery:</td>
                        <td style="padding: 8px 0; color: #2c3e50; font-weight: 600;">
                            ${new Date(estimated_delivery_date).toLocaleDateString('en-IN', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </td>
                    </tr>
                    ` : ''}
                </table>
            </div>

            <!-- Delivery Address -->
            ${delivery_address ? `
            <div style="margin: 20px 0;">
                <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 10px;">📦 Delivery Address</h3>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #3498db;">
                    <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 10px;">To, ${name}</h3>
                    <p style="margin: 5px 0; color: #2c3e50; font-weight: 600;">${delivery_address.address_line}</p>
                    ${delivery_address.landMark ? `<p style="margin: 5px 0; color: #7f8c8d;">${delivery_address.landMark}</p>` : ''}
                    <p style="margin: 5px 0; color: #7f8c8d;">
                        ${delivery_address.city}, ${delivery_address.state} - ${delivery_address.pincode}
                    </p>
                    <p style="margin: 5px 0; color: #7f8c8d;">${delivery_address.country}</p>
                    ${delivery_address.mobile ? `<p style="margin: 5px 0; color: #7f8c8d;">📞 ${delivery_address.mobile}</p>` : ''}
                    <p style="margin: 5px 0; color: #7f8c8d; font-size: 12px;">
                        Type: ${delivery_address.address_type || 'Home'}
                    </p>
                </div>
            </div>
            ` : '<p style="color: #e74c3c; font-style: italic; text-align: center; padding: 20px; background: #fdf2f2; border-radius: 6px;">Delivery address not available</p>'}

            <!-- Order Items -->
            <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 15px;">🛍️ Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; background: #f8f9fa; border-radius: 8px; overflow: hidden;">
                <thead>
                    <tr style="background: #34495e;">
                        <th style="padding: 12px; text-align: left; color: white; font-weight: 600;">Product</th>
                        <th style="padding: 12px; text-align: right; color: white; font-weight: 600;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsList}
                </tbody>
                <tfoot>
                    <tr>
                        <td style="padding: 12px; text-align: right; color: #2c3e50; font-weight: 600; border-top: 2px solid #34495e;">Total:</td>
                        <td style="padding: 12px; text-align: right; color: #2c3e50; font-weight: 600; border-top: 2px solid #34495e;">
                            ${formatPrice(totalAmt)}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <!-- Next Steps -->
        <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="color: #2d5016; font-size: 14px; margin: 0;">
                <strong>📱 What's Next?</strong><br>
                You'll receive another email when your order ships with tracking information.
            </p>
        </div>

        <!-- Footer Section -->
        <div style="border-top: 1px solid #ecf0f1; padding-top: 20px;">
            <p style="color: #7f8c8d; font-size: 14px; line-height: 1.5;">
                You can track your order status anytime from your account dashboard.
            </p>
            <p style="color: #2c3e50; font-size: 15px; margin-top: 20px;">
                Happy Shopping!<br>
                <strong style="color: #3498db;">The Quickoo Team</strong>
            </p>
            
            <!-- Company Info -->
            <div style="margin-top: 30px; font-size: 12px; color: #95a5a6; text-align: center;">
                <p>© ${new Date().getFullYear()} Quickoo. All rights reserved.</p>
                <p style="margin: 5px 0;">
                    Need help? <a href="mailto:support@quickoo.com" style="color: #3498db; text-decoration: none;">Contact Support</a>
                </p>
            </div>
        </div>
    </div>
    `;
}

export default orderEmailTemplate;