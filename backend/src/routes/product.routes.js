import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
  getSingleProduct,
  getAdminProducts,
  createReviewForProduct,
  getProductReviews,
  deleteReview
} from "../controllers/product.controller.js";
import {roleBasedAccess, userAuth} from "../middleware/userAuth.middleware.js";
const router = Router();
// Routes

///for user
router
  .route("/products").get(getAllProducts)//
router
  .route("/product/:id").get(getSingleProduct)
router
  .route("/review").post(userAuth,createReviewForProduct)
 router.route("/reviews").get(getProductReviews).delete(deleteReview);
//for admin
  router
  .route("/admin/products")
  .get(userAuth,roleBasedAccess("admin"),getAdminProducts)
  .post(userAuth,roleBasedAccess("admin"),
    createProduct);

router
  .route("/admin/product/:id")
  .put(userAuth,roleBasedAccess("admin"),updateProduct)
  .delete(userAuth,roleBasedAccess("admin"),deleteProduct)
 
export default router;
