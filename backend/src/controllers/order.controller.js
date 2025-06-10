import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";    
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

const createNewOrder = asyncHandler(async (req, res) => {
const {shippingInfo,orderItems,paymentInfo,itemPrice,taxPrice,shippingPrice,totalPrice}=req.body;

const order=await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt:Date.now(),
    user:req.user._id
})
if(!order){
    throw new ApiError(500,"Something went wrong while creating order");
}

res.status(201).json(new ApiResponse(200, order, "Order created successfully"));
})
const getSingleOrder=asyncHandler(async(req,res)=>{
 const order=await Order.findById(req.params.id).populate("user","name email")
 if(!order){
    throw new ApiError(404, "Order not found");
  }
    res.status(200).json(new ApiResponse(200, order, "Order details fetched successfully"));
})
//user can see all his orders
 const allMyOrders=asyncHandler(async(req,res)=>{
 const orders=await Order.find({user:req.user._id});
 if(!orders){
    throw new ApiError(404, "No orders found for this user");
}
    res.status(200).json(new ApiResponse(200, orders, "Orders fetched successfully"));
})
//admin can see all orders
const getAllOrders=asyncHandler(async(req,res)=>{
 const orders=await Order.find()
 if(!orders){
    throw new ApiError(404, "No orders found");
} let totalAmount=0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice
    })
    res.status(200).json(new ApiResponse(200, {orders,totalAmount}, "All orders fetched successfully"));
})
const  updateOrderStatus=asyncHandler(async(req,res)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new ApiError(404 , "Order not found"));
    }
    if(order.orderStatus==='Delivered'){
        throw new ApiError(400, "You have already delivered this order");
    }
    await Promise.all(order.orderItems.map(item=>updateQuantity(item.product,item.quantity)
    ))
    order.orderStatus=req.body.status;
    if(order.orderStatus==='Delivered'){
        order.deliveredAt=Date.now();
    }
    await order.save({validateBeforeSave:false})
    res.status(200).json(new ApiResponse(200, order, "Order status updated successfully"));
})
async function updateQuantity(id,quantity){
    const product=await Product.findById(id);
    if(!product){
        throw new ApiError(404,"Product not found");
    }
    product.stock-=quantity
    await product.save({validateBeforeSave:false})
}
const deleteOrder=asyncHandler(async(req,res)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        throw new ApiError(404,"Order not found");
    }
    if(order.orderStatus!=='Delivered'){
        new ApiError(404,"This order is under processing and cannot be deleted");

    }
    await Order.deleteOne({_id:req.params.id});
    res.status(200).json(new ApiResponse(200, {}, "Order deleted successfully"));
})
export { createNewOrder, getSingleOrder , allMyOrders, getAllOrders, updateOrderStatus, deleteOrder };