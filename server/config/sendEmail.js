import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.RESEND_API) {
    throw new Error("❌ RESEND_API key is missing in .env file");
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html }) => {
    if (!sendTo || !subject || !html) {
        return { success: false, error: "Missing required fields for sending email" };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'Quickoo <onboarding@resend.dev>',
            to: sendTo,
            subject,
            html,
        });

        if (error) {
            console.error("Resend API Error:", error);
            return { success: false, error };
        }
 
        return { success: true, data };
    } catch (error) {
        console.error("sendEmail Exception:", error);
        return { success: false, error: error.message };
    }
};

export default sendEmail;
