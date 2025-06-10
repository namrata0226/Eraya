import { Router } from "express";
import {
  createNewOrder,
  getSingleOrder,
  allMyOrders,
  updateOrderStatus,
 getAllOrders,

} from "../controllers/order.controller.js";
import { roleBasedAccess, userAuth } from "../middleware/userAuth.middleware.js";
import { deleteOrder } from "../controllers/order.controller.js";

const router = Router();
// Routes
router
  .route("/order/new")
  .post(userAuth, createNewOrder);
router.route("/admin/order/:id").get(userAuth,roleBasedAccess('admin'),getSingleOrder)
.put(userAuth,roleBasedAccess('admin'),updateOrderStatus)
.delete(userAuth,roleBasedAccess("admin"),deleteOrder)
router.route("/admin/orders").get(userAuth, roleBasedAccess("admin"),getAllOrders);
router
  .route("/orders/user").get(userAuth, allMyOrders);
   
  export default router;