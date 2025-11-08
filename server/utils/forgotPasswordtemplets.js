const forgotPasswordTemplate = (name, otp) => {
    return `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 20px auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); background-color: #ffffff; max-width: 67rem;">
        <!-- Header Section -->
        <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #2c3e50; font-size: 28px; margin-bottom: 5px;">Password Reset Request</h1>
            <p style="color: #7f8c8d; font-size: 16px; margin-top: 0;">Hello, ${name}</p>
        </div>

        <!-- Main Content -->
        <div style="margin-bottom: 25px;">
            <p style="color: #34495e; font-size: 16px; line-height: 1.6;">
                We received a request to reset the password associated with your Quickoo account. 
                To complete the password reset process, please use the One-Time Password (OTP) provided below.
            </p>
            
            <!-- OTP Display Box -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; border: 1px dashed #d1d5db;">
                <p style="font-size: 14px; color: #7f8c8d; margin-bottom: 10px;">Your verification code:</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 2px; color: #2c3e50; margin: 15px 0;">
                    ${otp}
                </div>
                <p style="font-size: 13px; color: #e74c3c; font-weight: 500;">
                    ⚠️ This code will expire in <strong>60 minutes</strong>. Please do not share it with anyone.
                </p>
            </div>

            <p style="color: #34495e; font-size: 16px; line-height: 1.6;">
                If you didn't request this password reset, please ignore this email or contact our support team 
                immediately if you suspect any unauthorized access to your account.
            </p>
        </div>

        <!-- Footer Section -->
        <div style="border-top: 1px solid #ecf0f1; padding-top: 20px;">
            <p style="color: #7f8c8d; font-size: 14px; line-height: 1.5;">
                For security reasons, Quickoo support staff will never ask you for your password or 
                verification codes. Always verify the authenticity of requests.
            </p>
            <p style="color: #2c3e50; font-size: 15px; margin-top: 20px;">
                Best regards,<br>
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

export default forgotPasswordTemplate;