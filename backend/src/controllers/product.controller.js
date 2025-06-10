import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import APIFunctionality from "../utils/apiFunctionality.js";
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, image } = req.body;
  
req.body.user = req.user._id;
console.log(req.body.user);
  if ([name, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const product = await Product.create({
    name,
    description,
    price,
    image,
    user: req.body.user,
  });

  if (!product) {
    throw new Error(500, "Something went wrong while creating product");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, product, "Product created Successfully"));
});

const getAllProducts = asyncHandler(async (req, res) => {
  const resultsPerPage = 4;
  const apiFeatures = new APIFunctionality(Product.find(), req.query)
    .search()
    .filter();

  //    Getting filtered query before pagination
  const filteredQuery = apiFeatures.query.clone();
  const productCount = await filteredQuery.countDocuments();

  // Calculate totalPages based on filtered count
  const totalPages = Math.ceil(productCount / resultsPerPage);
  const page = Number(req.query.page) || 1;

  if (page > totalPages && productCount > 0) {
    throw new ApiError(400, "This page doesn't exist", errorr);
  }

  //Apply pagination
  apiFeatures.pagination(resultsPerPage);
  const products = await apiFeatures.query;

  if (!products || products.length === 0) {
    throw new ApiError(400, "No Product Found", errorr);
  }
  const finalres = {
    products,
    productCount,
    resultsPerPage,
    totalPages,
    currentPage: page,
  };
  return res
    .status(200)
    .json(new ApiResponse(200, finalres, "Product fetched successfully"));
});
const updateProduct = asyncHandler(async (req, res) => {
  const prod_id = req.params.id;
  if (!prod_id) throw new ApiError(400, "Id is required", error);
  const product = await Product.findById(prod_id);
  if (!product) throw new ApiError(500, "Product not found", error);
  const newProduct = await Product.findByIdAndUpdate(prod_id, req.body, {
    new: true,
  });
  console.log(newProduct);

  return res
    .status(200)
    .json(
      new ApiResponse(200, newProduct, "Account details updated successfully")
    );
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return new ApiError(400, "Product Not Found", error);
  }

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product Deleted successfully"));
});
const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product Not Found", error);
  }
  res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});
 const createReviewForProduct = asyncHandler(async (req, res) => {
    const { rating, comment, productId } = req.body;
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found", error);
    }
    const reviewExists = product.reviews.find(
      (review) => review.user.toString() === req.user.id.toString()
    );
    if (reviewExists) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user.id.toString()) {
          (review.rating = rating), (review.comment = comment);
        }
      });
    } else {
      product.reviews.push(review);
    }
    product.numberOfReviews = product.reviews.length;
    let sum = 0;
    product.reviews.forEach((review) => {
      sum += review.rating;
    });
    product.ratings =
      product.reviews.length > 0 ? sum / product.reviews.length : 0;
    await product.save({ validateBeforeSave: false });
    res.status(200).json(new ApiResponse(200, product, "Review added successfully")); 
  }
);

const getProductReviews= asyncHandler(async (req, res) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    throw new ApiError(404, "Product not found", error);
  }
  res.status(200).json(new ApiResponse(200, product.reviews, "Reviews fetched successfully"));
});
 const deleteReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    throw new ApiError(404, "Product not found", error);
  }
  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );
  let sum = 0;
  reviews.forEach((review) => {
    sum += review.rating;
  });
  const ratings = reviews.length > 0 ? sum / reviews.length : 0;
  const numberOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numberOfReviews,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json(new ApiResponse(200, reviews, "Review deleted successfully"));
})
const getAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  if (!products || products.length === 0) {
    throw new ApiError(404, "No products found", error);
  }

  res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
});

export {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  getAdminProducts,
  createReviewForProduct,
  getProductReviews,
  deleteReview
};
