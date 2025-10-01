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


export const searchProducts = async (request, response) => {
  try {
    let { search, page, limit } = request.body;

    if (!page) page = 1;
    if (!limit) limit = 10;

    let query = {};
    if (search && search.trim() !== "") {
      query = {
        name: { $regex: new RegExp(search, "i") }  // search only in product name
      };
    }

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory brand"),
      ProductModel.countDocuments(query)
    ]);

    return response.json({
      message: "Searched Product Data",
      error: false,
      success: true,
      data,
      totalCount: dataCount,
      totalPage: Math.ceil(dataCount / limit),
      page,
      limit
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true
    });
  }
};

// searchSuggestion controller
export const searchSuggestions = async (request, response) => {
  try {
    let { search } = request.body;

    if (!search || search.trim() === "") {
      return response.json({
        message: "Please provide a search term",
        error: false,
        success: true,
        data: [],
      });
    }

    const searchRegex = new RegExp(search, "i");
    
    const suggestions = await ProductModel.find({
      name: { $regex: searchRegex }
    })
    .select("name image")
    .limit(10)
    .sort({ createdAt: -1 });

    return response.json({
      message: "Search suggestions",
      error: false,
      success: true,
      data: suggestions,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true
    });
  }
};

