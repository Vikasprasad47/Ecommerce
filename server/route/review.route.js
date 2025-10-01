import {Router} from 'express'
import {
  createReview,
  getReviewsByProduct,
  updateReview,
  deleteReview,
  markReviewHelpful
} from "../controllers/reviewController.js";
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';


const reviewRouter = Router()

reviewRouter.post("/product/:productId", auth, upload.array("images", 5), createReview);
reviewRouter.get("/product/:productId", getReviewsByProduct);
reviewRouter.put("/:id", auth, updateReview);
reviewRouter.delete("/:id", auth, deleteReview);
reviewRouter.patch("/helpful/:id",auth, markReviewHelpful);


//for testing if this router response 
reviewRouter.get("/test", (req, res) => res.send("Review API is working"));


export default reviewRouter;
