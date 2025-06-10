import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
name:{
    type: String,
    required: [true,'Product name is required'],
    trim: true,
},

description:{
    type: String,
    required: [true,'Product description is required'],

},
price:{
    type: Number,   
    required: [true,'Product price is required'],
    maxLength: [7,'Product price must be less than 7 characters'],
},
ratings:{
    type: Number,
    default: 0,
},
image:[
    {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    }
],
stock:{
    type: Number,
    required: [true,'Product stock is required'],
    maxLength: [5,'Product stock must be less than 5 characters'],
    default: 1,
},
numberOfReviews:{
    type: Number,
    default: 0,
},  
reviews:[
    {user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
    },
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        
    }
],
user:{
    type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    required: [true, 'enter user'] }
},{
    timestamps: true,
});
export const Product = mongoose.model('Product', productSchema);