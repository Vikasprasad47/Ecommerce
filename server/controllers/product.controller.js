import ProductModel from '../models/product.model.js'


export const createProductController = async (req, res) => {
    try {
        const {
            name,
            image = [],
            category = [],
            subCategory = [],
            brand,
            unit,
            stock,
            price,
            discount,
            description,
            specifications = {},
            tags = [],
            publish = true,
            featured = false,
            shipping = {
                weight: 0,
                dimensions: { length: 0, width: 0, height: 0 },
                freeShipping: false
            },
            variants = [],
            meta = { title: "", description: "", keywords: [] },
            createdBy
        } = req.body;

        if (!name || image.length === 0 || category.length === 0 || !unit || stock == null || price == null || !description || !createdBy) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Please fill all required fields."
            });
        }

        const newProduct = new ProductModel({
            name,
            image,
            category,
            subCategory,
            brand,
            unit,
            stock,
            price,
            discount,
            description,
            specifications,
            tags,
            publish,
            featured,
            shipping,
            variants,
            meta,
            createdBy
        });

        const savedProduct = await newProduct.save();

        return res.status(201).json({
            success: true,
            error: false,
            message: "Product created successfully!",
            data: savedProduct
        });

    } catch (err) {
        console.error("Create Product Error:", err);
        return res.status(500).json({
            success: false,
            error: true,
            message: err.message || "Internal server error"
        });
    }
};  

export const getProductController = async (request, response) => {
    try {
        let { page, limit, search } = request.body;

        if (!page) page = 1;
        if (!limit) limit = 10;

        const skip = (page - 1) * limit;
        let query = {};

        if (search) {
            // Check if text index is available and use it first
            const textSearchQuery = { $text: { $search: search } };
            const textSearchCount = await ProductModel.countDocuments(textSearchQuery);

            if (textSearchCount > 0) {
                query = textSearchQuery;
            } else {
                // Fallback to regex search if text search doesn't work
                query = { name: { $regex: search, $options: "i" } };
            }
        }

        const [data, totalCount] = await Promise.all([
            ProductModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('category subCategory'),
            ProductModel.countDocuments(query)
        ]);

        return response.json({
            message: "Product data",
            error: false,
            success: true,
            totalCount: totalCount,
            totalNoPage: Math.ceil(totalCount / limit),
            data: data
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const getProductByCategory = async (request, response) => {
    try {
        const { id } = request.body

        if(!id){
            return response.status(400).json({
                message: "Provide Category _id",
                error:true,
                success:false
            })
        }
        const product = await ProductModel.find({
            category: { $in : id}
        }).limit(15)

        return response.json({
            message:"Category Product List",
            data: product,
            error: false,
            success:true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success:false
        })  
    }
}

export const getProductByCategoryAndSubCategory = async (request, response) => {
    try {
        const{categoryId, subCategoryId, page, limit} = request.body

        if(!categoryId || !subCategoryId){
            return response.status(400).json({
                message: "Provide Category and SubCategory _id",
                error:true,
                success:false
            })
        }

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }
        
        const query = {
            category: {$in: categoryId},
            subCategory : {$in: subCategoryId}
        }

        const skip = (page - 1) * limit

        const [data, dataCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt: -1}).skip(skip).limit(limit),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message: "Product List",
            data: data,
            totalCount: dataCount,
            page : page,
            limit: limit,
            success: true,
            error: false
        })

    } catch (error) {
       return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
       }) 
    }
}

    export const getProductDetails = async (request, response) => {
        try {
            const {productId} = request.body
            const product = await ProductModel.findOne({ _id: productId})
            return response.json({
                message: "Single Product Details",
                data: product,
                error: false,
                success: true
                
            })
        } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
        }
    }

//update product
export const updateProduct = async (request, response) => {
    try {
        const {_id} = request.body

        if(!_id){
            return response.status(400).json({
                message: "Provode Product _id",
                error: true,
                success: false
            })
        }

        const updateProduct = await ProductModel.updateOne({_id: _id}, {
            ...request.body
        })

        return response.json({
            message: "Product Updated Successfully!",
            data: updateProduct,
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message, 
            error: true,
            success: false
        })
    }
}

//delete product
export const deleteProductDetails = async (request, response) => {
    try {
        const {_id} = request.body

        if(!_id){
            return response.status(400).json({
                message: "Provide Product _id",
                error: true,
                success: false
            })
        }

        const deleteProduct = await ProductModel.deleteOne({_id: _id})
        return response.json({
            message: "Product Deleted Successfully!",
            error: false,
            success: true,
            data: deleteProduct
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


// export const searchProducts = async (request, response) => {
//   try {
//     let { search, page, limit } = request.body;

//     if (!page) page = 1;
//     if (!limit) limit = 10;

//     let query = {};
//     if (search && search.trim() !== "") {
//       query = {
//         name: { $regex: new RegExp(search, "i") }  // search only in product name
//       };
//     }

//     const skip = (page - 1) * limit;

//     const [data, dataCount] = await Promise.all([
//       ProductModel.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .populate("category subCategory brand"),
//       ProductModel.countDocuments(query)
//     ]);

//     return response.json({
//       message: "Searched Product Data",
//       error: false,
//       success: true,
//       data,
//       totalCount: dataCount,
//       totalPage: Math.ceil(dataCount / limit),
//       page,
//       limit
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       success: false,
//       error: true
//     });
//   }
// };
// controllers/product.controller.js
export const searchProducts = async (request, response) => {
  try {
    let { search, page, limit, filters, sortBy } = request.body;

    if (!page) page = 1;
    if (!limit) limit = 10;

    // Build query
    const queryClauses = [];

    // search on name (existing behavior) - keep case-insensitive partial match
    if (search && search.trim() !== "") {
      queryClauses.push({
        name: { $regex: new RegExp(search.trim(), "i") },
      });
    }

    // filters expected shape (frontend sends):
    // filters = { categories: [id,...], subCategories: [id,...], brands: [id,...], price: { $gte, $lte } }
    if (filters && typeof filters === "object") {
      if (Array.isArray(filters.categories) && filters.categories.length) {
        queryClauses.push({ category: { $in: filters.categories } });
      }
      if (Array.isArray(filters.subCategories) && filters.subCategories.length) {
        queryClauses.push({ subCategory: { $in: filters.subCategories } });
      }
      if (Array.isArray(filters.brands) && filters.brands.length) {
        queryClauses.push({ brand: { $in: filters.brands } });
      }
      if (filters.price && typeof filters.price === "object") {
        const priceObj = {};
        if (filters.price.$gte !== undefined) priceObj.$gte = Number(filters.price.$gte);
        if (filters.price.$lte !== undefined) priceObj.$lte = Number(filters.price.$lte);
        if (Object.keys(priceObj).length) queryClauses.push({ price: priceObj });
      }
      // you can add more filters here (stock, featured, rating etc.)
    }

    const query = queryClauses.length ? { $and: queryClauses } : {};

    // sort mapping: adapt to your needs
    let sort = { createdAt: -1 }; // default newest first
    switch (sortBy) {
      case "priceAsc":
        sort = { price: 1 };
        break;
      case "priceDesc":
        sort = { price: -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "rating":
        sort = { "ratings.average": -1 };
        break;
      case "relevance":
      default:
        // keep text score if text index exists and search present
        if (search && search.trim() !== "") {
          // If you want relevance scoring using text index:
          // ProductModel.find({ $text: { $search: search } }, { score: { $meta: "textScore" } })
          //   .sort({ score: { $meta: "textScore" } })
          // But to keep consistent with previous behavior we use name regex + createdAt fallback
          sort = { createdAt: -1 };
        } else {
          sort = { createdAt: -1 };
        }
    }

    const skip = (page - 1) * limit;

    // If you want to include text score when using text search uncomment the block below and adjust the query.
    const [data, dataCount] = await Promise.all([
      ProductModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("category subCategory brand"),
      ProductModel.countDocuments(query),
    ]);

    return response.json({
      message: "Searched Product Data",
      error: false,
      success: true,
      data,
      totalCount: dataCount,
      totalPage: Math.ceil(dataCount / limit),
      page,
      limit,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};




//get latest products
export const latestProducts = async (request, response) => {
  try {
    const limit = parseInt(request.query.limit) || 10; // optional: set limit via query
    const products = await ProductModel.find({ publish: true })
      .sort({ createdAt: -1 })  // latest products first
      .limit(limit)
      .populate("category subCategory brand")  // optional
      .select("name image price discount stock ratings"); // select only required fields

    return response.json({
      message: "Latest products fetched successfully",
      error: false,
      success: true,
      data: products,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};


export const getSearchSuggestions = async (req, res) => {
  try {
    const { q, limit = 6 } = req.query;
    
    console.log('Search query received:', q); // Debug log
    
    if (!q || q.trim().length < 2) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'Query too short'
      });
    }

    const searchQuery = q.trim();
    
    // Use regex search instead of text index for better compatibility
    const products = await ProductModel.find({
      publish: true,
      name: { 
        $regex: searchQuery, 
        $options: 'i' // case insensitive
      }
    })
    .select('name image slug')
    .limit(parseInt(limit))
    .lean();

    console.log('Found products:', products.length); // Debug log

    // Format the response with minimal data
    const suggestions = products.map(product => ({
      id: product._id,
      name: product.name,
      image: product.image?.[0] || '/default-product.png',
      slug: product.slug
    }));

    return res.status(200).json({
      success: true,
      data: suggestions,
      message: 'Search suggestions fetched successfully'
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};


