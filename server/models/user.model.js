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
    mobile_verified: { type: Boolean, default: false },
    mobile_otp_hash: { type: String, default: null },
    mobile_otp_expiry: { type: Date, default: null },
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, 0] },
        address: { type: String, default: "" }
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
    isSubscribed:{
        type:Boolean,
        default:false
    },
        two_factor_enabled:{
        type:Boolean,
        default:false
    },
    Subscription:{
        type:String,
        enum:["Bronze","Silver","Gold","Platinum"],
        default:"Bronze"
    },
    referral_code:{
        type:String,
        default:""
    },
    referred_by:{
        type:String,
        default:""
    },
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
        enum: ["ADMIN", "USER",  "DELIVERY-AGENT", "SELLER"],
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
    device_info:[{
        device:String,
        os:String,
        ip:String,
        last_active:Date
    }],
    sellerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"seller",
        default:null
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
userSchema.index({ location: "2dsphere" });

const UserModel = mongoose.model('user', userSchema);
export default UserModel