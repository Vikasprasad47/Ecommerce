import NewsletterModel from "../models/newsletter.model.js";
import UserModel from "../models/user.model.js";
import sendEmailByNodeMailer from "../config/sendEmailByNodeMailer.js";
import newsletterWelcomeTemplate from "../utils/newsletterWelcomeTemplate.js";

export const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if(!email) return res.status(400).json({ success:false, message:"Email required" });

        // check if already subscribed
        const exists = await NewsletterModel.findOne({ email });
        if(exists){
            return res.status(200).json({ success:true, message:"Already Subscribed" })
        }

        // create subscription entry
        await NewsletterModel.create({ email });

        // update user if account exists
        await UserModel.findOneAndUpdate({ email }, { isSubscribed:true })

        // send welcome email
        const html = newsletterWelcomeTemplate(email)

        await sendEmailByNodeMailer({
            sendTo: email,
            subject: "Welcome to Quickoo Newsletter 🎉",
            html
        });

        res.status(201).json({
            success:true,
            message:"Subscribed successfully! Confirmation mail sent."
        });
    } catch (error) {
        return res.status(500).json({ success:false, message:error.message });
    }
}
