import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  getUserDetails,
  updatePassword
  , updateUserProfile,
  getUserList,
  getSingleUser,
  updateUserRole,
  deleteUser
} from "../controllers/user.controller.js";
import {roleBasedAccess, userAuth} from "../middleware/userAuth.middleware.js";


const router = Router();
// Routes
router
  .route("/register")
  .post(registerUser)
 router.route("/login")
  .post(loginUser);
router.route("/logout").post(logoutUser)
router.route("/forgot/password").post(requestPasswordReset)
router.route("/reset/:id").post(resetPassword)
router.route("/profile").get(userAuth, getUserDetails)
router.route("/update/password").put(userAuth, updatePassword)
router.route("/update/profile").put(userAuth, updateUserProfile)
router.route("/admin/users").get(userAuth,roleBasedAccess('admin') ,getUserList )
router.route("/admin/user/:id").
get(userAuth,roleBasedAccess('admin'), getSingleUser)
.put(userAuth, roleBasedAccess('admin'), updateUserRole)
.delete(userAuth, roleBasedAccess('admin'),deleteUser)

 
  export default router;