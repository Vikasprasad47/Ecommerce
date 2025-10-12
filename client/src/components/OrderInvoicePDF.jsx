import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';

const OrderInvoicePDF = {
  async generate(order, renderFullAddress) {
    if (!order) return;

    const toastId = toast.loading('Generating invoice...');
    
    try {
      const invoiceDiv = document.createElement('div');
      invoiceDiv.style.position = 'absolute';
      invoiceDiv.style.left = '-9999px';
      invoiceDiv.style.width = '800px';
      invoiceDiv.style.padding = '0';
      invoiceDiv.style.backgroundColor = 'white';
      invoiceDiv.style.fontFamily = "'Helvetica Neue', Arial, sans-serif";
      document.body.appendChild(invoiceDiv);

      const qrData = JSON.stringify({
        orderId: order.orderId,
        _id: order._id,
        verified: true
      });

      const subtotal = order.items?.reduce(
        (sum, item) => sum + ((item.pricePerUnit || 0) * (item.quantity || 1)), 
        0
      ) || 0;
      const shipping = order.totalAmt - subtotal;
      const total = order.totalAmt;

      const qrSvg = await QRCode.toString(qrData, {
        type: 'svg',
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 150,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });

      invoiceDiv.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto; padding: 30px; box-sizing: border-box;">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 1px solid #eaeaea; padding-bottom: 35px;">
            <div>
              <h1 style="font-size: 24px; font-weight: 700; color: #2d3748; margin: 0 0 5px 0;">INVOICE</h1>
              <p style="color: #718096; font-size: 14px; margin: 0;">Order #${order.orderId}</p>
              <p style="color: #718096; font-size: 12px; margin: 5px 0 0 0;">
                Date: ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div style="text-align: right;">
              <div style="width: 150px; height: 150px;">
                ${qrSvg}
                <p style="font-size: 10px; color: #718096; text-align: center; margin-top: 5px;">SCAN TO VERIFY</p>
              </div>
            </div>
          </div>

          <!-- Company and Customer Info -->
          <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
            <div style="flex: 1;">
              <h2 style="font-size: 16px; font-weight: 600; margin-bottom: 10px; color: #2d3748;">From</h2>
              <p style="font-weight: 600; margin: 0 0 5px 0;">Quickoo.co</p>
              <p style="color: #718096; font-size: 12px; margin: 0 0 3px 0;">Warje, Malwadi Pune-58</p>
              <p style="color: #718096; font-size: 12px; margin: 0 0 3px 0;">Pune, Maharashtra 411058</p>
              <p style="color: #718096; font-size: 12px; margin: 0 0 3px 0;">India</p>
              <p style="color: #718096; font-size: 12px; margin: 0;">GSTIN: 22AAAAA0000A1Z5</p>
            </div>
            <div style="flex: 1; text-align: right;">
              <h2 style="font-size: 16px; font-weight: 600; margin-bottom: 10px; color: #2d3748;">Bill To</h2>
              <p style="font-weight: 600; margin: 0 0 5px 0;">${order.user?.name || order.userId?.name || 'Customer'}</p>
              <p style="color: #718096; font-size: 12px; margin: 0 0 3px 0;">${order.user?.email || ''}</p>
              <p style="color: #718096; font-size: 12px; margin: 0;">${renderFullAddress(order.delivery_address)}</p>
            </div>
          </div>

          <!-- Order Items Table -->
          <div style="margin-bottom: 30px; overflow: hidden; border-radius: 8px; border: 1px solid #eaeaea;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f7fafc; border-bottom: 2px solid #e2e8f0;">
                  <th style="padding: 12px 15px; text-align: left; font-size: 14px; color: #718096; font-weight: 600;">Item</th>
                  <th style="padding: 12px 15px; text-align: right; font-size: 14px; color: #718096; font-weight: 600;">Price</th>
                  <th style="padding: 12px 15px; text-align: center; font-size: 14px; color: #718096; font-weight: 600;">Qty</th>
                  <th style="padding: 12px 15px; text-align: right; font-size: 14px; color: #718096; font-weight: 600;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${order.items?.map(item => `
                  <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 12px 15px; text-align: left; font-size: 13px;">
                      <p style="font-weight: 600; margin: 0 0 3px 0;">${item.product_details?.name || 'Product'}</p>
                      <p style="color: #718096; font-size: 11px; margin: 0;">SKU: ${item.product_details?._id || 'N/A'}</p>
                    </td>
                    <td style="padding: 12px 15px; text-align: right; font-size: 13px;">₹${(item.pricePerUnit || 0).toFixed(2)}</td>
                    <td style="padding: 12px 15px; text-align: center; font-size: 13px;">${item.quantity || 1}</td>
                    <td style="padding: 12px 15px; text-align: right; font-size: 13px; font-weight: 600;">
                      ₹${((item.pricePerUnit || 0) * (item.quantity || 1)).toFixed(2)}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Totals Section -->
          <div style="display: flex; justify-content: flex-end;">
            <div style="width: 300px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #718096; font-size: 13px;">Subtotal</span>
                <span style="font-weight: 600; font-size: 13px;">${DisplayPriceInRupees(subtotal.toFixed(2))}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #718096; font-size: 13px;">Tax</span>
                <span style="font-weight: 600; font-size: 13px;">₹0.00</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #718096; font-size: 13px;">Shipping</span>
                <span style="font-weight: 600; font-size: 13px;">${DisplayPriceInRupees(shipping.toFixed(2))}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Total</span>
                <span style="font-weight: 700; font-size: 15px; color: #2d3748;">${DisplayPriceInRupees(total.toFixed(2))}</span>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea;">
            <p style="font-weight: 600; margin-bottom: 5px; font-size: 14px;">Payment Method</p>
            <p style="color: #718096; font-size: 13px; margin: 0;">
              ${order.payment_status === 'CASH ON DELIVERY' 
                ? 'Cash on Delivery' 
                : order.payment_status === 'paid' 
                  ? 'Paid Online' 
                  : 'Pending Payment'}
            </p>
          </div>

          <!-- Footer -->
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; text-align: center;">
            <p style="color: #718096; font-size: 11px; margin-bottom: 5px;">Thank you for shopping with us!</p>
            <p style="color: #718096; font-size: 11px; margin: 0;">
              For any questions regarding this invoice, please contact support@quickoo-co.com
            </p>
          </div>
        </div>
      `;
      
      const canvas = await html2canvas(invoiceDiv, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Invoice_${order.orderId}.pdf`);

      toast.success('Invoice downloaded!', { id: toastId });
    } catch (error) {
      console.error('Invoice generation error:', error);
      toast.error(error.message || 'Failed to generate invoice', { id: toastId });
    } finally {
      const elements = document.querySelectorAll('div[style*="left: -9999px"], canvas');
      elements.forEach(el => el.parentNode?.removeChild(el));
    }
  }
};

export default OrderInvoicePDF;