import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
        unique:true
    },
    businessName:{
        type:String,
        required:true
    },
    gstNumber:{
        type:String,
        default:""
    },
    panNumber:{
        type:String,
        default:""
    },
    kycStatus:{
        type:String,
        enum:["NOT_SUBMITTED","PENDING","VERIFIED","REJECTED"],
        default:"NOT_SUBMITTED"
    },
    documents:{
        gstFile:String,
        panFile:String,
        addressProof:String
    },
    pickupAddress:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"address",
        default:null
    },
    bank:{
        accountHolder:String,
        accountNumber:String,
        ifsc:String,
        upi:String
    },
    rating:{
        type:Number,
        default:0
    },
    totalProducts:{
        type:Number,
        default:0
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sellerSubscription",
        default: null
    },
    subscription_expiry: {
        type: Date,
        default: null
    }

},{
    timestamps:true
})

const SellerModel = mongoose.model("seller",sellerSchema)
export default SellerModel
