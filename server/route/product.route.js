// import {Router} from 'express'
// import auth from '../middleware/auth.js'
// import { createProductController, getProductByCategory, getProductController, getProductByCategoryAndSubCategory, getProductDetails, updateProduct, deleteProductDetails, searchProducts, searchSuggestions } from '../controllers/product.controller.js'
// import { admin } from '../middleware/Amin.js'

// const productRouter = Router()

// productRouter.post('/create-product',auth,admin, createProductController)
// productRouter.post('/get-products', getProductController)
// productRouter.post('/get-product-by-category', getProductByCategory)
// productRouter.post('/get-product-by-category-and-subcategory', getProductByCategoryAndSubCategory)
// productRouter.post('/get-product-details', getProductDetails)

// //update product
// productRouter.put('/update-product-details',auth,admin, updateProduct)

// //delete product
// productRouter.delete('/delete-product',auth, admin, deleteProductDetails)

// //search Product for search page.jsx
// productRouter.post('/search-product', searchProducts)

// productRouter.post('/search-suggestions', searchSuggestions)

// export default productRouter 

import { Router } from 'express';
import auth from '../middleware/auth.js';
import { 
  createProductController, 
  getProductByCategory, 
  getProductController, 
  getProductByCategoryAndSubCategory, 
  getProductDetails, 
  updateProduct, 
  deleteProductDetails, 
  searchProducts, 
  latestProducts,
  getSearchSuggestions,
  shareProductController
} from '../controllers/product.controller.js';
import { admin } from '../middleware/admin.js';

const productRouter = Router();

productRouter.post('/create-product', auth, admin, createProductController);
productRouter.post('/get-products', getProductController);
productRouter.post('/get-product-by-category', getProductByCategory);
productRouter.post('/get-product-by-category-and-subcategory', getProductByCategoryAndSubCategory);
productRouter.post('/get-product-details', getProductDetails);

// update product
productRouter.put('/update-product-details', auth, admin, updateProduct);

// delete product
productRouter.delete('/delete-product', auth, admin, deleteProductDetails);

// search Product for search page.jsx
productRouter.post('/search-product', searchProducts);
productRouter.get('/productsearchsuggestions', getSearchSuggestions);


// ✅ Latest Products
productRouter.get('/latest-products', latestProducts); // optional: ?limit=10

//share product link can be handled on client side by copying the URL
productRouter.get("/share/product/:slug", shareProductController);


export default productRouter;
