import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

const options = {
  httpOnly: true,
  secure: true, // now cookies can be modified only by sever,not by fronend
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if ([name, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "TemperaryID",
      url: "TempURL",
    },
  });
  res.status(200).json(new ApiResponse(200, user, "User register successfuly"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!(email || password)) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findOne({ email }).select("+password"); //selecting password field as it is not selected by default
 
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  const accessToken = await user.getJWTToken();

  //user has no referens of access token so either update old user with access token field or again run query.

  //Now sending cockies

  return res
    .status(200)
    .cookie("accessToken", accessToken, options) //setting cookies
    .json(
      new ApiResponse(
        200,
        {
          _id: user._id,
          accessToken,
        },
        "User logged in successfuly"
      )
    );
});
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, null, "User logged out successfuly"));
});
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }         
    let resetToken;
    try{
        resetToken=user.generatePasswordResetToken()
        await user.save({validateBeforeSave:false})
       
    }catch(error){
        throw new ApiError(500, "Could not generate reset token, please try again later");
       }
        const resetPasswordURL=`${req.protocol}://${req.get('host')}/reset/${resetToken}`;
    const message = `Use the following link to reset your password: ${resetPasswordURL}. \n\n This link will expire in 30 minutes.\n\n If you didn’t request a password reset, please ignore this message.`;
    try{
// Send Email
        await sendEmail({
            email:user.email,
            subject:'Password Reset Request',
            message
        })
      
        res.status(200).json(new ApiResponse(200, user.email, `Email is sent to ${user.email} successfully`))
    }catch(error){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false})
        throw new ApiError(500, `Email couldn't be sent, please try again later ${error}` );
    }
    })
    const resetPassword = asyncHandler(async (req, res) => {
  const token  = req.params.id;

const resetPasswordToken=crypto.createHash("sha256").update(req.params.id).digest("hex");

      //const resetPasswordToken=crypto.createHash("sha256").update(token).digest("hex");
    
  const user=await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{$gt:Date.now()}
})
  
        // If user is not found or token is expired
  if(!user) {
      throw new ApiError(404, "Invalid or expired reset token");
    }
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      throw new ApiError(400, "All fields are required");
    }
    
    
    if (password !== confirmPassword) {
      throw new ApiError(400, "Passwords do not match");
    }
    user.password = password;
    user.resetPasswordToken = undefined;    
    user.resetPasswordExpire = undefined;
    await user.save();
res.status(200).json(new ApiResponse(200, user, "Password reset successfuly"));
 })
 const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json(new ApiResponse(200, user, "User details fetched successfully"));  }  )
 const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;    
  if (!oldPassword || !newPassword || !confirmNewPassword) {
    throw new ApiError(400, "All fields are required");
    }
    if (newPassword !== confirmNewPassword) {
      throw new ApiError(400, "New passwords do not match");
    }
    const user = await User.findById(req.user._id).select("+password");     
    if (!user) {
      throw new ApiError(404, "User not found");
    }       
    const isOldPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isOldPasswordValid) {
      throw new ApiError(401, "Invalid old password");
    }
    user.password = newPassword;
    await user.save();  
    res.status(200).json(new ApiResponse(200, user, "Password updated successfully"));
  })
  const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body; 
    if (!name || !email) {
        throw new ApiError(400, "All fields are required"); 
    }
    const updateUser={
name,
email
    }
    const user = await User.findByIdAndUpdate(req.user.id, updateUser, {
      new: true,
      runValidators: true,
    }).select("+password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    
    
  
    res.status(200).json(new ApiResponse(200, user, "User profile updated successfully"));
  })

  const getUserList = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");  
    if (!users) {
        throw new ApiError(404, "No users found");
    }       

    res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
})
const getSingleUser=asyncHandler(async(req,res)=>{
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "User ID is required");
    }
    const user = await User.findById(id).select("-password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponse(200, user, "User details fetched successfully"));

    
})
const updateUserRole= asyncHandler(async (req, res) => {
    const { id } = req.params;
     const {role}=req.body;
    if (!id) {
        throw new ApiError(400, "User ID is required");
    }
  
    if (!role) {
        throw new ApiError(400, "Role is required");
    }
    const newUserData={
        role
    }
    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true
    }).select("-password");
    if(!user){
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponse(200, user, "User role updated successfully"));
 })
 const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;            
    if (!id) {
        throw new ApiError(400, "User ID is required");
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponse(200, user, "User deleted successfully"));
    });

  export { registerUser, loginUser, logoutUser, requestPasswordReset ,resetPassword, getUserDetails, updatePassword , updateUserProfile,getUserList, getSingleUser , updateUserRole, deleteUser };
 