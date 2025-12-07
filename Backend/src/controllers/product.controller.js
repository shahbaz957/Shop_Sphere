import mongoose from "mongoose";
import { Product } from "../models/product.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

const addProduct = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user.isAdmin) {
    throw new ApiError(401, "Unauthorized Access");
  }
  const { name, category, shortDesc, stock, price, description } = req.body;

  const stockNumber = Number(stock);
  const priceNumber = Number(price);
  if (
    [name, category, shortDesc, description].some((f) => !f || f.trim() === "")
  ) {
    throw new ApiError(422, "All fields are required");
  }
  if (isNaN(stockNumber) || isNaN(priceNumber)) {
    throw new ApiError(422, "Stock and Price must be numbers");
  }
  const alreadyProduct = await Product.findOne({ name });
  if (alreadyProduct) {
    const updatedProd = await Product.findByIdAndUpdate(
      alreadyProduct._id,
      {
        $inc: {
          stock: stockNumber,
        },
      },
      {
        new: true,
      }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedProd,
          "Stock of already Existed Product is increased Successfully"
        )
      );
  }

  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) {
    throw new ApiError(422, "Image of Product is Required");
  }
  const imageUpload = await uploadCloudinary(imageLocalPath);
  if (!imageUpload) {
    throw new ApiError(500, "Server error Cloudinary Upload Failed");
  }
  const newProduct = await Product.create({
    name,
    category,
    shortDesc,
    description,
    stock: stockNumber,
    price: priceNumber,
    image: {
      url: imageUpload.url,
      public_id: imageUpload.public_id,
    },
  });

  if (!newProduct) {
    throw new ApiError(500, "Error Occured while Creating the Product");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newProduct, "Product is Added Successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user.isAdmin) {
    throw new ApiError(401, "Unauthorized Access");
  }
  const { productId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(409, "Product Id is Invalid");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product Not Found");
  }

  if (product.image?.public_id) {
    await cloudinary.uploader.destroy(product.image.public_id);
  }

  const deletedProduct = await Product.findByIdAndDelete(productId);

  if (!deletedProduct) {
    throw new ApiError(501, "Product is not deleted Successfully");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedProduct, "Product Is deleted Successfully")
    );
});

const getAllProducts = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const products = await Product.find().skip(skip).limit(limit);

  if (products.length === 0) {
    throw new ApiError(500, "Server Failed to fetch the Products");
  }

  const total = await Product.countDocuments();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { products, total, totalPages: Math.ceil(total / limit), page },
        "Products are fetched Successfully"
      )
    );
});

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(422, "Product Id is Required for fetching the Product");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product Not Found");
  }
});

const getProductCount = asyncHandler(async (req, res) => {
  const total = await Product.countDocuments();
  return res
    .status(200)
    .json(new ApiResponse(200, total, "Total Product Count is Fetched"));
});

const getLowStockProducts = asyncHandler(async (req, res) => {
  const lowStProducts = await Product.find({ stock: { $lt: 10 } });
  if (!lowStProducts) {
    throw new ApiError(501, "Server Failed to Fetch the Low Stock products");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        lowStProducts,
        "Low Stock Products are fetched Successfully"
      )
    );
});

export {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductCount,
  getLowStockProducts,
};
