import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    image:{
        type:String,
        default: ""
    },
    category: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "category"
        }
    ]
},{
    timestamps: true
})

subCategorySchema.index({ name: "text" }); // ✅ ADD THIS LINE

const SubCategoryModel = mongoose.model('subCategory', subCategorySchema)

export default SubCategoryModel