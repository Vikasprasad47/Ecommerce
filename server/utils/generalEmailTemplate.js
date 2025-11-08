// utils/generalEmailTemplate.js

const generalEmailTemplate = (name, subject, message) => {
  return `
  <div style="
    font-family: 'Segoe UI', Arial, sans-serif;
    max-width: 650px;
    margin: 30px auto;
    padding: 30px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    background-color: #ffffff;
  ">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 25px;">
      <h1 style="color: #2c3e50; font-size: 26px; margin: 0;">${subject}</h1>
      <p style="color: #6b7280; font-size: 15px; margin-top: 6px;">Hello, ${name}</p>
    </div>

    <!-- Message Content -->
    <div style="margin: 20px 0;">
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        ${message}
      </p>
    </div>

    <!-- Highlight Box -->
    <div style="
      background: #fff8eb;
      padding: 18px;
      border-radius: 8px;
      border-left: 5px solid #f59e0b;
      margin: 25px 0;
      font-size: 15px;
      color: #92400e;
      line-height: 1.6;
    ">
      <strong>📢 Note:</strong> This is an automated message from the Quickoo Admin panel.
      Please do not reply directly to this email.
    </div>

    <!-- Footer -->
    <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 12px;">
        For any questions or concerns, feel free to reach out to our support team.
      </p>
      <p style="color: #2c3e50; font-size: 15px; margin-top: 10px;">
        Best regards,<br />
        <strong style="color: #f59e0b;">The Quickoo Team</strong>
      </p>

      <div style="margin-top: 25px; font-size: 12px; color: #9ca3af;">
        <p>© ${new Date().getFullYear()} Quickoo. All rights reserved.</p>
        <p>
          Need help? <a href="mailto:support@quickoo.com" style="color: #f59e0b; text-decoration: none;">Contact Support</a>
        </p>
      </div>
    </div>
  </div>
  `;
};

export default generalEmailTemplate;
