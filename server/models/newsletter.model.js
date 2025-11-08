import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const NewsletterModel = mongoose.model("newsletter", newsletterSchema);

export default NewsletterModel;
