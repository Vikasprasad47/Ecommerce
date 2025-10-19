// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, "Product name is required"],
//         trim: true,
//         maxlength: [120, "Product name cannot exceed 120 characters"],
//         minlength: [3, "Product name must be at least 3 characters"]
//     },
//     slug: {
//         type: String,
//         unique: true,
//         lowercase: true,
        
//     },
//     image: {
//         type: [String],
//         default: [],
//         validate: {
//             validator: images => images.length <= 10,
//             message: "Cannot upload more than 10 images"
//         }
//     },
//     category: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "category",
//         required: [true, "Product must belong to at least one category"]
//     }], 
//     subCategory: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "subCategory"
//     }],
//     brand: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Brand"
//     },
//     unit: {
//         type: String,
//         required: [true, "Product unit is required"],
//         enum: {
//             values: ["kg", "g", "l", "ml", "piece", "pack", "dozen", "box"],
//             message: "Please select valid unit"
//         }
//     },
//     stock: {
//         type: Number,
//         required: [true, "Stock quantity is required"],
//         min: [0, "Stock cannot be negative"],
//         default: 0
//     },
//     price: {
//         type: Number,
//         required: [true, "Product price is required"],
//         min: [0, "Price cannot be negative"]
//     },
//     discount: {
//         type: Number,
//         default: 0,
//         min: [0, "Discount cannot be negative"],
//         validate: {
//             validator: function(value) {
//                 return value <= this.price;
//             },
//             message: "Discount must be less than or equal to price"
//         }
//     },
//     description: {
//         type: String,
//         required: [true, "Product description is required"],
//         minlength: [20, "Description must be at least 20 characters"]
//     },
//     specifications: {
//         type: Map,
//         of: String
//     },
//     tags: [String],
//     publish: {
//         type: Boolean,
//         default: true
//     },
//     featured: {
//         type: Boolean,
//         default: false
//     },
//     ratings: {
//         average: {
//             type: Number,
//             default: 0,
//             min: 0,
//             max: 5
//         },
//         count: {
//             type: Number,
//             default: 0
//         }
//     },
//     shipping: {
//         weight: Number,
//         dimensions: {
//             length: Number,
//             width: Number,
//             height: Number
//         },
//         freeShipping: Boolean
//     },
//     variants: [{
//         color: String,
//         size: String,
//         sku: String,
//         price: Number,
//         stock: Number,
//         images: [String]
//     }],
//     meta: {
//         title: String,
//         description: String,
//         keywords: [String]
//     },
//     createdBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true
//     }
// }, {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
// });

// // Virtuals
// productSchema.virtual('discountedPrice').get(function() {
//     return this.price - this.discount;
// });

// productSchema.virtual('inStock').get(function() {
//     return this.stock > 0;
// });

// // Indexes
// productSchema.index({ name: "text", description: "text", tags: "text" });
// productSchema.index({ price: 1, discount: 1 });

// // Pre-save middleware
// productSchema.pre('save', function(next) {
//     if (this.isModified('name')) {
//         this.slug = this.name.toLowerCase()
//             .replace(/\s+/g, '-')
//             .replace(/[^\w-]+/g, '');
//     }
//     next();
// });

// const ProductModel = mongoose.model('product', productSchema);
// export default ProductModel;

import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    maxlength: [120, "Product name cannot exceed 120 characters"],
    minlength: [3, "Product name must be at least 3 characters"]
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  image: {
    type: [String],
    default: [],
    validate: {
      validator: images => images.length <= 10,
      message: "Cannot upload more than 10 images"
    }
  },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: [true, "Product must belong to at least one category"]
  }],
  subCategory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "subCategory"
  }],
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand"
  },
  unit: {
    type: String,
    required: [true, "Product unit is required"],
    enum: {
      values: ["kg", "g", "l", "ml", "piece", "pack", "dozen", "box"],
      message: "Please select valid unit"
    }
  },
  stock: {
    type: Number,
    required: [true, "Stock quantity is required"],
    min: [0, "Stock cannot be negative"],
    default: 0
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price cannot be negative"]
  },

  // ✅ Updated Discount Logic
  discountType: {
    type: String,
    enum: {
      values: ["flat", "percent"],
      message: "Discount type must be either 'flat' or 'percent'"
    },
    default: "percent"
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, "Discount cannot be negative"],
    validate: {
      validator: function (value) {
        if (this.discountType === "percent") {
          return value <= 100;
        }
        return value <= this.price;
      },
      message: function (props) {
        return this.discountType === "percent"
          ? "Percentage discount cannot exceed 100%"
          : "Flat discount must be less than or equal to price";
      }
    }
  },

  description: {
    type: String,
    required: [true, "Product description is required"],
    minlength: [20, "Description must be at least 20 characters"]
  },
  specifications: {
    type: Map,
    of: String
  },
  tags: [String],
  publish: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: Boolean
  },
  variants: [{
    color: String,
    size: String,
    sku: String,
    price: Number,
    stock: Number,
    images: [String]
  }],
  meta: {
    title: String,
    description: String,
    keywords: [String]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  }
}, {
  timestamps: true, 
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true }
});

// ✅ Virtuals
productSchema.virtual('discountedPrice').get(function () {
  if (!this.price) return 0;
  
  if (this.discountType === "percent") {
    return Math.floor(this.price - (this.price * this.discount / 100));
  }
  return Math.floor(this.price - this.discount);
});

productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

// ✅ Indexes
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ price: 1, discount: 1 });

// ✅ Pre-save middleware
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  }
  next();
});

const ProductModel = mongoose.model('product', productSchema);
export default ProductModel;
