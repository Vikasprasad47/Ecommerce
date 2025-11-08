import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
    },
});

const sendEmailByNodeMailer = async ({ sendTo, subject, html }) => {
    if (!sendTo || !subject || !html) {
        return { success: false, error: "Missing required fields for sending email" };
    }

    try {
        const info = await transporter.sendMail({
            from: `"Quickoo" <${process.env.GMAIL_USER}>`,
            to: sendTo,
            subject,
            html,
        });

        return { success: true, data: info };
    } catch (error) {
        console.error("Nodemailer Error:", error);
        return { success: false, error: error.message };
    }
};

export default sendEmailByNodeMailer;
