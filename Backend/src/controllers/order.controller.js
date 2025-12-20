import { Order } from "../models/order.model.js";
import { Product } from "../models/product.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const orderProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user?._id;
  const { quantity } = req.body;

  if (!productId) {
    throw new ApiError(422, "ProductId is required");
  }
  if (!userId) {
    throw new ApiError(401, "Unauthorized Access");
  }

  if (quantity <= 0) {
    throw new ApiError(422, "Quantity Must be Atleast One");
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product Not Found");
  }
  if (product.stock < quantity) {
    throw new ApiError(400, "Not Enough Stock Available");
  }

  product.stock -= quantity;
  await product.save();
  const order = await Order.create({
    userId,
    productId,
    quantity,
    UnitPrice: product.price,
  });

  if (!order) {
    throw new ApiError(501, "Error Occured while creating the order on Server");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order is created !!!"));
});

const getAllOrders = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "Unauthorized Access. Failed to Access");
  }
  const orders = await Order.find({ status: "Pending" }).populate("productId").populate("userId");
  if (!orders) {
    throw new ApiError(500, "Server Failed to Fetch the Orders");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders are fetched successfully"));
});

const getOrdersByUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized to Perform Action");
  }

  const pendingOrders = await Order.find({
    userId,
    status: "Pending",
  }).populate("productId");
  
  const deliveredOrders = await Order.find({
    userId,
    status: "Delivered",
  }).populate("productId");
  if (!pendingOrders || !deliveredOrders) {
    throw new ApiError(500, "Server failed to fetch the orders");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { pending: pendingOrders, delivered: deliveredOrders },
        "Orders are fetched for the user"
      )
    );
});

const deleteOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;

  if (!orderId) {
    throw new ApiError(422, "orderId is needed");
  }
  if (!userId) {
    throw new ApiError(401, "Unauthorized Action");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const product = await Product.findById(order.productId);
  if (product) {
    product.stock += order.quantity;
    await product.save();
  }

  const deletedOrder = await Order.findOneAndDelete({
    _id: orderId,
    userId
  });

  if (!deletedOrder) {
    throw new ApiError(404, "Order is not deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedOrder, "Order is Deleted Successfully"));
});


const totalEarningAndSales = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "unAuthorized Action");
  }
  const totalSales = await Order.countDocuments({ status: "Delivered" });

  const totalEarningAggregate = await Order.aggregate([
    { $match: { status: "Delivered" } },
    {
      $group: {
        _id: null, // group all the elements in single group
        earnings: {
          $sum: {
            $multiply: ["$quantity", "$UnitPrice"],
          },
        },
      },
    },
  ]);
  const totalEarning = totalEarningAggregate[0]?.earnings || 0;
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { sales: totalSales, earning: totalEarning },
        "Sales and Earning are fetched"
      )
    );
});

const toggleOrder =  asyncHandler(async (req , res) => {
    if (!req.user.isAdmin){
        throw new ApiError(401 , "Unauthorized Access");
    }
    const {orderId} = req.params;
    if (!orderId) {
        throw new ApiError(422 , "Order Id is required")
    }
    const order = await Order.findById(orderId);
    if (!order){
        throw new ApiError(404 , "Product Not Found")
    }
    order.status = "Delivered";
    await order.save();

    return res
    .status(200)
    .json(new ApiResponse(200 , order, "Status is toggled"))


})
export {    
  orderProduct,
  getAllOrders,
  getOrdersByUser,
  deleteOrder,
  totalEarningAndSales,
  toggleOrder
};
