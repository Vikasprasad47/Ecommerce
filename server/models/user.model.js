import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide Name: "]
    },
    email: {
        type: String,
        required: [true, "Provide email: "],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Provide Password: "]
    },
    mobile: {
        type: Number,
        default: null
    },
    avatar: {
        type: String,
        default: ""
    },
    refresh_token: {
        type: String,
        default: ""
    },
    verify_email: {
        type:Boolean,
        default: false
    },
    last_login_date: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },
    address_details: [
        {
            type: mongoose.Schema.ObjectId,
            ref : "address"
        }
    ],
    shopping_cart: [
        {
            type: mongoose.Schema.ObjectId,
            ref : "cartProduct"
        }
    ],
    orderHistory: [
        {
            type: mongoose.Schema.ObjectId,
            ref : "order"
        }
    ],
    forgot_password_otp: {
        type: String,
        default: null
    },
    forgot_password_expiry: {
        type: Date,
        default: null
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER",  "DELIVERY-AGENT"],
        default: "USER"
    },
    //new
    dob: {
        type: Date,
        default: null
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other", "Prefer not to say"],
        default: "Prefer not to say"
    },
    wishlist: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "product"
        }
    ],
    notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true }
    },
    superCoins: {
        balance: {
            type: Number,
            default: 5, // Start new users with 5 superCoins
            min: 0
        },
        history: [
            {
                type: {
                    type: String,
                    enum: ["EARNED", "SPENT", "ADJUSTED"],
                    required: true
                },
                amount: {
                    type: Number,
                    required: true
                },
                reason: {
                    type: String,
                    default: ""
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    reviews: [
    {
        type: mongoose.Schema.ObjectId,
        ref: "review"
    }
]

},{
    timestamps: true
})

const UserModel = mongoose.model('user', userSchema);
export default UserModel