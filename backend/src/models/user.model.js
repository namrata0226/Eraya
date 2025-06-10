import mongoose from "mongoose";
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
const userSchema = mongoose.Schema({
      name:{
        type:String,
        required:[true,"Please Enter your name"],
        maxLength:[25,"Invalid name. Please enter a name with fewer than 25 characters"],
        minLength:[3,"Name should contain more than 3 characters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter your email"],
        unique:true,
        validate:[validator.isEmail,"Please enter valid email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter your password"],
        minLength:[8,"Password should be greater than 8 characters"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
},{
    timestemps:true
})
userSchema.pre("save", async function(next){
if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
  
};
userSchema.methods.getJWTToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.JWT_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generatePasswordResetToken=function(){
    const resetToken=crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire=Date.now()+30*60*1000 //30minutes
    return resetToken;
}
export const User = mongoose.model("User", userSchema); 
