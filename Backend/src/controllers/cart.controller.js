import { Cart } from "../models/Cart.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllProductsFromCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(401 , "Not Authorized for this Process")
    }
    const cart = await Cart.findOne({userId}).populate("Items.ProductId");
    const total = cart.Items.length;
    if (!cart){
        throw new ApiError(401 , "Not authorized For this action")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200 , { total , cart} , "Cart Products are Fetched Successfully")
    )

});

const addToCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  // for first time user adding product to the cart i will first create a cart for him
  if (!productId) {
    throw new ApiError(422, "ProductId is Required for further Processing");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product Not Found");
  }
  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    // cart = await Cart.create({ userId: req.user._id, Items: [] });
    throw new ApiError(401 , "You are not registered for this action")
  }

  const itemsIndex = cart.Items.findIndex(
    (prod) => prod.ProductId.toString() === productId.toString()
  );
  console.log(itemsIndex)
  if (itemsIndex > -1 && cart.Items[itemsIndex].Quantity < product.stock) {
    cart.Items[itemsIndex].Quantity += 1;
  } else {
    cart.Items.push({
      ProductId: productId,
      Quantity: 1,
      priceAtTime: product.price,
    });
  }

  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate(
    "Items.ProductId"
  );
  if (!populatedCart) {
    throw new ApiError(500, "Server Error Occured while Populating the Cart");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, populatedCart, "Product is Added Successfully"));
});

const deleteFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    throw new ApiError(
      404,
      "Cart Not Found related to that particular User OR Have No Product Yet Added"
    );
  }

  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(422, "ProductID is required for The Process");
  }

  cart.Items = cart.Items.filter(
    (item) => item.ProductId.toString() !== productId.toString()
  );
  cart.save();
  const populatedCart = await Cart.findById(cart._id).populate("Items.ProductId");
  return res
    .status(200)
    .json(new ApiResponse(200, populatedCart, "Cart is Deleted Successfully"));
});

export { getAllProductsFromCart, addToCart, deleteFromCart };
