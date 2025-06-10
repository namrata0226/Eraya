import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
const userAuth=asyncHandler(async (req, res, next) => {
  
    const token=req.cookies.accessToken;
    if(!token) {
        throw new ApiError(401, "You are not logged in. Please login to access this resource");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    if (!decodedToken) {
        throw new ApiError(401, "Invalid token. Please login again");
    }
    const {email}=decodedToken;
    if (!email) {
        throw new ApiError(401, "Email not found in token. Please login again");
    }
    // Find the user by email
    
    req.user = await User.findOne({email}); // Attach user info to request object
   
    
    next();
})
 const roleBasedAccess = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return next(new ApiError(403, `No role provided`));
    }

    if (!roles.includes(userRole)) {
      return next(new ApiError(403, `Role - ${userRole} is not allowed to access the resource`));
    }

    next(); // ✅ Only called if access is allowed
  };
};

export { userAuth ,roleBasedAccess};